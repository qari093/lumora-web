export default function FypRuntimeCard({
  title,
  lane
}: {
  title: string;
  lane: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
      <div className="text-xs uppercase text-white/40">{lane}</div>
      <div className="mt-2 text-lg font-semibold text-white">{title}</div>
    </div>
  );
}
