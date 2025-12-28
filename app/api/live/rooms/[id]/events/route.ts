import { withSafeLive } from "@/lib/live/withSafeLive";
import { NextRequest } from "next/server";
import { liveStore, type LiveEvent } from "@/app/live/_store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ssePack(event: string, data: unknown): string {
  // one event per message; client EventSource receives via 'message' unless event name is set
  const payload = JSON.stringify(data);
  return `event: ${event}\ndata: ${payload}\n\n`;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withSafeLive(async () => {
  const { id } = await ctx.params;

  // Basic keepalive + close when client disconnects
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Initial snapshot
      const room = liveStore.getRoom(id);
      if (!room) {
        controller.enqueue(encoder.encode(ssePack("error", { error: "room_not_found" })));
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(ssePack("room", { room })));
      controller.enqueue(encoder.encode(ssePack("reactions", { reactions: liveStore.listReactions(id) })));

      // Subscribe to live updates
      const unsub = liveStore.subscribe(id, (evt: LiveEvent) => {
        if (evt.type === "reaction") controller.enqueue(encoder.encode(ssePack("reaction", evt)));
        else if (evt.type === "room") controller.enqueue(encoder.encode(ssePack("room", evt)));
        else if (evt.type === "end") controller.enqueue(encoder.encode(ssePack("end", evt)));
      });

      // Keepalive ping
      const ping = setInterval(() => {
        controller.enqueue(encoder.encode(`event: ping\ndata: {}\n\n`));
      }, 15000);

      const abort = () => {
        clearInterval(ping);
        try { unsub(); } catch {}
        try { controller.close(); } catch {}
      };

      req.signal.addEventListener("abort", abort, { once: true });
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "connection": "keep-alive",
    },
  });
}
