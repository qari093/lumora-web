import { NextResponse } from "next/server";
import { resolvePrivateBetaAccess } from "@/lib/access/privateBeta";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = resolvePrivateBetaAccess({
      enabled: true,
      mode: "allowlist",
      email: body?.email,
      allowlist: Array.isArray(body?.allowlist) ? body.allowlist : [],
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, reason: result.reason }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_json" }, { status: 400 });
  }
}
