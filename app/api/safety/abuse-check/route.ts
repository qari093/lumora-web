import { NextRequest, NextResponse } from "next/server";
import { evaluateAbuse } from "@/lib/safety/abuseCheck";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = evaluateAbuse({
      repeatedReports: typeof body?.repeatedReports === "number" ? body.repeatedReports : 0,
      suspiciousClicks: typeof body?.suspiciousClicks === "number" ? body.suspiciousClicks : 0,
      rapidSubmissions: typeof body?.rapidSubmissions === "number" ? body.rapidSubmissions : 0,
      botScore: typeof body?.botScore === "number" ? body.botScore : 0,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_abuse_check_v1",
      ...result,
    }, { status: result.blocked ? 429 : 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "abuse_check_failed" },
      { status: 500 }
    );
  }
}
