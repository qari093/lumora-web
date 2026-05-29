import { NextResponse } from "next/server";
import { createCivilizationSeal, LUMORA_FINAL_SEAL_INPUT } from "@/lib/final-seal/civilizationSeal";

export async function GET() {
  return NextResponse.json({
    ok: true,
    seal: createCivilizationSeal(LUMORA_FINAL_SEAL_INPUT),
  });
}
