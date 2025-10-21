import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: false, error: "boom" }, { status: 500 });
}

export async function POST() {
  return NextResponse.json({ ok: false, error: "boom" }, { status: 500 });
}
