import { NextResponse } from "next/server";
import { getNexaHealth } from "@/lib/nexa/runtime";

export async function GET() {
  return NextResponse.json(getNexaHealth(), { status: 200 });
}
