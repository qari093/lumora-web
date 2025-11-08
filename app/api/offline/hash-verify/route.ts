import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function deepSort(x: any): any {
  if (Array.isArray(x)) return x.map(deepSort);
  if (x && typeof x === "object") {
    const out: Record<string, any> = {};
    Object.keys(x).sort().forEach(k => { out[k] = deepSort((x as any)[k]); });
    return out;
  }
  return x;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const payload = body?.payload ?? body ?? {};
    const providedHash: string | undefined = body?.hash;

    const normalized = deepSort(payload);
    const json = JSON.stringify(normalized);
    const digest = crypto.createHash("sha256").update(json).digest("hex");
    const match = typeof providedHash === "string" ? providedHash === digest : undefined;

    return NextResponse.json({ ok: true, hash: digest, match, normalized });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 400 });
  }
}
