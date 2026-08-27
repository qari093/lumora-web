import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const root = process.cwd();

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

describe("Mega28 access and authority boundaries", () => {
  test("admin KYC decision is guarded by the canonical admin session", () => {
    const source = read("app/api/admin/kyc/decision/route.ts");
    expect(source).toContain("requireAdminSession");
    expect(source).toContain("await requireAdminSession()");
  });

  test("admin KYC review is guarded by the canonical admin session", () => {
    const source = read("app/api/admin/kyc/review/route.ts");
    expect(source).toContain("requireAdminSession");
    expect(source).toContain("await requireAdminSession()");
  });

  test("admin moderation review is guarded by the canonical admin session", () => {
    const source = read("app/api/admin/moderation/review/route.ts");
    expect(source).toContain("requireAdminSession");
    expect(source).toContain("await requireAdminSession()");
  });

  test("quiet gifts bind viewer authority to authenticated user", () => {
    const source = read("app/api/creator-alchemy/quiet-gifts/route.ts");
    expect(source).toContain("requireUserSession");
    expect(source).toContain("viewerId: auth.identity.userId");
    expect(source).toContain("forbidden_viewer_scope");
  });

  test("reflection is session bound and rejects foreign identity scope", () => {
    const source = read("app/api/lumaspace/reflection/route.ts");
    expect(source).toContain("requireUserSession");
    expect(source).toContain("auth.identity.email");
    expect(source).toContain("forbidden_identity_scope");
  });

  test("shadow journal is session bound and does not create arbitrary email users", () => {
    const source = read("app/api/lumaspace/shadow/route.ts");
    expect(source).toContain("requireUserSession");
    expect(source).toContain("auth.identity.userId");
    expect(source).toContain("forbidden_identity_scope");
    expect(source).not.toContain(
      "prisma.user.create({ data: { email } })",
    );
  });

  test("moderation appeal user identity comes from authenticated session", () => {
    const source = read("app/api/moderation/appeal/route.ts");
    expect(source).toContain("requireUserSession");
    expect(source).toContain("userId: auth.identity.userId");
    expect(source).toContain("forbidden_user_scope");
  });

  test("refund history rejects arbitrary owner access", () => {
    const source = read(
      "app/api/ledger/refunds/[ownerId]/[refType]/[refId]/route.ts",
    );
    expect(source).toContain("requireUserSession");
    expect(source).toContain("ownerId !== auth.identity.userId");
    expect(source).toContain("forbidden_owner_scope");
  });

  test("five user-facing protected surfaces use private no-store responses", () => {
    const protectedOwners = [
      "app/api/creator-alchemy/quiet-gifts/route.ts",
      "app/api/lumaspace/reflection/route.ts",
      "app/api/lumaspace/shadow/route.ts",
      "app/api/moderation/appeal/route.ts",
      "app/api/ledger/refunds/[ownerId]/[refType]/[refId]/route.ts",
    ];

    for (const owner of protectedOwners) {
      expect(read(owner)).toContain("userPrivateNoStoreHeaders");
    }
  });
});
