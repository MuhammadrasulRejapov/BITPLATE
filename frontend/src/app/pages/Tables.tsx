import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppHeader } from '../components/layout/AppHeader';
import { Card, CardContent } from '../components/ui/card';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Users, Clock } from 'lucide-react';
import { useAppData, TableData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, ErrorMessage } from '../components/shared/LoadingSpinner';

export default function Tables() {
  const { tables, seatGuests, isLoading, error } = useAppData();
  const { role } = useAuth();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'all' | 'Free' | 'Occupied' | 'Reserved'>('all');
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [guestCount, setGuestCount] = useState(2);

  if (isLoading) return <LoadingSpinner message="Stollar yuklanmoqda..." />;
  if (error) return <ErrorMessage message={error} />;

  const selectedTable = tables.find(t => t.id === selectedTableId);

  const filteredTables = tables.filter(t => (filter === 'all' ? true : t.status === filter));

  const handleTableClick = (table: TableData) => {
    if (table.status === 'Free') {
      setSelectedTableId(table.id);
      setGuestCount(Math.min(2, table.capacity));
      setSeatModalOpen(true);
    } else {
      navigate(`/tables/${table.id}`);
    }
  };

  const handleSeatGuests = () => {
    if (selectedTableId === null) return;
    seatGuests(selectedTableId, guestCount, role ?? 'Waiter');
    setSeatModalOpen(false);
    navigate(`/tables/${selectedTableId}`);
  };

  const filters = [
    { label: 'Barchasi', value: 'all' as const },
    { label: "Bo'sh", value: 'Free' as const },
    { label: 'Band', value: 'Occupied' as const },
    { label: 'Bron', value: 'Reserved' as const },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <AppHeader title="Stollar xaritasi" subtitle="Barcha stollar holati" />

      <div className="p-6 space-y-6">
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <Button
              key={f.value}
              onClick={() => setFilter(f.value)}
              variant={filter === f.value ? 'default' : 'outline'}
              className={
                filter === f.value
                  ? 'bg-[#e94560] hover:bg-[#e94560]/90 text-white'
                  : 'border-white/10 text-white/80 hover:bg-white/5 hover:text-white'
              }
            >
              {f.label}
            </Button>
          ))}
        </div>

        {filteredTables.length === 0 ? (
          <div className="text-center py-16 text-white/40">Bu holatda stol topilmadi</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTables.map(table => (
              <Card
                key={table.id}
                onClick={() => handleTableClick(table)}
                className="bg-[#0f3460] border-white/10 hover:border-[#e94560] transition-all cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="text-3xl font-bold text-white">Stol {table.number}</div>
                    <StatusBadge status={table.status} type="table" />
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-center gap-2 text-white/60">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {table.currentGuests}/{table.capacity} kishi
                        </span>
                      </div>
                      {table.occupiedSince && (
                        <div className="flex items-center justify-center gap-2 text-white/60">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{table.occupiedSince} dan beri</span>
                        </div>
                      )}
                      {table.reservationTime && (
                        <div className="text-sm text-white/60">
                          Bron: {table.reservationTime}
                          <br />
                          {table.guestName}
                        </div>
                      )}
                      {table.waiterName && (
                        <div className="text-sm text-white/60">Ofitsiant: {table.waiterName}</div>
                      )}
                    </div>
                    <Button className="w-full bg-[#e94560] hover:bg-[#e94560]/90 text-white">
                      {table.status === 'Free' ? "Mijoz o'tqazish" : "Batafsil ko'rish"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Mijoz o'tqazish modali */}
      <Dialog open={seatModalOpen} onOpenChange={setSeatModalOpen}>
        <DialogContent className="bg-[#0f3460] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Mijoz o'tqazish</DialogTitle>
            <DialogDescription className="text-white/60">
              Stol {selectedTable?.number} — Sig'imi: {selectedTable?.capacity} kishi
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="guestCount" className="text-white">
                Kishi soni:
              </Label>
              <Input
                id="guestCount"
                type="number"
                min={1}
                max={selectedTable?.capacity ?? 10}
                value={guestCount}
                onChange={e =>
                  setGuestCount(
                    Math.max(1, Math.min(selectedTable?.capacity ?? 10, Number(e.target.value)))
                  )
                }
                className="bg-[#16213e] border-white/10 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setSeatModalOpen(false)}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleSeatGuests}
              className="bg-[#e94560] hover:bg-[#e94560]/90 text-white"
            >
              O'tqazish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
