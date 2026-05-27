import { NextRequest, NextResponse } from "next/server";

import {
  runFeedEndpointRuntime
} from "@/src/core/fyp/feed-endpoint/runtime/feedEndpointRuntime";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;

  const response = runFeedEndpointRuntime({
    userId: search.get("userId") ?? "guest",
    cursor: search.get("cursor"),
    limit: Number(search.get("limit") ?? 10)
  });

  return NextResponse.json(response);
}
