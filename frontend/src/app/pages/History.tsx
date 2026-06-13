import { useState } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { Card, CardContent } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { useAppData } from '../context/AppDataContext';
import { LoadingSpinner, ErrorMessage } from '../components/shared/LoadingSpinner';
import { format } from 'date-fns';

export default function History() {
  const { history, isLoading, error } = useAppData();

  const [searchDate, setSearchDate] = useState('');
  const [filterTable, setFilterTable] = useState('all');
  const [filterWaiter, setFilterWaiter] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  if (isLoading) return <LoadingSpinner message="Tarix yuklanmoqda..." />;
  if (error) return <ErrorMessage message={error} />;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";

  // TODO: replace with API call — GET /api/history
  const filteredOrders = history.filter(order => {
    if (searchDate && !order.timestamp.startsWith(searchDate)) return false;
    if (filterTable !== 'all' && order.tableNumber !== Number(filterTable)) return false;
    if (filterWaiter !== 'all' && order.waiter !== filterWaiter) return false;
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    return true;
  });

  const totalRevenue = filteredOrders
    .filter(o => o.status === 'Closed')
    .reduce((sum, o) => sum + o.total, 0);

  const uniqueTables = Array.from(new Set(history.map(o => o.tableNumber))).sort((a, b) => a - b);
  const uniqueWaiters = Array.from(new Set(history.map(o => o.waiter))).sort();

  return (
    <div className="flex-1 overflow-auto">
      <AppHeader
        title="Buyurtmalar tarixi"
        subtitle="Barcha yopilgan va bekor qilingan buyurtmalar"
      />

      <div className="p-6 space-y-6">
        {/* Filtrlar */}
        <Card className="bg-[#0f3460] border-white/10">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">Sana:</label>
                <Input
                  type="date"
                  value={searchDate}
                  onChange={e => setSearchDate(e.target.value)}
                  className="bg-[#16213e] border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">Stol:</label>
                <Select value={filterTable} onValueChange={setFilterTable}>
                  <SelectTrigger className="bg-[#16213e] border-white/10 text-white">
                    <SelectValue placeholder="Barchasi" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f3460] border-white/10">
                    <SelectItem value="all" className="text-white">Barchasi</SelectItem>
                    {uniqueTables.map(t => (
                      <SelectItem key={t} value={String(t)} className="text-white">
                        Stol {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">Ofitsiant:</label>
                <Select value={filterWaiter} onValueChange={setFilterWaiter}>
                  <SelectTrigger className="bg-[#16213e] border-white/10 text-white">
                    <SelectValue placeholder="Barchasi" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f3460] border-white/10">
                    <SelectItem value="all" className="text-white">Barchasi</SelectItem>
                    {uniqueWaiters.map(w => (
                      <SelectItem key={w} value={w} className="text-white">
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">Holat:</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-[#16213e] border-white/10 text-white">
                    <SelectValue placeholder="Barchasi" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f3460] border-white/10">
                    <SelectItem value="all" className="text-white">Barchasi</SelectItem>
                    <SelectItem value="Closed" className="text-white">Yopilgan</SelectItem>
                    <SelectItem value="Cancelled" className="text-white">Bekor qilingan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="w-full p-3 bg-[#16213e] rounded-lg">
                  <p className="text-white/60 text-sm">Topildi:</p>
                  <p className="text-white font-semibold">{filteredOrders.length} ta buyurtma</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jadval */}
        <Card className="bg-[#0f3460] border-white/10">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/80">Buyurtma ID</TableHead>
                    <TableHead className="text-white/80">Stol</TableHead>
                    <TableHead className="text-white/80">Ofitsiant</TableHead>
                    <TableHead className="text-white/80">Sana & Vaqt</TableHead>
                    <TableHead className="text-white/80">Mahsulotlar</TableHead>
                    <TableHead className="text-white/80">To'lov</TableHead>
                    <TableHead className="text-white/80 text-right">Jami</TableHead>
                    <TableHead className="text-white/80">Holat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-white/60 py-8">
                        Buyurtma topilmadi
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map(order => (
                      <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{order.id}</TableCell>
                        <TableCell className="text-white">Stol {order.tableNumber}</TableCell>
                        <TableCell className="text-white/80">{order.waiter}</TableCell>
                        <TableCell className="text-white/80">
                          {format(new Date(order.timestamp), 'yyyy-MM-dd HH:mm')}
                        </TableCell>
                        <TableCell className="text-white/80">
                          <div className="max-w-xs">{order.items.join(', ')}</div>
                        </TableCell>
                        <TableCell className="text-white/80">
                          {order.paymentMethod || '-'}
                        </TableCell>
                        <TableCell className="text-white text-right font-semibold">
                          {formatCurrency(order.total)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.status === 'Closed'
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/20'
                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/20'
                            }
                          >
                            {order.status === 'Closed' ? 'Yopilgan' : 'Bekor qilindi'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Umumiy */}
        <Card className="bg-[#0f3460] border-white/10">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/60 mb-1">Umumiy daromad (yopilgan buyurtmalar):</p>
                <p className="text-[#e94560] text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 mb-1">Yopilgan buyurtmalar:</p>
                <p className="text-white text-2xl font-semibold">
                  {filteredOrders.filter(o => o.status === 'Closed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
