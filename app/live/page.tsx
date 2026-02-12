import Link from "next/link";
import { loadLiveRooms, type LiveRoom } from "@/lib/live/loadRooms";

export const runtime = "nodejs";

export default async function LivePage() {
  const rooms: LiveRoom[] = await loadLiveRooms();

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-semibold">LIVE</h1>
      <p className="mt-1 text-sm opacity-70">Community rooms (seed)</p>

      <div className="mt-6 grid gap-3">
        {rooms.map((r) => (
          <Link
            key={r.id}
            href={r.cta ?? `/live/room/${encodeURIComponent(r.id)}`}
            className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10"
          >
            <div className="font-medium">{r.title}</div>
            {r.topic ? <div className="text-sm opacity-70">{r.topic}</div> : null}
          </Link>
        ))}
      </div>
    </main>
  );
}
