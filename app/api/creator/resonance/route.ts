import { NextResponse } from "next/server";
import { createResonanceSignal } from "@/lib/creator/resonanceEngine";

export async function GET() {
  return NextResponse.json({
    ok: true,
    resonance: createResonanceSignal("creator-1", 5)
  });
}
