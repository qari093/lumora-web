import { NextResponse } from "next/server";
import { getClientGeo } from "../../../src/lib/geo";

export async function GET(req: Request) {
  const g = getClientGeo(req);
  return NextResponse.json({ ok: true, geo: g }, { status: 200 });
}
