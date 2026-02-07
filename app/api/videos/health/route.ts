import { NextResponse } from "next/server";
import { getVideosHealth } from "@/lib/videos/runtime";

export async function GET() {
  return NextResponse.json(getVideosHealth(), { status: 200 });
}
