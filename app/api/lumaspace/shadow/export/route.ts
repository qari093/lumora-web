import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = (url.searchParams.get("email") || "").trim();
    const take = url.searchParams.get("take") || "1000";
    if (!email) return new NextResponse("missing email", { status: 400 });

    const origin = url.origin;
    const r = await fetch(
      `${origin}/api/lumaspace/mirror?email=${encodeURIComponent(email)}&take=${encodeURIComponent(take)}`,
      { cache: "no-store" }
    );
    if (!r.ok) return new NextResponse(`mirror fetch ${r.status}`, { status: 502 });
    const data = await r.json();

    const lines: string[] = [];
    lines.push("key,value");
    lines.push(`worldId,${JSON.stringify(data.worldId ?? "")}`);
    lines.push(`total,${JSON.stringify(data.total ?? 0)}`);
    const m = data.mirror || {};
    if (m.topEmotion) lines.push(`topEmotion,${JSON.stringify(m.topEmotion)}`);
    if (Array.isArray(m.mix)) {
      for (const row of m.mix) {
        lines.push(`mix_${row.emotion}_count,${JSON.stringify(row.count)}`);
        lines.push(`mix_${row.emotion}_pct,${JSON.stringify(row.pct)}`);
      }
    }
    if (m.scores && typeof m.scores === "object") {
      for (const [k, v] of Object.entries(m.scores)) {
        lines.push(`score_${k},${JSON.stringify(v)}`);
      }
    }

    const csv = lines.join("\n");
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "cache-control": "no-store",
        "content-disposition": `attachment; filename="mirror_${email.replace(/[^a-z0-9-_.@]/gi,"_")}.csv"`,
      },
    });
  } catch (e: any) {
    return new NextResponse(String(e?.message || e), { status: 500 });
  }
}

export const dynamic = "force-dynamic";
