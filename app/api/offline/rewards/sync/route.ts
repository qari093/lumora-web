import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Accept any JSON and echo it back (placeholder implementation)
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ ok: true, echo: body });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 400 });
  }
}

export async function GET() {
  // Helpful for quick probes from browser
  return NextResponse.json({ ok: true, info: "GET probe ok" });
}
