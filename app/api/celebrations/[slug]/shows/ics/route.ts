import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function fmtUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  try {
    const slug = ctx?.params?.slug;
    if (!slug) return new NextResponse("missing slug", { status: 400 });

    const celebration = await prisma.celebration.findFirst({ where: { slug } });
    if (!celebration) return new NextResponse("celebration not found", { status: 404 });

    const shows = await prisma.celebrationShow.findMany({
      where: { celebrationId: celebration.id },
      orderBy: { startAt: "asc" },
    });

    const stamp = fmtUtc(new Date());
    const lines: string[] = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Lumora//Celebrations//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    for (const s of shows) {
      const start = fmtUtc(new Date(s.startAt));
      const end = fmtUtc(new Date(s.endAt));
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${s.id}@lumora`);
      lines.push(`DTSTAMP:${stamp}`);
      lines.push(`DTSTART:${start}`);
      lines.push(`DTEND:${end}`);
      lines.push(`SUMMARY:${celebration.title || celebration.slug} — ${s.title}`);
      lines.push("STATUS:CONFIRMED");
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");
    const body = lines.join("\r\n");

    return new Response(body, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}-shows.ics"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
