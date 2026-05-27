import { describe, expect, it } from "vitest";
import { resolveDomainOwner } from "@/src/core/route-ownership/ownership/domainOwner";
import { routeOwnershipMap } from "@/src/core/route-ownership/ownership/routeOwnershipMap";
import { routeConflictValidator } from "@/src/core/route-ownership/validation/routeConflictValidator";

describe("runtime route ownership", () => {
  it("resolves domain owner", () => {
    expect(resolveDomainOwner("fyp")).toBe("discovery");
  });

  it("maps live route owner", () => {
    expect(routeOwnershipMap("/api/live/rooms")).toBe("realtime");
  });

  it("detects clean routes", () => {
    expect(routeConflictValidator(["/fyp", "/live"])).toBe(true);
  });
});
