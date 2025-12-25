import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * DEV-ONLY: resets anonymous tester identity and clears any in-memory
 * event stores if present. This must not be usable in production.
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  // Best-effort: clear any global in-memory stores if your app uses them.
  // (Does nothing if not present.)
  try {
    const g = globalThis as any;
    if (g.__LUMORA_TESTER_EVENTS && typeof g.__LUMORA_TESTER_EVENTS.clear === "function") {
      g.__LUMORA_TESTER_EVENTS.clear();
    }
    if (g.__LUMORA_TESTER_AGG && typeof g.__LUMORA_TESTER_AGG.clear === "function") {
      g.__LUMORA_TESTER_AGG.clear();
    }
  } catch {
    // ignore
  }

  const res = NextResponse.json({ ok: true });

  // Wipe common tester id cookie names (covers current + future renames safely).
  // Keep in sync with app/_lib/testers/testerId.ts if it changes.
  const candidates = ["lumora_tester_id", "tester_id", "anon_tester_id"];

  for (const name of candidates) {
    res.cookies.set({
      name,
      value: "",
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(0),
    });
  }

  // If the client stores an id in non-httpOnly cookie or localStorage, this server
  // can't clear it; use an incognito window or clear site data if needed.
  return res;
}
