const BASE = '/api';

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('biteplate_auth');
    return raw ? JSON.parse(raw).token : null;
  } catch { return null; }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // Tables
  getTables: ()                                   => request<TableDto[]>('/tables'),
  getTable:  (id: number)                         => request<TableDto>(`/tables/${id}`),
  seatGuests:(id: number, guestCount: number, waiterName?: string) =>
    request<TableDto>(`/tables/${id}/seat`, { method:'POST', body: JSON.stringify({ guestCount, waiterName }) }),
  reserveTable:(id: number, guestName: string, reservationTime: string) =>
    request<TableDto>(`/tables/${id}/reserve`, { method:'POST', body: JSON.stringify({ guestName, reservationTime }) }),
  clearTable:(id: number)                         =>
    request<TableDto>(`/tables/${id}/clear`, { method:'POST' }),

  // Orders
  getOrders:           ()             => request<OrderDto[]>('/orders'),
  getOrder:            (id: string)   => request<OrderDto>(`/orders/${id}`),
  getActiveOrderByTable:(tableNum: number) => request<OrderDto>(`/orders/table/${tableNum}`),
  createOrder:(tableNumber: number, items: OrderItemDto[], waiter: string) =>
    request<{ id: string }>('/orders', { method:'POST', body: JSON.stringify({ tableNumber, items, waiter }) }),
  pollEvents: ()                      => request<OrderEventDto[]>('/orders/events/poll'),

  // Kitchen
  getKitchenQueue:  ()             => request<OrderDto[]>('/kitchen/queue'),
  advanceOrder:     (id: string)   => request<OrderDto>(`/kitchen/${id}/advance`, { method:'POST' }),
  undoKitchen:      ()             => request<{ undone: string }>('/kitchen/undo', { method:'POST' }),
  cancelOrder:      (id: string)   => request<OrderDto>(`/kitchen/${id}`, { method:'DELETE' }),

  // Billing
  previewBill:(orderId: string, strategy: string, tip: number, splitCount?: number) =>
    request<BillResultDto>(`/billing/${orderId}/preview?strategy=${strategy}&tip=${tip}&splitCount=${splitCount ?? 1}`),
  closeBill:(orderId: string, strategy: string, tip: number, paymentMethod: string, splitCount?: number) =>
    request<HistoryEntryDto>(`/billing/${orderId}/close`, { method:'POST',
      body: JSON.stringify({ strategy, tip, paymentMethod, splitCount: splitCount ?? 1 }) }),
  getStrategies: () => request<StrategyDto[]>('/billing/strategies'),

  // Menu
  getMenu:   ()           => request<MenuItemDto[]>('/menu'),
  getCombos: ()           => request<ComboDto[]>('/menu/combos'),
  previewAddons:(id: string, addonIds: string[]) =>
    request<{ description: string; price: number }>(`/menu/${id}/preview-addons?addons=${addonIds.join(',')}`),

  // History
  getHistory:(from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to)   params.set('to',   to);
    return request<HistoryEntryDto[]>(`/history${params.size ? '?'+params : ''}`);
  },
  getReport: () => request<ReportDto>('/history/report'),

  // Auth
  login: (username: string, password: string) =>
    request<LoginResultDto>('/auth/login', { method:'POST', body: JSON.stringify({ username, password }) }),

  // Users (Manager only)
  getUsers: () => request<UserDto[]>('/users'),
  createUser: (dto: CreateUserDto) =>
    request<UserDto>('/users', { method:'POST', body: JSON.stringify(dto) }),
  updateUser: (id: number, dto: UpdateUserDto) =>
    request<UserDto>(`/users/${id}`, { method:'PUT', body: JSON.stringify(dto) }),
  deleteUser: (id: number) =>
    request<void>(`/users/${id}`, { method:'DELETE' }),

  // Reservations
  getReservations: () => request<ReservationDto[]>('/reservations'),
  createReservation: (dto: CreateReservationDto) =>
    request<ReservationDto>('/reservations', { method:'POST', body: JSON.stringify(dto) }),
  updateReservationStatus: (id: string, status: string) =>
    request<ReservationDto>(`/reservations/${id}/status`, { method:'PATCH', body: JSON.stringify({ status }) }),
  deleteReservation: (id: string) =>
    request<void>(`/reservations/${id}`, { method:'DELETE' }),
};

// ── DTO types ────────────────────────────────────────────────────────────────

export interface TableDto {
  id: number; number: number; capacity: number;
  status: string; currentGuests: number;
  occupiedSince?: string; waiterName?: string;
  reservationTime?: string; guestName?: string;
}

export interface OrderAddonDto { name: string; price: number; }

export interface OrderItemDto {
  menuItemId: string; name: string; qty: number; price: number;
  addons: OrderAddonDto[];
}

export interface OrderDto {
  id: string; tableNumber: number; time: string;
  status: string; waiter: string; items: OrderItemDto[];
}

export interface MenuAddonDto { id: string; name: string; price: number; }

export interface MenuItemDto {
  id: string; name: string; category: string; price: number;
  description: string; allergens: string[]; image: string;
  addons: MenuAddonDto[];
}

export interface ComboChildDto { id: string; name: string; price: number; isCombo: boolean; }
export interface ComboDto {
  id: string; name: string; isCombo: boolean;
  price: number; description: string;
  children: ComboChildDto[];
}

export interface BillResultDto {
  subtotal: number; discount: number; discountRate: number;
  tax: number; tip: number; total: number; perPerson: number; splitCount: number;
}

export interface HistoryEntryDto {
  id: string; tableNumber: number; waiter: string; total: number;
  status: string; timestamp: string; paymentMethod?: string;
  items: string[]; discount: number; tip: number;
}

export interface OrderEventDto { eventType: string; order: OrderDto; extra?: string; }

export interface StrategyDto { name: string; discountRate: number; }

export interface ReportDto {
  date: string; total: number; closed: number; cancelled: number;
  entries: HistoryEntryDto[];
}

export interface LoginResultDto {
  token: string; role: string; username: string; displayName: string;
}

export interface UserDto {
  id: number; username: string; role: string; displayName: string; isActive: boolean;
}

export interface CreateUserDto {
  username: string; password: string; role: string; displayName: string;
}

export interface UpdateUserDto {
  displayName: string; role: string; isActive: boolean; newPassword?: string;
}

export interface ReservationDto {
  id: string; guestName: string; phone: string;
  tableNumber: number; guests: number;
  time: string; status: string; note: string;
}

export interface CreateReservationDto {
  guestName: string; phone: string;
  tableNumber: number; guests: number;
  time: string; note?: string;
}
