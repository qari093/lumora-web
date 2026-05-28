import { NextResponse } from "next/server";
import { createAfterglow } from "@/lib/afterglow/afterglowEngine";

export async function GET() {
  return NextResponse.json({
    ok: true,
    afterglow: createAfterglow("demo-room")
  });
}
