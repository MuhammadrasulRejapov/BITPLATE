import { useState, useEffect } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { Card, CardContent } from '../components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { LoadingSpinner, ErrorMessage } from '../components/shared/LoadingSpinner';
import { api, ReservationDto } from '../api/client';
import { format } from 'date-fns';

export default function Reservations() {
  const { tables, isLoading, error } = useAppData();

  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [resLoading,   setResLoading]   = useState(true);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [newRes, setNewRes] = useState({
    guestName: '', phone: '', tableNumber: '',
    guests: 2, date: '', time: '', note: '',
  });

  useEffect(() => {
    api.getReservations()
      .then(setReservations)
      .catch(() => {})
      .finally(() => setResLoading(false));
  }, []);

  if (isLoading || resLoading) return <LoadingSpinner message="Bronlar yuklanmoqda..." />;
  if (error) return <ErrorMessage message={error} />;

  const freeTables = tables.filter(t => t.status === 'Free' || t.status === 'Reserved');

  const handleCreate = async () => {
    if (!newRes.guestName || !newRes.phone || !newRes.tableNumber || !newRes.date || !newRes.time) {
      alert("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }
    try {
      const created = await api.createReservation({
        guestName:   newRes.guestName,
        phone:       newRes.phone,
        tableNumber: Number(newRes.tableNumber),
        guests:      newRes.guests,
        time:        `${newRes.date}T${newRes.time}:00`,
        note:        newRes.note,
      });
      setReservations(prev => [...prev, created]);
      setIsModalOpen(false);
      setNewRes({ guestName:'', phone:'', tableNumber:'', guests:2, date:'', time:'', note:'' });
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const updated = await api.updateReservationStatus(id, status);
      setReservations(prev => prev.map(r => r.id === id ? updated : r));
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bronni o'chirmoqchimisiz?")) return;
    try {
      await api.deleteReservation(id);
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch { /* ignore */ }
  };

  return (
    <div className="flex-1 overflow-auto">
      <AppHeader title="Bronlar" subtitle={`Jami: ${reservations.length} ta bron`} />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <CalendarIcon className="w-6 h-6 text-[#e94560]" />
            <span className="text-xl font-semibold">Barcha bronlar</span>
          </div>
          <Button onClick={() => setIsModalOpen(true)}
            className="bg-[#e94560] hover:bg-[#e94560]/90 text-white">
            <Plus className="w-4 h-4 mr-2" />Yangi bron
          </Button>
        </div>

        <Card className="bg-[#0f3460] border-white/10">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/80">ID</TableHead>
                    <TableHead className="text-white/80">Vaqt</TableHead>
                    <TableHead className="text-white/80">Stol</TableHead>
                    <TableHead className="text-white/80">Ism</TableHead>
                    <TableHead className="text-white/80">Telefon</TableHead>
                    <TableHead className="text-white/80">Kishi soni</TableHead>
                    <TableHead className="text-white/80">Eslatma</TableHead>
                    <TableHead className="text-white/80">Holat</TableHead>
                    <TableHead className="text-white/80">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-white/60 py-8">
                        Bron topilmadi
                      </TableCell>
                    </TableRow>
                  ) : (
                    reservations.map(r => (
                      <TableRow key={r.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{r.id}</TableCell>
                        <TableCell className="text-white">
                          {format(new Date(r.time), 'yyyy-MM-dd HH:mm')}
                        </TableCell>
                        <TableCell className="text-white">Stol {r.tableNumber}</TableCell>
                        <TableCell className="text-white">{r.guestName}</TableCell>
                        <TableCell className="text-white/80">{r.phone}</TableCell>
                        <TableCell className="text-white/80">{r.guests}</TableCell>
                        <TableCell className="text-white/80">
                          <div className="max-w-xs truncate">{r.note || '-'}</div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={r.status} type="reservation" />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {r.status === 'Pending' && (
                              <Button size="sm"
                                onClick={() => handleStatusChange(r.id, 'Confirmed')}
                                className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                                Tasdiqlash
                              </Button>
                            )}
                            <Button size="sm" variant="outline"
                              onClick={() => handleDelete(r.id)}
                              className="border-white/10 text-white/80 hover:bg-red-500/10 hover:text-red-400">
                              O'chirish
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#0f3460] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Yangi bron yaratish</DialogTitle>
            <DialogDescription className="text-white/60">Bron ma'lumotlarini kiriting</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Ism *</Label>
              <Input value={newRes.guestName}
                onChange={e => setNewRes({ ...newRes, guestName: e.target.value })}
                placeholder="Aliyev A." className="bg-[#16213e] border-white/10 text-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Telefon *</Label>
              <Input value={newRes.phone}
                onChange={e => setNewRes({ ...newRes, phone: e.target.value })}
                placeholder="+998901234567" className="bg-[#16213e] border-white/10 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Sana *</Label>
                <Input type="date" value={newRes.date}
                  onChange={e => setNewRes({ ...newRes, date: e.target.value })}
                  className="bg-[#16213e] border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Vaqt *</Label>
                <Input type="time" value={newRes.time}
                  onChange={e => setNewRes({ ...newRes, time: e.target.value })}
                  className="bg-[#16213e] border-white/10 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Stol *</Label>
                <Select value={newRes.tableNumber}
                  onValueChange={v => setNewRes({ ...newRes, tableNumber: v })}>
                  <SelectTrigger className="bg-[#16213e] border-white/10 text-white">
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f3460] border-white/10">
                    {freeTables.length === 0
                      ? <SelectItem value="none" disabled className="text-white/40">Bo'sh stol yo'q</SelectItem>
                      : freeTables.map(t => (
                          <SelectItem key={t.id} value={String(t.number)} className="text-white">
                            Stol {t.number} ({t.capacity} kishi)
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Kishi soni *</Label>
                <Input type="number" min="1" value={newRes.guests}
                  onChange={e => setNewRes({ ...newRes, guests: Number(e.target.value) })}
                  className="bg-[#16213e] border-white/10 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Eslatma (ixtiyoriy)</Label>
              <Textarea value={newRes.note}
                onChange={e => setNewRes({ ...newRes, note: e.target.value })}
                placeholder="Maxsus so'rovlar..."
                className="bg-[#16213e] border-white/10 text-white" rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)} variant="outline"
              className="border-white/10 text-white hover:bg-white/5">Bekor qilish</Button>
            <Button onClick={handleCreate}
              className="bg-[#e94560] hover:bg-[#e94560]/90 text-white">Yaratish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
