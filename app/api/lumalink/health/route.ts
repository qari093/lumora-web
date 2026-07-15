import { NextResponse } from "next/server";
import { getLumaLinkHealth } from "@/src/core/lumalink/runtime";

export async function GET() {
  return NextResponse.json(getLumaLinkHealth());
}
