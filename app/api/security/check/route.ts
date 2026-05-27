import { NextResponse } from "next/server";
import { creatorShareSecurityHeaders } from "@/src/core/security-production/headers";

export async function GET() {
  return NextResponse.json({
    ok: true,
    headers: creatorShareSecurityHeaders,
  });
}
