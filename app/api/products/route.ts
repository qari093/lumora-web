import { NextResponse } from "next/server";
import { createProductRuntime } from "@/src/core/products-runtime/create";

export async function GET() {
  return NextResponse.json({ ok: true, products: [] });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.id || !body?.creatorId || !body?.title || typeof body?.priceCents !== "number") {
    return NextResponse.json({ ok: false, error: "INVALID_PRODUCT_REQUEST" }, { status: 400 });
  }

  try {
    return NextResponse.json({
      ok: true,
      product: createProductRuntime({
        id: body.id,
        creatorId: body.creatorId,
        title: body.title,
        priceCents: body.priceCents,
        visible: Boolean(body.visible),
      }),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "PRODUCT_CREATE_FAILED" }, { status: 400 });
  }
}
