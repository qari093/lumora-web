import { NextRequest, NextResponse } from "next/server";
import { resolveAdRoute } from "@/lib/ads/resolveAdRoute";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const value = searchParams.get("value");

    if (!type || !value) {
      return NextResponse.json(
        { ok: false, error: "missing_resolve_params" },
        { status: 400 }
      );
    }

    const resolved = resolveAdRoute({ type, value });

    return NextResponse.json(
      {
        ok: true,
        source: "lumora_ad_route_resolver_v1",
        resolved,
      },
      { status: resolved.valid ? 200 : 404 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "ad_route_resolve_failed" },
      { status: 500 }
    );
  }
}
