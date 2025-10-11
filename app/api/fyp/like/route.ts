import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStore } from "../_store";

export async function POST(req: Request) {
  const role = cookies().get("role")?.value;
  if (!role) return NextResponse.json({ ok:false, error:"UNAUTHORIZED" }, { status: 401 });

  const { id } = await req.json().catch(() => ({ id: null }));
  if (!id) return NextResponse.json({ ok:false, error:"MISSING_ID" }, { status: 400 });

  const store = getStore();
  const it = store.items.find(i => i.id === String(id));
  if (!it) return NextResponse.json({ ok:false, error:"NOT_FOUND" }, { status: 404 });

  it.likes += 1; // simple increment (idempotency left to DB stage)
  return NextResponse.json({ ok:true, likes: it.likes });
}
