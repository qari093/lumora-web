import { NextResponse } from "next/server";
import { createBetaKeystone } from "@/lib/beta/betaKeystone";

export async function GET() {
  return NextResponse.json({
    ok: true,
    keystone: createBetaKeystone("private-beta-founder"),
  });
}
