import { useEffect, useState } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { LoadingSpinner, ErrorMessage } from '../components/shared/LoadingSpinner';
import { api, ComboDto } from '../api/client';

export default function Combos() {
  const [combos,    setCombos]    = useState<ComboDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    api.getCombos()
      .then(setCombos)
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner message="Combo menyu yuklanmoqda..." />;
  if (error)     return <ErrorMessage message={error} />;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('uz-UZ').format(n) + " so'm";

  return (
    <div className="flex-1 overflow-auto">
      <AppHeader
        title="Combo Setlar"
        subtitle="Composite pattern — bir necha taomdan iborat to'plamlar"
      />

      <div className="p-6 space-y-4">
        <p className="text-white/60 text-sm max-w-2xl">
          Har bir combo seti ichidagi taomlarning narxidan 10–15% arzonroq. Narx avtomatik
          hisoblanadi — tarkib o'zgarganda ham to'g'ri qoladi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map(combo => {
            const fullPrice = combo.children.reduce((s, c) => s + c.price, 0);
            const saving    = fullPrice - combo.price;

            return (
              <Card key={combo.id} className="bg-[#0f3460] border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-lg">{combo.name}</CardTitle>
                    <Badge className="bg-[#e94560]/20 text-[#e94560] border-[#e94560]/30">
                      Combo
                    </Badge>
                  </div>
                  <p className="text-white/60 text-sm">{combo.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Children — individual SingleMenuItems (Composite leaf nodes) */}
                  <div className="space-y-2">
                    {combo.children.map(child => (
                      <div key={child.id}
                        className="flex justify-between items-center p-2 bg-[#16213e] rounded-lg text-sm">
                        <span className="text-white/80">{child.name}</span>
                        <span className="text-white/60">{formatCurrency(child.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-3 space-y-1">
                    <div className="flex justify-between text-white/60 text-sm line-through">
                      <span>Alohida:</span>
                      <span>{formatCurrency(fullPrice)}</span>
                    </div>
                    <div className="flex justify-between text-green-400 text-sm">
                      <span>Tejash:</span>
                      <span>-{formatCurrency(saving)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-1">
                      <span>Combo narxi:</span>
                      <span className="text-[#e94560]">{formatCurrency(combo.price)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
