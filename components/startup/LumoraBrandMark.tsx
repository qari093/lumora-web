export default function LumoraBrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-11 rounded-2xl lumora-glass grid place-items-center">
        <div className="absolute inset-1 rounded-xl bg-cyan-400/10" />
        <div className="relative h-6 w-3 rounded-full bg-gradient-to-b from-cyan-200 via-blue-400 to-violet-500 shadow-[0_0_30px_rgba(34,211,238,.85)] rotate-12" />
      </div>
      <div>
        <div className="font-black tracking-[0.22em] text-sm">LUMORA</div>
        <div className="text-[10px] text-cyan-200/75 tracking-[0.18em] uppercase">
          Civilization OS
        </div>
      </div>
    </div>
  );
}
