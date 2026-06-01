/* Lumora auth provider readiness: unauthorized access handling, verify email flow, NEXTAUTH_SECRET, NEXTAUTH_URL. */
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    session: null,
  });
}
