import { useEffect, useState } from 'react';
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import { api, UserDto, CreateUserDto, UpdateUserDto } from '../api/client';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

const ROLES = ['Manager', 'Waiter', 'Chef', 'Cashier'];

const ROLE_COLOR: Record<string, string> = {
  Manager: 'bg-[#e94560]/20 text-[#e94560]',
  Waiter:  'bg-blue-500/20 text-blue-400',
  Chef:    'bg-orange-500/20 text-orange-400',
  Cashier: 'bg-green-500/20 text-green-400',
};

const emptyCreate: CreateUserDto = { username: '', password: '', role: 'Waiter', displayName: '' };

export default function Users() {
  const [users,     setUsers]     = useState<UserDto[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserDto>(emptyCreate);
  const [createErr,  setCreateErr]  = useState('');

  // Edit modal
  const [editUser,  setEditUser]  = useState<UserDto | null>(null);
  const [editForm,  setEditForm]  = useState<UpdateUserDto & { newPassword: string }>({
    displayName: '', role: 'Waiter', isActive: true, newPassword: '',
  });
  const [editErr,   setEditErr]   = useState('');

  const load = async () => {
    try {
      setUsers(await api.getUsers());
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setCreateErr('');
    if (!createForm.username || !createForm.password || !createForm.displayName) {
      setCreateErr("Barcha maydonlarni to'ldiring."); return;
    }
    try {
      const created = await api.createUser(createForm);
      setUsers(prev => [...prev, created]);
      setCreateOpen(false);
      setCreateForm(emptyCreate);
    } catch (e: unknown) {
      setCreateErr((e as Error).message);
    }
  };

  const openEdit = (u: UserDto) => {
    setEditUser(u);
    setEditForm({ displayName: u.displayName, role: u.role, isActive: u.isActive, newPassword: '' });
    setEditErr('');
  };

  const handleEdit = async () => {
    if (!editUser) return;
    setEditErr('');
    try {
      const updated = await api.updateUser(editUser.id, {
        displayName: editForm.displayName,
        role:        editForm.role,
        isActive:    editForm.isActive,
        newPassword: editForm.newPassword || undefined,
      });
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      setEditUser(null);
    } catch (e: unknown) {
      setEditErr((e as Error).message);
    }
  };

  const handleDelete = async (user: UserDto) => {
    if (!confirm(`"${user.displayName}" foydalanuvchisini o'chirishni xohlaysizmi?`)) return;
    try {
      await api.deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  if (loading) return <LoadingSpinner message="Foydalanuvchilar yuklanmoqda..." />;
  if (error)   return <div className="flex-1 flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="flex-1 overflow-auto">
      <AppHeader
        title="Foydalanuvchilar"
        subtitle="Tizimga kirish huquqlarini boshqarish — faqat Manager uchun"
      />

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-6 h-6 text-[#e94560]" />
            <span className="text-xl font-semibold">Barcha foydalanuvchilar ({users.length})</span>
          </div>
          <Button onClick={() => { setCreateErr(''); setCreateForm(emptyCreate); setCreateOpen(true); }}
            className="bg-[#e94560] hover:bg-[#e94560]/90 text-white">
            <Plus className="w-4 h-4 mr-2" />Yangi foydalanuvchi
          </Button>
        </div>

        <Card className="bg-[#0f3460] border-white/10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/80">Ism</TableHead>
                  <TableHead className="text-white/80">Login</TableHead>
                  <TableHead className="text-white/80">Rol</TableHead>
                  <TableHead className="text-white/80">Holat</TableHead>
                  <TableHead className="text-white/80 text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">{u.displayName}</TableCell>
                    <TableCell className="text-white/70 font-mono text-sm">{u.username}</TableCell>
                    <TableCell>
                      <Badge className={ROLE_COLOR[u.role] ?? 'bg-gray-500/20 text-gray-400'}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={u.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'}>
                        {u.isActive ? 'Faol' : 'Bloklangan'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline"
                          onClick={() => openEdit(u)}
                          className="border-white/10 text-white hover:bg-white/5">
                          <Pencil className="w-3 h-3 mr-1" />Tahrirlash
                        </Button>
                        {u.username !== 'admin' && (
                          <Button size="sm" variant="outline"
                            onClick={() => handleDelete(u)}
                            className="border-white/10 text-white/80 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30">
                            <Trash2 className="w-3 h-3 mr-1" />O'chirish
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ── Yangi foydalanuvchi modali ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-[#0f3460] border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Yangi foydalanuvchi</DialogTitle>
            <DialogDescription className="text-white/60">
              Kirish ma'lumotlarini kiriting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-white">Ism Familiya *</Label>
              <Input value={createForm.displayName}
                onChange={e => setCreateForm({ ...createForm, displayName: e.target.value })}
                placeholder="Sardor Karimov"
                className="bg-[#16213e] border-white/10 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white">Login *</Label>
              <Input value={createForm.username}
                onChange={e => setCreateForm({ ...createForm, username: e.target.value })}
                placeholder="sardor2"
                className="bg-[#16213e] border-white/10 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white">Parol *</Label>
              <Input type="password" value={createForm.password}
                onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="••••••••"
                className="bg-[#16213e] border-white/10 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white">Rol *</Label>
              <Select value={createForm.role}
                onValueChange={v => setCreateForm({ ...createForm, role: v })}>
                <SelectTrigger className="bg-[#16213e] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f3460] border-white/10">
                  {ROLES.map(r => (
                    <SelectItem key={r} value={r} className="text-white">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {createErr && <p className="text-[#e94560] text-sm">{createErr}</p>}
          </div>

          <DialogFooter>
            <Button onClick={() => setCreateOpen(false)} variant="outline"
              className="border-white/10 text-white hover:bg-white/5">Bekor qilish</Button>
            <Button onClick={handleCreate}
              className="bg-[#e94560] hover:bg-[#e94560]/90 text-white">Qo'shish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Tahrirlash modali ── */}
      <Dialog open={!!editUser} onOpenChange={open => { if (!open) setEditUser(null); }}>
        <DialogContent className="bg-[#0f3460] border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Tahrirlash — {editUser?.username}</DialogTitle>
            <DialogDescription className="text-white/60">
              Bo'sh qoldirilgan parol o'zgarmaydi
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-white">Ism Familiya</Label>
              <Input value={editForm.displayName}
                onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
                className="bg-[#16213e] border-white/10 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white">Rol</Label>
              <Select value={editForm.role}
                onValueChange={v => setEditForm({ ...editForm, role: v })}>
                <SelectTrigger className="bg-[#16213e] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f3460] border-white/10">
                  {ROLES.map(r => (
                    <SelectItem key={r} value={r} className="text-white">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-white">Yangi parol (ixtiyoriy)</Label>
              <Input type="password" value={editForm.newPassword}
                onChange={e => setEditForm({ ...editForm, newPassword: e.target.value })}
                placeholder="O'zgartirmasangiz bo'sh qoldiring"
                className="bg-[#16213e] border-white/10 text-white" />
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#16213e] rounded-lg">
              <input type="checkbox" id="isActive" checked={editForm.isActive}
                onChange={e => setEditForm({ ...editForm, isActive: e.target.checked })}
                className="w-4 h-4 accent-[#e94560]" />
              <Label htmlFor="isActive" className="text-white cursor-pointer">Faol holat</Label>
            </div>
            {editErr && <p className="text-[#e94560] text-sm">{editErr}</p>}
          </div>

          <DialogFooter>
            <Button onClick={() => setEditUser(null)} variant="outline"
              className="border-white/10 text-white hover:bg-white/5">Bekor qilish</Button>
            <Button onClick={handleEdit}
              className="bg-[#e94560] hover:bg-[#e94560]/90 text-white">Saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
