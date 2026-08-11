import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("DB-backed private beta access contract", () => {
  it("requires authenticated DB-backed approval", () => {
    const accessRoute = readFileSync(
      "app/api/private-beta/access/route.ts",
      "utf8"
    );
    const gateRoute = readFileSync(
      "app/api/private-beta/gate/route.ts",
      "utf8"
    );

    expect(accessRoute).toContain("getServerSession");
    expect(accessRoute).toContain("prisma.privateBetaAccess");
    expect(accessRoute).toContain("authentication_required");
    expect(accessRoute).toContain("manual_approval_required");
    expect(accessRoute).toContain("access_revoked");
    expect(accessRoute).toContain("access_expired");
    expect(accessRoute).not.toContain("preview_identity_signal_present");

    expect(gateRoute).toContain("prisma.privateBetaAccess");
    expect(gateRoute).toContain("requiresAuthentication: true");
    expect(gateRoute).toContain("inviteDispatchEnabled: false");
    expect(gateRoute).toContain("publicAccess: false");
  });
});
