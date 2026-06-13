export function LoadingSpinner({ message = "Yuklanmoqda..." }: { message?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-white/10 border-t-[#e94560] rounded-full animate-spin" />
      <p className="text-white/60">{message}</p>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-center max-w-md">
        <p className="text-red-400 font-semibold text-lg mb-2">Xatolik yuz berdi</p>
        <p className="text-white/60">{message}</p>
      </div>
    </div>
  );
}
