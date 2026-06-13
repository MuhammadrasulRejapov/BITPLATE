import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AppHeader } from '../components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import { CreditCard, Wallet, Users } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { LoadingSpinner, ErrorMessage } from '../components/shared/LoadingSpinner';
import { api, BillResultDto, StrategyDto } from '../api/client';

export default function Billing() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, closeBill, isLoading, error } = useAppData();

  const [strategies, setStrategies]     = useState<StrategyDto[]>([]);
  const [selectedStrategy, setSelected] = useState('standard');
  const [tip,  setTip]                  = useState(0);
  const [splitCount, setSplitCount]     = useState(2);
  const [bill, setBill]                 = useState<BillResultDto | null>(null);
  const [paymentMethod, setPayment]     = useState<string | null>(null);
  const [isSplitOpen, setSplitOpen]     = useState(false);
  const [billLoading, setBillLoading]   = useState(false);

  const order = orderId
    ? orders.find(o => o.id === orderId)
    : orders.find(o => o.status !== 'Served');

  // Load strategies from backend (Strategy pattern — server lists available algorithms)
  useEffect(() => {
    api.getStrategies()
      .then(setStrategies)
      .catch(() => setStrategies([
        { name: 'standard',  discountRate: 0 },
        { name: 'happyhour', discountRate: 0.2 },
        { name: 'loyalty',   discountRate: 0.1 },
        { name: 'group',     discountRate: 0.15 },
      ]));
  }, []);

  // Facade pattern — backend processes pricing, discount, tax, tip in one call
  useEffect(() => {
    if (!order) return;
    setBillLoading(true);
    api.previewBill(order.id, selectedStrategy, tip, isSplitOpen ? splitCount : 1)
      .then(setBill)
      .catch(() => setBill(null))
      .finally(() => setBillLoading(false));
  }, [order?.id, selectedStrategy, tip, splitCount, isSplitOpen]);

  if (isLoading) return <LoadingSpinner message="Hisob yuklanmoqda..." />;
  if (error)     return <ErrorMessage message={error} />;

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-2">Faol buyurtma topilmadi</p>
          <p className="text-white/60 mb-6">Hisob yopish uchun faol buyurtma bo'lishi kerak</p>
          <Button onClick={() => navigate('/tables')} className="bg-[#e94560] text-white">
            Stollar sahifasiga o'tish
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";

  const strategyLabels: Record<string, string> = {
    standard:  'Chegirmasiz',
    happyhour: 'Baxtli soat (20%)',
    loyalty:   "Sodiq mijoz (10%)",
    group:     "Guruh (15%)",
  };

  const handleCloseBill = () => {
    if (!paymentMethod) { alert("To'lov usulini tanlang!"); return; }
    closeBill({
      orderId: order.id,
      paymentMethod,
      discount: bill?.discountRate ?? 0,
      tip,
      total: Math.round(bill?.total ?? 0),
    });
    navigate('/tables');
  };

  return (
    <div className="flex-1 overflow-auto">
      <AppHeader
        title={`Hisob — Stol ${order.tableNumber}`}
        subtitle={`Buyurtma ID: ${order.id}`}
      />

      <div className="p-6 max-w-2xl mx-auto">
        <Card className="bg-[#0f3460] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Buyurtma tafsilotlari</CardTitle>
            <p className="text-white/60 text-sm">Ofitsiant: {order.waiter}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="p-3 bg-[#16213e] rounded-lg space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-white font-medium">{item.name} x{item.qty}</p>
                    <p className="text-white">{formatCurrency(item.price * item.qty)}</p>
                  </div>
                  {item.addons.map((addon, i) => (
                    <div key={i} className="flex justify-between text-sm text-white/60 ml-4">
                      <span>+ {addon.name}</span>
                      {addon.price > 0 && <span>{formatCurrency(addon.price * item.qty)}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {bill && (
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-white/80">
                  <span>Oraliq jami:</span>
                  <span>{formatCurrency(bill.subtotal)}</span>
                </div>
              </div>
            )}

            {/* Strategy — backend returns available discount algorithms */}
            <div className="space-y-3">
              <Label className="text-white">Chegirma turi:</Label>
              <RadioGroup value={selectedStrategy} onValueChange={setSelected}>
                {strategies.map(s => (
                  <div key={s.name} className="flex items-center space-x-3 p-3 bg-[#16213e] rounded-lg">
                    <RadioGroupItem value={s.name} id={s.name} />
                    <Label htmlFor={s.name} className="flex-1 cursor-pointer text-white">
                      {strategyLabels[s.name] ?? s.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {bill && bill.discount > 0 && (
              <div className="flex justify-between text-[#e94560]">
                <span>Chegirma:</span>
                <span>-{formatCurrency(bill.discount)}</span>
              </div>
            )}

            {bill && (
              <div className="flex justify-between text-white/80">
                <span>Soliq (12%):</span>
                <span>{formatCurrency(bill.tax)}</span>
              </div>
            )}

            {/* Tip */}
            <div className="space-y-2">
              <Label htmlFor="tip" className="text-white">Tip:</Label>
              <Input
                id="tip" type="number" value={tip} min={0}
                onChange={e => setTip(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                className="bg-[#16213e] border-white/10 text-white"
              />
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white text-xl font-semibold">JAMI:</span>
                <span className="text-[#e94560] text-2xl font-bold">
                  {billLoading ? '...' : formatCurrency(Math.round(bill?.total ?? 0))}
                </span>
              </div>

              {/* Payment method */}
              <div className="space-y-3">
                <Label className="text-white">To'lov usuli:</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Naqd','Karta'].map(method => (
                    <Button key={method}
                      onClick={() => setPayment(method)}
                      variant={paymentMethod === method ? 'default' : 'outline'}
                      className={paymentMethod === method
                        ? 'bg-[#e94560] hover:bg-[#e94560]/90 text-white'
                        : 'border-white/10 text-white hover:bg-white/5'}>
                      {method === 'Naqd' ? <Wallet className="w-4 h-4 mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                      {method}
                    </Button>
                  ))}
                  <Button onClick={() => setSplitOpen(true)} variant="outline"
                    className="border-white/10 text-white hover:bg-white/5">
                    <Users className="w-4 h-4 mr-2" />
                    Bo'lib to'lash
                  </Button>
                </div>
              </div>

              <Button onClick={handleCloseBill}
                className="w-full mt-6 bg-[#e94560] hover:bg-[#e94560]/90 text-white text-lg py-6">
                Hisobni yopish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Split bill modal */}
      <Dialog open={isSplitOpen} onOpenChange={setSplitOpen}>
        <DialogContent className="bg-[#0f3460] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Bo'lib to'lash</DialogTitle>
            <DialogDescription className="text-white/60">Hisobni necha kishiga bo'linsin?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="splitCount" className="text-white">Kishi soni:</Label>
              <Input id="splitCount" type="number" min="2" value={splitCount}
                onChange={e => setSplitCount(Math.max(2, Number(e.target.value)))}
                className="bg-[#16213e] border-white/10 text-white" />
            </div>
            <div className="p-4 bg-[#16213e] rounded-lg">
              <p className="text-white/60 text-sm mb-1">Har bir kishi to'laydi:</p>
              <p className="text-[#e94560] text-2xl font-bold">
                {formatCurrency(Math.round((bill?.total ?? 0) / splitCount))}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSplitOpen(false)} variant="outline"
              className="border-white/10 text-white hover:bg-white/5">Bekor qilish</Button>
            <Button onClick={() => { setPayment("Bo'lib to'lash"); setSplitOpen(false); }}
              className="bg-[#e94560] hover:bg-[#e94560]/90 text-white">Tasdiqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
