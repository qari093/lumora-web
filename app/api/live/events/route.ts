import { NextRequest } from "next/server";
import crypto from "crypto";
import { subscribeSSE, unsubscribeSSE, sseConnectedChunk, ssePingChunk } from "@/lib/live/state";

function uuid(): string {
  const anyCrypto: any = crypto as any;
  if (typeof anyCrypto.randomUUID === "function") return anyCrypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

export async function GET(_req: NextRequest) {
  const requestId = uuid();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder();
      const write = (s: string) => controller.enqueue(enc.encode(s));

      // Immediately send connected event (contract expects it quickly)
      write(sseConnectedChunk());

      const subId = subscribeSSE(write);

      // Keep-alive ping
      const timer = setInterval(() => {
        try {
          write(ssePingChunk());
        } catch {
          // ignore
        }
      }, 7000);

      // @ts-expect-error: underlying runtime supports cancel
      (controller as any).closeWith = () => {
        clearInterval(timer);
        unsubscribeSSE(subId);
        try {
          controller.close();
        } catch {
          // ignore
        }
      };
    },
    cancel() {
      // handled by closeWith if called
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store, no-transform",
      connection: "keep-alive",
      "x-request-id": requestId,
    },
  });
}
