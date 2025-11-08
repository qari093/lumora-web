import { NextResponse } from "next/server";

type StoredOrder = { id: string; payload: any; ts: number };
const g = (globalThis as unknown) as { __orders?: Map<string, StoredOrder> };
g.__orders ||= new Map<string, StoredOrder>();
const ORDERS = g.__orders!;

export async function POST(req: Request) {
  const idem = req.headers.get("idempotency-key") || "";
  const body = await req.json().catch(() => ({} as any));
  const id = (body?.id as string) || idem || crypto.randomUUID();
  const key = "order:" + id;

  if (ORDERS.has(key)) {
    const prev = ORDERS.get(key)!;
    return NextResponse.json(
      { ok: true, duplicate: true, id: prev.id, received: prev.payload },
      { status: 200 }
    );
  }

  const stored: StoredOrder = { id, payload: body, ts: Date.now() };
  ORDERS.set(key, stored);
  return NextResponse.json({ ok: true, id }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
