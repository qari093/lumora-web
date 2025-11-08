import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const celeb = await prisma.celebration.findFirst({ where: { slug } });
  if (!celeb) return new Response("celebration not found", { status: 404 });

  const enc = new TextEncoder();

  async function snapshot() {
    const [participants, reactions, rewards] = await Promise.all([
      prisma.celebrationParticipant.count({ where: { celebrationId: celeb.id } }),
      prisma.celebrationReaction.count({ where: { celebrationId: celeb.id } }),
      prisma.celebrationReward.count({ where: { celebrationId: celeb.id } }),
    ]);
    return { participants, reactions, rewards };
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let prev = await snapshot();
      controller.enqueue(enc.encode(`event: init\ndata: ${JSON.stringify(prev)}\n\n`));
      controller.enqueue(enc.encode("event: ping\ndata: ok\n\n"));

      const tick = async () => {
        try {
          const cur = await snapshot();
          if (cur.participants !== prev.participants) {
            controller.enqueue(enc.encode(`event: join\ndata: ${cur.participants}\n\n`));
          }
          if (cur.reactions !== prev.reactions) {
            controller.enqueue(enc.encode(`event: react\ndata: ${cur.reactions}\n\n`));
          }
          if (cur.rewards !== prev.rewards) {
            controller.enqueue(enc.encode(`event: reward\ndata: ${cur.rewards}\n\n`));
          }
          prev = cur;
          controller.enqueue(enc.encode("event: ping\ndata: ok\n\n"));
        } catch {
          controller.enqueue(enc.encode("event: ping\ndata: ok\n\n"));
        }
      };

      const id = setInterval(tick, 1500);
      // @ts-ignore
      req.signal?.addEventListener?.("abort", () => { clearInterval(id); controller.close(); });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
