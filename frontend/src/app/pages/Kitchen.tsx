import { useState, useEffect } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ChefHat, Clock, Undo, Bell } from 'lucide-react';
import { useAppData, OrderStatus } from '../context/AppDataContext';
import { LoadingSpinner, ErrorMessage } from '../components/shared/LoadingSpinner';
import { api } from '../api/client';

export default function Kitchen() {
  const {
    orders, newOrderAlert, dismissNewOrderAlert,
    updateOrderStatus, cancelOrder, isLoading, error,
  } = useAppData();

  const [canUndo,    setCanUndo]    = useState(false);
  const [undoMsg,    setUndoMsg]    = useState<string | null>(null);
  const [showAlert,  setShowAlert]  = useState(false);

  const activeOrders = orders.filter(o => o.status !== 'Served');

  useEffect(() => {
    if (newOrderAlert) {
      setShowAlert(true);
      const timer = setTimeout(() => { setShowAlert(false); dismissNewOrderAlert(); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newOrderAlert, dismissNewOrderAlert]);

  if (isLoading) return <LoadingSpinner message="Oshxona navbati yuklanmoqda..." />;
  if (error)     return <ErrorMessage message={error} />;

  const handleAdvance = async (orderId: string, next: OrderStatus) => {
    await updateOrderStatus(orderId, next);
    setCanUndo(true);
  };

  const handleCancel = (orderId: string) => {
    if (!confirm('Buyurtmani bekor qilishni xohlaysizmi?')) return;
    cancelOrder(orderId);
    setCanUndo(false);
  };

  const handleUndo = async () => {
    try {
      const { undone } = await api.undoKitchen();
      setUndoMsg(undone);
      setCanUndo(false);
      setTimeout(() => setUndoMsg(null), 3000);
    } catch { setCanUndo(false); }
  };

  const statusColor: Record<OrderStatus, string> = {
    Pending:   'bg-yellow-500/20 text-yellow-400',
    Preparing: 'bg-blue-500/20 text-blue-400',
    Ready:     'bg-green-500/20 text-green-400',
    Served:    'bg-gray-500/20 text-gray-400',
  };

  const statusLabel: Record<OrderStatus, string> = {
    Pending: 'Kutilmoqda', Preparing: 'Tayyorlanmoqda',
    Ready: 'Tayyor', Served: 'Xizmat qilindi',
  };

  const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
    Pending: 'Preparing', Preparing: 'Ready', Ready: 'Served',
  };

  const nextStatusLabel: Partial<Record<OrderStatus, string>> = {
    Pending: 'Tayyorlashni boshlash', Preparing: 'Tayyor deb belgilash', Ready: 'Xizmat qilindi',
  };

  return (
    <div className="flex-1 overflow-auto">
      <AppHeader title="Oshxona navbati" subtitle={`Faol: ${activeOrders.length} ta buyurtma`} />

      {showAlert && (
        <div className="mx-6 mt-4 p-4 bg-[#e94560]/20 border border-[#e94560]/50 rounded-lg flex items-center gap-3 animate-pulse">
          <Bell className="w-5 h-5 text-[#e94560] flex-shrink-0" />
          <span className="text-white font-semibold">Yangi buyurtma keldi!</span>
          <Button onClick={() => { setShowAlert(false); dismissNewOrderAlert(); }}
            variant="ghost" size="sm" className="ml-auto text-white/60 hover:text-white px-2">✕</Button>
        </div>
      )}

      {undoMsg && (
        <div className="mx-6 mt-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm">↩ Bekor qilindi: {undoMsg}</p>
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <ChefHat className="w-6 h-6 text-[#e94560]" />
            <span className="text-xl font-semibold">Buyurtmalar</span>
          </div>
          {canUndo && (
            <Button onClick={handleUndo} variant="outline"
              className="border-white/10 text-white hover:bg-white/5">
              <Undo className="w-4 h-4 mr-2" />
              Oxirgi amalni bekor qilish
            </Button>
          )}
        </div>

        {activeOrders.length === 0 ? (
          <Card className="bg-[#0f3460] border-white/10">
            <CardContent className="p-12 text-center">
              <ChefHat className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg">Hozircha buyurtma yo'q</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeOrders.map(order => {
              const nextStatus = nextStatusMap[order.status as OrderStatus];
              return (
                <Card key={order.id} className="bg-[#0f3460] border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{order.id}</CardTitle>
                        <p className="text-white/60 text-sm mt-1">Stol {order.tableNumber}</p>
                      </div>
                      <Badge className={statusColor[order.status as OrderStatus]}>
                        {statusLabel[order.status as OrderStatus]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{order.time}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm">
                          <div className="text-white">• {item.name} x{item.qty}</div>
                          {item.addons.length > 0 && (
                            <div className="text-white/60 text-xs ml-3">
                              {item.addons.map((addon, i) => (
                                <span key={i}>- {addon.name} </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      {nextStatus && (
                        <Button onClick={() => handleAdvance(order.id, nextStatus)}
                          className="w-full bg-[#e94560] hover:bg-[#e94560]/90 text-white">
                          {nextStatusLabel[order.status as OrderStatus]}
                        </Button>
                      )}
                      <Button onClick={() => handleCancel(order.id)} variant="outline"
                        className="w-full border-white/10 text-white/80 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30">
                        Bekor qilish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
