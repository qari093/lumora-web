import { loadLiveRooms } from "@/lib/live/loadRooms";

export default function LivePage() {
  const rooms = loadLiveRooms();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Live</h1>
      <p className="opacity-70 text-sm">
        Community rooms are active in seed mode (no streaming infra required yet).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map(r => (
          <a
            key={r.id}
            href={r.cta}
            className="rounded-xl border p-5 hover:bg-white/5 transition"
          >
            <div className="text-lg font-medium">{r.title}</div>
            <div className="text-sm opacity-70">{r.topic}</div>
            <div className="mt-2 text-xs uppercase opacity-50">
              Status: {r.status}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
