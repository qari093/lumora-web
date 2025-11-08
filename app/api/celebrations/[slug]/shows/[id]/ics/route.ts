import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function fmtICSDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

export async function GET(_req: Request, ctx: { params: any }) {
  try {
    const p = await (ctx as any).params;
    const slugRaw = Array.isArray(p?.slug) ? p.slug[0] : p?.slug;
    const idRaw   = Array.isArray(p?.id)   ? p.id[0]   : p?.id;
    const slug = typeof slugRaw === "string" ? slugRaw : "";
    const id   = typeof idRaw   === "string" ? idRaw   : "";
    if (!slug || !id) return NextResponse.json({ ok:false, error:"missing_params" }, { status:400 });

    const show = await prisma.celebrationShow.findUnique({
      where: { id },
      include: { celebration: true, guests: true },
    });
    if (!show || show.celebration.slug !== slug) {
      return NextResponse.json({ ok:false, error:"not_found" }, { status:404 });
    }

    const dtStart = fmtICSDate(new Date(show.startAt));
    const dtEnd   = fmtICSDate(new Date(show.endAt));
    const title   = show.title ?? "Show";
    const cel     = show.celebration;
    const summary = cel?.title ? `${cel.title} — ${title}` : title;

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Lumora//Celebrations//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${show.id}@lumora`,
      `DTSTAMP:${fmtICSDate(new Date())}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary.replace(/\r?\n/g, " ")}`,
      ...(show.description ? [`DESCRIPTION:${show.description.replace(/\r?\n/g, " ")}`] : []),
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
      ""
    ];

    const body = lines.join("\r\n");
    const filename = `${slug}-${show.id}.ics`;
    return new NextResponse(body, {
      status: 200,
      headers: {
        "content-type": "text/calendar; charset=utf-8",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error:"internal_error", message:String(e?.message||e) }, { status:500 });
  }
}
