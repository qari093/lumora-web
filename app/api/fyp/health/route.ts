import { NextResponse } from "next/server";
import { getFypHealth } from "@/lib/fyp/runtime";

export async function GET() {
  return NextResponse.json(getFypHealth(), { status: 200 });
}
