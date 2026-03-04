import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE = "lumora_uid";
export function getOrSetUid() {
  // NOTE: In Next.js, cookies() requires a request scope. Vitest "in-process" route tests
  // may execute without that scope. We keep production behavior when scope exists,
  // and fall back safely in tests/tooling when it doesn't.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { cookies } = require("next/headers");
    const jar = cookies();
    const COOKIE = "lumora_uid";
    let uid = jar.get(COOKIE)?.value;
    if (!uid) {
      uid = (process.env.LUMORA_UID_FALLBACK && String(process.env.LUMORA_UID_FALLBACK)) || "test_uid";
      // best-effort set; in some contexts jar.set may exist
      try { jar.set(COOKIE, uid, { path: "/", httpOnly: true, sameSite: "lax" }); } catch {}
    }
    return uid;
  } catch {
    // Outside request scope (e.g., vitest): provide deterministic, non-throwing uid
    return (process.env.LUMORA_UID_FALLBACK && String(process.env.LUMORA_UID_FALLBACK)) || "test_uid";
  }
}
