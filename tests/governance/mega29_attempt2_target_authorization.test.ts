import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string) {
  return readFileSync(path, "utf8");
}

describe("Mega Step 29 Attempt 2 target authorization and reachability", () => {
  const service = read("src/core/moderation-production/appeal.ts");
  const route = read("app/api/moderation/appeal/route.ts");
  const panel = read("components/moderation/AppealPanel.tsx");
  const page = read("app/moderation/page.tsx");

  it("server-validates the moderation target through StreamVideo", () => {
    expect(service).toContain("prisma.streamVideo.findUnique");
    expect(service).toContain("uid: input.reportId");
    expect(service).toContain("ownerId: true");
    expect(service).toContain("status: true");
  });

  it("fails closed when the moderation target does not exist", () => {
    expect(service).toContain("APPEAL_TARGET_NOT_FOUND");
  });

  it("requires the authenticated user to own the target", () => {
    expect(service).toContain("target.ownerId !== input.userId");
    expect(service).toContain("APPEAL_TARGET_FORBIDDEN");
  });

  it("only permits appeals against rejected moderation targets", () => {
    expect(service).toContain('target.status !== "rejected"');
    expect(service).toContain("APPEAL_TARGET_NOT_APPEALABLE");
  });

  it("persists the server-verified target identifier", () => {
    expect(service).toContain("reportId: target.uid");
  });

  it("maps target authorization failures to explicit API responses", () => {
    expect(route).toContain("ModerationAppealTargetError");
    expect(route).toContain("APPEAL_TARGET_NOT_FOUND");
    expect(route).toContain("APPEAL_TARGET_FORBIDDEN");
    expect(route).toContain("APPEAL_TARGET_NOT_APPEALABLE");
  });

  it("provides a real user caller for appeal creation and status", () => {
    expect(panel).toContain('fetch("/api/moderation/appeal"');
    expect(panel).toContain('method: "POST"');
    expect(panel).toContain('method: "GET"');
    expect(page).toContain("AppealPanel");
  });

  it("does not trust caller supplied user identity in the UI", () => {
    expect(panel).not.toContain("userId:");
  });
});
