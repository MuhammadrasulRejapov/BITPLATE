import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const DEMO_USERS = [
  { username: 'manager',  password: 'manager123', label: 'Manager',          hint: 'manager / manager123' },
  { username: 'sardor',   password: 'sardor123',  label: 'Waiter — Sardor',  hint: 'sardor / sardor123' },
  { username: 'chef1',    password: 'chef123',    label: 'Chef — Oshpaz',    hint: 'chef1 / chef123' },
  { username: 'cashier1', password: 'cash123',    label: 'Cashier — Kassir', hint: 'cashier1 / cash123' },
];

const ROLE_PATHS: Record<string, string> = {
  Manager: '/dashboard',
  Waiter:  '/tables',
  Chef:    '/kitchen',
  Cashier: '/billing',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (u = username, p = password) => {
    if (!u || !p) { setError("Login va parolni kiriting."); return; }
    setLoading(true);
    setError('');
    try {
      const result = await api.login(u, p);
      login(result.token, result.role, result.username, result.displayName);
      navigate(ROLE_PATHS[result.role] ?? '/dashboard');
    } catch {
      setError("Login yoki parol noto'g'ri.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#16213e] p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#e94560] mb-2">BitePlate</h1>
          <p className="text-white/60 text-lg">Restoran boshqaruv tizimi</p>
        </div>

        {/* Login form */}
        <Card className="bg-[#0f3460] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center">Tizimga kirish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Login</Label>
              <Input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="admin"
                autoFocus
                className="bg-[#16213e] border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Parol</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="bg-[#16213e] border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            {error && (
              <p className="text-[#e94560] text-sm text-center">{error}</p>
            )}

            <Button
              onClick={() => handleLogin()}
              disabled={loading}
              className="w-full bg-[#e94560] hover:bg-[#e94560]/90 text-white py-5 text-base"
            >
              {loading ? 'Yuklanmoqda...' : 'Kirish'}
            </Button>
          </CardContent>
        </Card>

        {/* Demo accounts */}
        <Card className="bg-[#0f3460]/60 border-white/5">
          <CardContent className="pt-4 pb-4">
            <p className="text-white/40 text-xs text-center mb-3">Demo foydalanuvchilar</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map(u => (
                <button
                  key={u.username}
                  onClick={() => { setUsername(u.username); setPassword(u.password); handleLogin(u.username, u.password); }}
                  className="text-left p-2 rounded-lg bg-[#16213e]/80 hover:bg-[#16213e] border border-white/5 hover:border-white/20 transition-all"
                >
                  <p className="text-white/80 text-xs font-medium">{u.label}</p>
                  <p className="text-white/30 text-xs font-mono">{u.hint}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
