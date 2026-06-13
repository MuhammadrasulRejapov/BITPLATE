import { Home, UtensilsCrossed, ChefHat, Receipt, History, Calendar, LogOut, Package, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../ui/button';

export function AppSidebar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (role) {
      case 'Manager':
        return [
          { icon: Home,             label: 'Dashboard',  path: '/dashboard' },
          { icon: UtensilsCrossed,  label: 'Stollar',    path: '/tables' },
          { icon: ChefHat,          label: 'Oshxona',    path: '/kitchen' },
          { icon: Package,          label: 'Combo Setlar', path: '/combos' },
          { icon: History,          label: 'Tarix',      path: '/history' },
          { icon: Calendar,         label: 'Bronlar',    path: '/reservations' },
          { icon: Users,            label: 'Xodimlar',   path: '/users' },
        ];
      case 'Waiter':
        return [
          { icon: UtensilsCrossed,  label: 'Stollar',    path: '/tables' },
          { icon: Package,          label: 'Combo Setlar', path: '/combos' },
          { icon: Calendar,         label: 'Bronlar',    path: '/reservations' },
        ];
      case 'Chef':
        return [
          { icon: ChefHat,          label: 'Oshxona',    path: '/kitchen' },
        ];
      case 'Cashier':
        return [
          { icon: Receipt,          label: 'Hisob',      path: '/billing' },
          { icon: Package,          label: 'Combo Setlar', path: '/combos' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] border-r border-white/10">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-[#e94560]">BitePlate</h1>
        <p className="text-sm text-white/60 mt-1">{role}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#e94560] text-white'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-white/80 hover:text-white hover:bg-white/5"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Chiqish
        </Button>
      </div>
    </div>
  );
}
