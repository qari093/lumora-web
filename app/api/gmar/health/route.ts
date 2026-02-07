import { NextResponse } from "next/server";
import { getGmarHealth } from "@/lib/gmar/runtime";

export async function GET() {
  return NextResponse.json(getGmarHealth(), { status: 200 });
}
