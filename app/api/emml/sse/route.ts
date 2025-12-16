export const runtime = "nodejs";

export async function GET() {
  // SSE route for EMML / emotional markets streaming.
  const enc = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: any) => {
        controller.enqueue(enc.encode(`event: ${event}\n`));
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      send("hello", { ok: true, system: "emml", asOf: new Date().toISOString() });

      let alive = true;
      const id = setInterval(() => {
        if (!alive) return;
        send("tick", { emml: true, market: "global", asOf: new Date().toISOString() });
      }, 15000);

      // Keepalive shutdown on cancel
      (stream as any)._cancel = () => {
        alive = false;
        clearInterval(id);
        try { controller.close(); } catch {}
      };
    },
    cancel() {
      try { (stream as any)._cancel?.(); } catch {}
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store",
      connection: "keep-alive",
    },
  });
}
