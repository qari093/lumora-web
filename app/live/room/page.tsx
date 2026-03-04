export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import { getRoomById } from "@/lib/live/rooms";

export default function LiveRoomPage({ searchParams }: { searchParams?: { id?: string } }) {
  const id = searchParams?.id || "";
  const room = id ? getRoomById(id) : null;

  return (
    <main className="px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">Live Room</h1>
        <a href="/live" className="text-xs opacity-70 underline">
          Back
        </a>
      </div>

      {!id ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm" data-testid="live-room-missing">
          id required
        </div>
      ) : !room ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm" data-testid="live-room-notfound">
          Not found
        </div>
      ) : (
        <div className="mt-4 space-y-3" data-testid="live-room-root">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">{room.title}</div>
            <div className="mt-1 text-xs opacity-70">
              {room.topic} • {room.lang} • cap {room.capacity} {room.isGameRoom ? "• game" : ""}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4" data-testid="live-room-shell">
            <div className="text-xs opacity-70">Join shell (identification only)</div>
            <div className="mt-2 h-28 w-full rounded-lg border border-white/10 bg-black/30" />
            <div className="mt-3 text-xs opacity-60">
              Live streaming transport (WebRTC/WS) will be connected in later steps.
            </div>
          </div>

          <div id="LUMORA_LIVE_ROOM_ALIVE" style={{ display: "none" }}>
            alive
          </div>
        </div>
      )}
    </main>
  );
}