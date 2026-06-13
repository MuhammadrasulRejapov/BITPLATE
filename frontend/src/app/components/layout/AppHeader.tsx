import { format } from 'date-fns';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="bg-[#1a1a2e] border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-white/60 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">Bugun</p>
          <p className="text-white font-medium">{currentDate}</p>
        </div>
      </div>
    </div>
  );
}
