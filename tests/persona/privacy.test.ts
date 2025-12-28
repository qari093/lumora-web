import { describe, it, expect } from "vitest";
import { sanitizePersonaPrivacy } from "../../src/lib/persona/privacy";
import { shouldShowPersona } from "../../src/lib/persona/shouldShow";

describe("persona privacy", () => {
  it("sanitizes invalid input", () => {
    const p = sanitizePersonaPrivacy({ visibility: "nope", allowLive: 1 });
    expect(p.visibility).toBe("public");
    expect(p.allowLive).toBe(true);
  });

  it("private hides all surfaces", () => {
    const p = sanitizePersonaPrivacy({ visibility: "private", allowLive: true, allowChat: true, allowFeed: true });
    expect(shouldShowPersona("live", p)).toBe(false);
    expect(shouldShowPersona("chat", p)).toBe(false);
    expect(shouldShowPersona("feed", p)).toBe(false);
  });
});
