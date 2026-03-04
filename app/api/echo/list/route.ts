import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function GET() {
  try {
    const rows = await (prisma as any).echoTrack.findMany({
      take: 500,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        artist: true,
        license: true,
        audioUrl: true,
        genre: true,
        createdAt: true,
      },
    });

    return json({ ok: true, items: rows, count: rows.length });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, error: msg }, 500);
  }
}
