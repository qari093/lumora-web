import { NextRequest, NextResponse } from "next/server";
import { buildRedirectPayload } from "@/lib/ads/buildRedirectResponse";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const value = searchParams.get("value");

    if (!type || !value) {
      return NextResponse.json(
        { ok: false, error: "missing_redirect_params" },
        { status: 400 }
      );
    }

    const payload = buildRedirectPayload({ type, value });

    if (!payload.ok) {
      return NextResponse.json(payload, { status: 404 });
    }

    return NextResponse.json(
      {
        source: "lumora_ad_redirect_v1",
        ...payload,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "ad_redirect_failed" },
      { status: 500 }
    );
  }
}
