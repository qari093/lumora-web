import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStore } from "./_store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor");
  const limit = parseInt(url.searchParams.get("limit") || "5", 10);

  const { items } = getStore();
  let startIndex = 0;
  if (cursor) {
    const idx = items.findIndex(x => x.id === cursor);
    startIndex = idx >= 0 ? idx + 1 : 0;
  }
  const slice = items.slice(startIndex, startIndex + limit);
  const nextCursor = (startIndex + limit) < items.length ? items[startIndex + limit - 1].id : null;

  // Optional: auth hint
  const role = cookies().get("role")?.value || null;

  return NextResponse.json({ ok: true, items: slice, nextCursor, role });
}
