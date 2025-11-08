import { NextResponse } from "next/server";

type RecoverIn = {
  ts?: number;
  note?: string;
  ran?: string[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RecoverIn;
    return NextResponse.json({
      ok: true,
      received_at: Date.now(),
      echo_ts: body?.ts ?? null,
      ran: body?.ran ?? [],
      note: body?.note ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 400 });
  }
}
