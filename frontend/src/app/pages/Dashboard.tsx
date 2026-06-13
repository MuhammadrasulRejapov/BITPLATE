import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppHeader } from '../components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Users, ChefHat, Calendar, TrendingUp, UtensilsCrossed, History } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { LoadingSpinner, ErrorMessage } from '../components/shared/LoadingSpinner';
import { api, ReservationDto } from '../api/client';

export default function Dashboard() {
  const navigate = useNavigate();
  const { tables, orders, history, isLoading, error } = useAppData();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);

  useEffect(() => {
    api.getReservations().then(setReservations).catch(() => {});
  }, []);

  if (isLoading) return <LoadingSpinner message="Dashboard yuklanmoqda..." />;
  if (error)     return <ErrorMessage message={error} />;

  const formatCurrency = (n: number) => new Intl.NumberFormat('uz-UZ').format(n) + " so'm";

  const today = new Date().toISOString().slice(0, 10);
  const totalTables    = tables.length;
  const occupiedTables = tables.filter(t => t.status === 'Occupied' || t.status === 'AwaitingBill').length;
  const freeTables     = tables.filter(t => t.status === 'Free').length;
  const todayRevenue   = history
    .filter(h => h.status === 'Closed' && h.timestamp.slice(0, 10) === today)
    .reduce((sum, h) => sum + h.total, 0);

  const activeOrders  = orders.filter(o => o.status !== 'Served').length;
  const kitchenQueue  = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
  const upcomingRes   = reservations.filter(r => r.status !== 'Cancelled').length;

  // Compute top dishes from active + recent orders
  const dishCount = new Map<string, { count: number; revenue: number }>();
  orders.forEach(o => o.items.forEach(item => {
    const prev = dishCount.get(item.name) ?? { count: 0, revenue: 0 };
    dishCount.set(item.name, {
      count:   prev.count + item.qty,
      revenue: prev.revenue + item.price * item.qty,
    });
  }));
  const topDishes = [...dishCount.entries()]
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const currentShift = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Ertalgi smena';
    if (h < 18) return 'Kunduzgi smena';
    return 'Kechki smena';
  })();

  const recentOrders = [...orders].reverse().slice(0, 5);

  const statCards = [
    { title: 'Jami stollar',    value: totalTables,              icon: Users,      color: 'text-blue-400' },
    { title: 'Band stollar',    value: occupiedTables,           icon: Users,      color: 'text-yellow-400' },
    { title: "Bo'sh stollar",   value: freeTables,               icon: Users,      color: 'text-green-400' },
    { title: 'Bugungi daromad', value: formatCurrency(todayRevenue), icon: TrendingUp, color: 'text-[#e94560]' },
  ];

  const quickLinks = [
    { icon: UtensilsCrossed, label: 'Stollar', path: '/tables', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' },
    { icon: ChefHat,         label: 'Oshxona', path: '/kitchen', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20' },
    { icon: History,         label: 'Tarix',   path: '/history', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20' },
  ];

  const statusLabel: Record<string, string> = {
    Served: 'Xizmat qilindi', Ready: 'Tayyor',
    Preparing: 'Tayyorlanmoqda', Pending: 'Kutilmoqda',
  };
  const statusColor: Record<string, string> = {
    Served: 'bg-green-500/20 text-green-400', Ready: 'bg-blue-500/20 text-blue-400',
    Preparing: 'bg-yellow-500/20 text-yellow-400', Pending: 'bg-orange-500/20 text-orange-400',
  };

  return (
    <div className="flex-1 overflow-auto">
      <AppHeader title="Dashboard" subtitle={`Faol smena: ${currentShift}`} />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="bg-[#0f3460] border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-[#0f3460] border-white/10">
          <CardHeader><CardTitle className="text-white">Tezkor havolalar</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {quickLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Button key={link.path} onClick={() => navigate(link.path)} variant="outline"
                    className={`flex items-center gap-3 py-8 text-base font-semibold border ${link.color}`}>
                    <Icon className="w-6 h-6" />{link.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#0f3460] border-white/10">
            <CardHeader><CardTitle className="text-white">Faol holat</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: ChefHat,   label: 'Oshxona navbatida', value: kitchenQueue },
                { icon: Users,     label: 'Faol buyurtmalar',  value: activeOrders },
                { icon: Calendar,  label: 'Navbatdagi bronlar',value: upcomingRes  },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between p-4 bg-[#16213e] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#e94560]" />
                    <span className="text-white">{label}</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#0f3460] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Eng ko'p buyurtma berilgan taomlar</CardTitle>
              <CardDescription className="text-white/60">Hozirgi buyurtmalar bo'yicha</CardDescription>
            </CardHeader>
            <CardContent>
              {topDishes.length === 0 ? (
                <p className="text-white/40 text-center py-4">Ma'lumot yo'q</p>
              ) : (
                <div className="space-y-3">
                  {topDishes.map((dish, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#16213e] rounded-lg">
                      <div>
                        <p className="text-white font-medium">{dish.name}</p>
                        <p className="text-sm text-white/60">{dish.count} dona</p>
                      </div>
                      <p className="text-[#e94560] font-semibold">{formatCurrency(dish.revenue)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#0f3460] border-white/10">
          <CardHeader><CardTitle className="text-white">So'nggi buyurtmalar</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/80">Buyurtma ID</TableHead>
                  <TableHead className="text-white/80">Stol</TableHead>
                  <TableHead className="text-white/80">Vaqt</TableHead>
                  <TableHead className="text-white/80">Ofitsiant</TableHead>
                  <TableHead className="text-white/80">Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-white/60 py-8">Buyurtma yo'q</TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map(order => (
                    <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-medium">{order.id}</TableCell>
                      <TableCell className="text-white">Stol {order.tableNumber}</TableCell>
                      <TableCell className="text-white/80">{order.time}</TableCell>
                      <TableCell className="text-white/80">{order.waiter}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status] ?? 'bg-gray-500/20 text-gray-400'}`}>
                          {statusLabel[order.status] ?? order.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
