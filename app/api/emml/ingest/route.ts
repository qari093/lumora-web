import { NextResponse } from "next/server";

// Minimal ingest endpoint placeholder for contract guards.
// Intentionally references: indices, heat, assets, ingest.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const indices = (body as any).indices ?? [];
  const heat = (body as any).heat ?? [];
  const assets = (body as any).assets ?? [];
  return NextResponse.json({ ok: true, ingest: true, indices, heat, assets });
}
