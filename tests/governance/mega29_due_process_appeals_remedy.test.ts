import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(relative: string) {
  return fs.readFileSync(
    path.join(root, relative),
    "utf8"
  );
}

describe("Mega Step 29 due-process appeal contract", () => {
  const schema = read("prisma/schema.prisma");
  const userRoute = read(
    "app/api/moderation/appeal/route.ts"
  );
  const service = read(
    "src/core/moderation-production/appeal.ts"
  );
  const adminList = read(
    "app/api/admin/moderation/appeals/route.ts"
  );
  const adminReview = read(
    "app/api/admin/moderation/appeals/[id]/route.ts"
  );

  it("has one first-class durable appeal model", () => {
    expect(schema).toContain("model ModerationAppeal");
    expect(schema).toContain("reportId");
    expect(schema).toContain("userId");
    expect(schema).toContain("decisionReason");
    expect(schema).toContain("reviewerUserId");
    expect(schema).toContain("auditHistory");
    expect(schema).toContain("reviewedAt");
  });

  it("keeps user appeal creation session bound", () => {
    expect(userRoute).toContain("requireUserSession");
    expect(userRoute).toContain("auth.identity.userId");
    expect(userRoute).toContain("forbidden_user_scope");
  });

  it("provides authenticated user appeal status access", () => {
    expect(userRoute).toContain(
      "export async function GET"
    );
    expect(userRoute).toContain(
      "listModerationAppealsForUser"
    );
  });

  it("persists appeals through Prisma", () => {
    expect(service).toContain(
      "prisma.moderationAppeal.create"
    );
    expect(service).toContain(
      "prisma.moderationAppeal.findMany"
    );
  });

  it("requires admin authority for appeal review", () => {
    expect(adminReview).toContain(
      "requireAdminSession"
    );
    expect(adminList).toContain(
      "requireAdminSession"
    );
  });

  it("records authenticated reviewer accountability", () => {
    expect(adminReview).toContain(
      "auth.identity.userId"
    );
    expect(adminReview).toContain(
      "auth.identity.email"
    );
    expect(service).toContain(
      "reviewerUserId"
    );
    expect(service).toContain(
      "reviewerEmail"
    );
    expect(service).toContain(
      "reviewedAt"
    );
  });

  it("requires a reason for a consequential appeal decision", () => {
    expect(adminReview).toContain(
      "decisionReason"
    );
    expect(adminReview).toContain(
      "INVALID_APPEAL_REVIEW_REQUEST"
    );
  });

  it("maintains append-only appeal event history", () => {
    expect(service).toContain(
      "auditHistory"
    );
    expect(service).toContain(
      "appeal_submitted"
    );
    expect(service).toContain(
      "appeal_reviewed"
    );
    expect(service).toContain(
      "history.push"
    );
  });

  it("supports explicit remedy information", () => {
    expect(service).toContain("remedy");
    expect(adminReview).toContain("remedy");
    expect(userRoute).toContain(
      "listModerationAppealsForUser"
    );
  });
});
