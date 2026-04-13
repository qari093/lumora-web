import { NextRequest, NextResponse } from "next/server";
import { createInternalAdContent } from "@/lib/ads/adContentSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.title || !body?.body || !body?.portal || !body?.route || !body?.cta) {
      return NextResponse.json(
        { ok: false, error: "missing_ad_content_fields" },
        { status: 400 }
      );
    }

    const ad = createInternalAdContent({
      title: String(body.title),
      body: String(body.body),
      portal: String(body.portal),
      route: String(body.route),
      cta: String(body.cta),
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_content_v1",
      ad,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "ad_content_failed" },
      { status: 500 }
    );
  }
}
