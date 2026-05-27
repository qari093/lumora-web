import { NextResponse } from "next/server";
import { createFeedResponse, getSeedContentRegistry } from "@/src/content-engine/registry";

export async function GET() {
  const response = createFeedResponse({
    items: getSeedContentRegistry(),
    limit: 10,
  });

  return NextResponse.json(response);
}
