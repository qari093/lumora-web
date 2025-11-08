import { NextRequest } from "next/server";
import { subscribe } from "@/app/_server/emml-bus";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Fan out from bus to this response
  const bus = new TransformStream<string, Uint8Array>({
    transform(chunk, controller) {
      controller.enqueue(new TextEncoder().encode(chunk));
    },
  });

  // Subscribe and pipe any broadcasts to our writer
  const sub = subscribe();
  const reader = sub.getReader();

  (async () => {
    try {
      // Send initial hello
      await writer.write(new TextEncoder().encode(`: hello ${Date.now()}\n\n`));
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        await writer.write(new TextEncoder().encode(value));
      }
    } catch {
      // ignore
    } finally {
      writer.releaseLock();
    }
  })();

  return new Response(stream.readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
