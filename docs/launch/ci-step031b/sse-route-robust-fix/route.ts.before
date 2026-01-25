import { NextRequest } from "next/server";
import { sseBus, type LiveSseEnvelope } from "@/lib/live/sseBus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mkReqId() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function sseHeaders() {
  return {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
    "x-accel-buffering": "no",
  };
}

function formatEvent(name: string, data: unknown) {
  return `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || mkReqId();
  const url = new URL(req.url);
  const roomId = (url.searchParams.get("roomId") || "demo-room").trim() || "demo-room";
  const enc = new TextEncoder();

  try {
    let keepalive: any = null;
    let onMsg: ((evt: LiveSseEnvelope) => void) | null = null;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const safeEnq = (s: string) => {
          try {
            controller.enqueue(enc.encode(s));
          } catch {
            // controller likely closed
          }
        };

        // Force an immediate first chunk (some stacks buffer until body bytes exist)
        safeEnq(`: open ${Date.now()}\n\n`);

        // Connected event MUST arrive quickly for contracts
        safeEnq(
          formatEvent("connected", {
            ok: true,
            roomId,
            requestId,
            ts: new Date().toISOString(),
          })
        );

        // Forward published events
        onMsg = (evt: LiveSseEnvelope) => {
          if (!evt || evt.roomId !== roomId) return;
          safeEnq(
            formatEvent("event", {
              roomId: evt.roomId,
              kind: evt.kind,
              payload: evt.payload ?? null,
              ts: evt.ts,
            })
          );
        };

        // Subscribe; tolerate older bus impls
        try {
          sseBus.subscribeRoom(roomId, onMsg);
        } catch (e) {
          safeEnq(
            formatEvent("error", {
              ok: false,
              roomId,
              requestId,
              code: "LIVE_SSE_SUBSCRIBE_FAILED",
              message: (e as any)?.message || "subscribe failed",
              ts: new Date().toISOString(),
            })
          );
        }

        // Frequent keepalive so short curl timeouts still receive bytes
        keepalive = setInterval(() => {
          safeEnq(`: keepalive ${Date.now()}\n\n`);
        }, 800);
      },
      cancel() {
        if (keepalive) clearInterval(keepalive);
        if (onMsg) {
          try {
            sseBus.unsubscribeRoom(roomId, onMsg);
          } catch {
            // ignore
          }
        }
      },
    });

    return new Response(stream, { status: 200, headers: sseHeaders() });
  } catch (e: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: { code: "LIVE_SSE_ERROR", message: e?.message || "SSE init failed" },
        requestId,
        ts: new Date().toISOString(),
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
