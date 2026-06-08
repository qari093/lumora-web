
// Private beta allowlist guard: email allowlist for private beta admission.
import { NextResponse } from "next/server";
import fs from "node:fs";
import { evaluateAllowlistInviteContract } from "@/lib/softlaunch/allowlistInviteContract";

export async function GET() {
  try {
    const invites = JSON.parse(
      fs.readFileSync("data/softlaunch/allowlist.json", "utf8")
    );
    const out = evaluateAllowlistInviteContract({
      mode: "allowlist",
      invites,
    });

    if (!out.ok) {
      return NextResponse.json({ ok: false, reason: out.reason }, { status: 400 });
    }

    return NextResponse.json(out);
  } catch {
    return NextResponse.json({ ok: false, reason: "allowlist_read_failed" }, { status: 500 });
  }
}
