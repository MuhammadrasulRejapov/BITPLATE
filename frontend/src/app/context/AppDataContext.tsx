import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, TableDto, OrderDto, HistoryEntryDto, OrderItemDto } from '../api/client';

export type TableStatus = 'Free' | 'Reserved' | 'Occupied' | 'AwaitingBill' | 'Cleared';
export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Served';

// Re-export DTO aliases so existing pages compile without changes
export type TableData      = TableDto;
export type OrderItem      = OrderItemDto;
export type Order          = OrderDto;
export type HistoryEntry   = HistoryEntryDto;

interface CloseBillPayload {
  orderId: string;
  paymentMethod: string;
  discount: number;
  tip: number;
  total: number;
}

interface AppDataContextType {
  tables: TableData[];
  orders: Order[];
  history: HistoryEntry[];
  isLoading: boolean;
  error: string | null;
  newOrderAlert: boolean;
  dismissNewOrderAlert: () => void;
  seatGuests: (tableId: number, guestCount: number, waiterName?: string) => void;
  addOrder: (tableNumber: number, items: OrderItem[], waiter: string) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  closeBill: (payload: CloseBillPayload) => void;
  getActiveOrderByTable: (tableNumber: number) => Order | undefined;
  refreshTables: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [tables,   setTables]   = useState<TableData[]>([]);
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [history,  setHistory]  = useState<HistoryEntry[]>([]);
  const [isLoading,setIsLoading]= useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  const refreshTables = useCallback(async () => {
    const data = await api.getTables();
    setTables(data);
  }, []);

  const refreshOrders = useCallback(async () => {
    const data = await api.getOrders();
    setOrders(data);
  }, []);

  const refreshHistory = useCallback(async () => {
    const data = await api.getHistory();
    setHistory(data);
  }, []);

  useEffect(() => {
    Promise.all([refreshTables(), refreshOrders(), refreshHistory()])
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [refreshTables, refreshOrders, refreshHistory]);

  // Observer pattern: poll for new order events every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const events = await api.pollEvents();
        if (events.some(e => e.eventType === 'NewOrder')) {
          setNewOrderAlert(true);
          await refreshOrders();
          await refreshTables();
        }
        if (events.some(e => ['OrderStatusChanged','OrderReady','OrderCancelled'].includes(e.eventType))) {
          await refreshOrders();
          await refreshTables();
        }
      } catch { /* server not running — ignore */ }
    }, 3000);
    return () => clearInterval(interval);
  }, [refreshOrders, refreshTables]);

  const seatGuests = useCallback(async (tableId: number, guestCount: number, waiterName?: string) => {
    try {
      const updated = await api.seatGuests(tableId, guestCount, waiterName);
      setTables(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, []);

  const addOrder = useCallback((tableNumber: number, items: OrderItem[], waiter: string): string => {
    // Optimistic local ID; real ID resolved after API responds
    const tempId = `ORD-TEMP-${Date.now()}`;
    api.createOrder(tableNumber, items, waiter)
      .then(({ id }) => {
        setOrders(prev => prev.map(o => o.id === tempId ? { ...o, id } : o));
        refreshTables();
      })
      .catch(e => setError(e.message));

    const newOrder: Order = {
      id: tempId, tableNumber, time: new Date().toLocaleTimeString('uz-UZ', {hour:'2-digit',minute:'2-digit'}),
      status: 'Pending', waiter, items,
    };
    setOrders(prev => [...prev, newOrder]);
    setTables(prev => prev.map(t =>
      t.number === tableNumber && (t.status === 'Free' || t.status === 'Reserved')
        ? { ...t, status: 'Occupied' as TableStatus }
        : t
    ));
    setNewOrderAlert(true);
    return tempId;
  }, [refreshTables]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await api.advanceOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch {
      // fallback: optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  }, []);

  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      await api.cancelOrder(orderId);
    } catch { /* ignore if server down */ }
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      if (order) {
        const remaining = prev.filter(o => o.id !== orderId && o.tableNumber === order.tableNumber);
        if (remaining.length === 0)
          setTables(t => t.map(table =>
            table.number === order.tableNumber
              ? { ...table, status: 'Free' as TableStatus, currentGuests: 0 }
              : table
          ));
      }
      return prev.filter(o => o.id !== orderId);
    });
  }, []);

  const closeBill = useCallback(async (payload: CloseBillPayload) => {
    try {
      const entry = await api.closeBill(
        payload.orderId, 'standard', payload.tip, payload.paymentMethod
      );
      setHistory(prev => [entry, ...prev]);
      setOrders(prev => prev.filter(o => o.id !== payload.orderId));
      await refreshTables();
    } catch {
      // fallback: optimistic
      setOrders(prev => prev.filter(o => o.id !== payload.orderId));
      await refreshTables();
    }
  }, [refreshTables]);

  const getActiveOrderByTable = useCallback((tableNumber: number): Order | undefined =>
    orders.find(o => o.tableNumber === tableNumber && o.status !== 'Served'),
  [orders]);

  const dismissNewOrderAlert = useCallback(() => setNewOrderAlert(false), []);

  return (
    <AppDataContext.Provider value={{
      tables, orders, history, isLoading, error,
      newOrderAlert, dismissNewOrderAlert,
      seatGuests, addOrder, updateOrderStatus,
      cancelOrder, closeBill, getActiveOrderByTable,
      refreshTables, refreshOrders,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
