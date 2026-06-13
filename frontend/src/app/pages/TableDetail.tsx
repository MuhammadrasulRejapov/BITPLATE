import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AppHeader } from '../components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, ErrorMessage } from '../components/shared/LoadingSpinner';
import { api, MenuItemDto } from '../api/client';

interface CartItem {
  menuItem: MenuItemDto;
  quantity: number;
  selectedAddons: Array<{ id: string; name: string; price: number }>;
}

export default function TableDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tables, addOrder, getActiveOrderByTable, isLoading, error } = useAppData();
  const { role } = useAuth();

  const [menu,            setMenu]          = useState<MenuItemDto[]>([]);
  const [menuLoading,     setMenuLoading]   = useState(true);
  const [selectedCategory, setCategory]    = useState<string>('all');
  const [cart,            setCart]          = useState<CartItem[]>([]);
  const [selectedItem,    setSelectedItem]  = useState<MenuItemDto | null>(null);
  const [tempAddons,      setTempAddons]    = useState<string[]>([]);
  const [isAddonOpen,     setIsAddonOpen]   = useState(false);

  const table = tables.find(t => t.id === Number(id));

  // Fetch menu from API instead of local JSON
  useEffect(() => {
    api.getMenu()
      .then(setMenu)
      .catch(() => {})
      .finally(() => setMenuLoading(false));
  }, []);

  if (isLoading || menuLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (!table) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Stol topilmadi</p>
          <Button onClick={() => navigate('/tables')} className="bg-[#e94560] text-white">Orqaga</Button>
        </div>
      </div>
    );
  }

  const categories = ['all', ...Array.from(new Set(menu.map(m => m.category)))];
  const filteredMenu = selectedCategory === 'all' ? menu : menu.filter(m => m.category === selectedCategory);
  const formatCurrency = (n: number) => new Intl.NumberFormat('uz-UZ').format(n) + " so'm";

  const addToCart = (item: MenuItemDto) => {
    if (item.addons.length > 0) {
      setSelectedItem(item);
      setTempAddons([]);
      setIsAddonOpen(true);
    } else {
      const existing = cart.find(c => c.menuItem.id === item.id && c.selectedAddons.length === 0);
      if (existing) setCart(cart.map(c => c === existing ? { ...c, quantity: c.quantity + 1 } : c));
      else           setCart([...cart, { menuItem: item, quantity: 1, selectedAddons: [] }]);
    }
  };

  const removeFromCart = (item: MenuItemDto) => {
    const existing = cart.find(c => c.menuItem.id === item.id);
    if (!existing) return;
    if (existing.quantity > 1) setCart(cart.map(c => c === existing ? { ...c, quantity: c.quantity - 1 } : c));
    else                       setCart(cart.filter(c => c !== existing));
  };

  const handleAddonConfirm = () => {
    if (!selectedItem) return;
    const selected = selectedItem.addons.filter(a => tempAddons.includes(a.id));
    const existing = cart.find(c =>
      c.menuItem.id === selectedItem.id &&
      JSON.stringify(c.selectedAddons.map(a => a.id).sort()) === JSON.stringify(selected.map(a => a.id).sort())
    );
    if (existing) setCart(cart.map(c => c === existing ? { ...c, quantity: c.quantity + 1 } : c));
    else          setCart([...cart, { menuItem: selectedItem, quantity: 1, selectedAddons: selected }]);
    setIsAddonOpen(false);
    setSelectedItem(null);
    setTempAddons([]);
  };

  const calculateTotal = () =>
    cart.reduce((sum, item) => {
      const addonsPrice = item.selectedAddons.reduce((s, a) => s + a.price, 0);
      return sum + (item.menuItem.price + addonsPrice) * item.quantity;
    }, 0);

  const handleSubmitOrder = () => {
    if (cart.length === 0) return;
    const items = cart.map(c => ({
      menuItemId: c.menuItem.id,
      name:       c.menuItem.name,
      qty:        c.quantity,
      price:      c.menuItem.price,
      addons:     c.selectedAddons.map(a => ({ name: a.name, price: a.price })),
    }));
    addOrder(table.number, items, role ?? 'Waiter');
    setCart([]);
    alert('Buyurtma oshxonaga yuborildi!');
  };

  const handleGenerateBill = () => {
    const activeOrder = getActiveOrderByTable(table.number);
    if (activeOrder) navigate(`/billing/${activeOrder.id}`);
    else alert("Bu stol uchun faol buyurtma topilmadi. Avval buyurtma yuboring.");
  };

  return (
    <div className="flex-1 overflow-auto">
      <AppHeader
        title={`Stol ${table.number}`}
        subtitle={`${table.currentGuests} kishi | Sig'imi: ${table.capacity}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Menu */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <Button key={cat} onClick={() => setCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={selectedCategory === cat
                  ? 'bg-[#e94560] hover:bg-[#e94560]/90 text-white whitespace-nowrap'
                  : 'border-white/10 text-white/80 hover:bg-white/5 hover:text-white whitespace-nowrap'}>
                {cat === 'all' ? 'Barchasi' : cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenu.map(item => (
              <Card key={item.id} className="bg-[#0f3460] border-white/10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{item.image}</span>
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      </div>
                      <p className="text-sm text-white/60">{item.description}</p>
                      {item.allergens.length > 0 && (
                        <p className="text-xs text-orange-400/80 mt-1">
                          ⚠ {item.allergens.join(', ')}
                        </p>
                      )}
                      <p className="text-[#e94560] font-bold mt-2">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => removeFromCart(item)} size="sm" variant="outline"
                      className="border-white/10 text-white hover:bg-white/5">
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => addToCart(item)} size="sm"
                      className="flex-1 bg-[#e94560] hover:bg-[#e94560]/90 text-white">
                      <Plus className="w-4 h-4 mr-1" />Qo'shish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-4">
          <Card className="bg-[#0f3460] border-white/10 sticky top-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />Buyurtma savati
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-white/60 text-center py-8">Savat bo'sh</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={index} className="p-3 bg-[#16213e] rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-white font-medium">{item.quantity}x {item.menuItem.name}</span>
                          <span className="text-white">
                            {formatCurrency((item.menuItem.price + item.selectedAddons.reduce((s, a) => s + a.price, 0)) * item.quantity)}
                          </span>
                        </div>
                        {item.selectedAddons.length > 0 && (
                          <div className="text-xs text-white/60 mt-1">
                            {item.selectedAddons.map(a => a.name).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white font-semibold text-lg">Jami:</span>
                      <span className="text-[#e94560] font-bold text-xl">{formatCurrency(calculateTotal())}</span>
                    </div>
                    <Button onClick={handleSubmitOrder}
                      className="w-full bg-[#e94560] hover:bg-[#e94560]/90 text-white">
                      Buyurtma yuborish
                    </Button>
                  </div>
                </>
              )}
              <Button onClick={handleGenerateBill} variant="outline"
                className="w-full border-white/10 text-white hover:bg-white/5">
                Hisobni chiqarish
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Addon modal */}
      <Dialog open={isAddonOpen} onOpenChange={setIsAddonOpen}>
        <DialogContent className="bg-[#0f3460] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Qo'shimchalar</DialogTitle>
            <DialogDescription className="text-white/60">
              {selectedItem?.name} uchun qo'shimchalarni tanlang
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {selectedItem?.addons.map(addon => (
              <div key={addon.id} className="flex items-center space-x-3 p-3 bg-[#16213e] rounded-lg">
                <Checkbox id={addon.id} checked={tempAddons.includes(addon.id)}
                  onCheckedChange={checked => {
                    if (checked) setTempAddons([...tempAddons, addon.id]);
                    else         setTempAddons(tempAddons.filter(i => i !== addon.id));
                  }} />
                <Label htmlFor={addon.id} className="flex-1 cursor-pointer text-white">
                  {addon.name}
                  {addon.price > 0 && <span className="ml-2 text-[#e94560]">+{formatCurrency(addon.price)}</span>}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddonOpen(false)} variant="outline"
              className="border-white/10 text-white hover:bg-white/5">Bekor qilish</Button>
            <Button onClick={handleAddonConfirm}
              className="bg-[#e94560] hover:bg-[#e94560]/90 text-white">Tasdiqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
