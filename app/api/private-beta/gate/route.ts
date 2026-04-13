import { NextResponse } from "next/server";
import { evaluatePrivateBetaGateActivation } from "@/lib/softlaunch/privateBetaGateActivation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const out = evaluatePrivateBetaGateActivation(body);

    if (!out.ok) {
      return NextResponse.json({ ok: false, reason: out.reason }, { status: 400 });
    }

    return NextResponse.json(out);
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_json" }, { status: 400 });
  }
}
