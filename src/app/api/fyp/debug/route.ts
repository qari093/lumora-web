import { NextResponse } from "next/server";
import { all } from "../_store";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET() {
  return NextResponse.json({ ok:true, items: all(), count: all().length });
}
