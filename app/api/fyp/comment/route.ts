import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStore } from "../_store";

export async function POST(req: Request) {
  const role = cookies().get("role")?.value;
  if (!role) return NextResponse.json({ ok:false, error:"UNAUTHORIZED" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = body?.id;
  const text = (body?.text || "").trim();
  if (!id || !text) return NextResponse.json({ ok:false, error:"MISSING_FIELDS" }, { status: 400 });

  const store = getStore();
  const it = store.items.find(i => i.id === String(id));
  if (!it) return NextResponse.json({ ok:false, error:"NOT_FOUND" }, { status: 404 });

  it.comments += 1;
  // In a real DB we would persist the comment content linked to the post.
  return NextResponse.json({ ok:true, comments: it.comments });
}
