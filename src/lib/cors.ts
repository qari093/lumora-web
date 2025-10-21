import { NextResponse } from "next/server";

export const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

export function corsJson(body: any, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...(init || {}),
    headers: { ...(init?.headers || {}), ...CORS_HEADERS },
  });
}

export function corsNoContent() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
