import { NextResponse } from "next/server";
import { getSupportedLanguages } from "@/src/core/zenwallet/support/supportCompliance";

export async function GET() {
  return NextResponse.json({ ok: true, languages: getSupportedLanguages(2) });
}
