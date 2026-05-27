import { NextResponse } from "next/server";
import { getTransparencyRoots } from "@/src/core/zenwallet/transparency/transparency";

export async function GET() {
  return NextResponse.json({ ok: true, roots: getTransparencyRoots() });
}
