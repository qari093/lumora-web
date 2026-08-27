import { describe, expect, it } from "vitest";
import * as nodeFs from "node:fs";

const protectedRoutes = [
  "app/api/lumalink/connections/route.ts",
  "app/api/lumalink/relationships/route.ts",
  "app/api/lumalink/groups/route.ts",
  "app/api/lumalink/messages/route.ts",
  "app/api/lumalink/presence/route.ts",
];

describe("LumaLink 3.0 production security contract", () => {
  it("uses authenticated server identity on every private route", () => {
    for (const file of protectedRoutes) {
      const source = nodeFs.readFileSync(file, "utf8");
      expect(source).toContain("requireUserSession");
      expect(source).toContain("auth.identity.userId");
    }
  });

  it("does not trust client acting identity", () => {
    const combined = protectedRoutes
      .map((file) => nodeFs.readFileSync(file, "utf8"))
      .join("\n");

    const unsafe = [
      "senderId: body?.senderId",
      "ownerId: body?.ownerId",
      "actorId: body?.actorId",
      "userId: body?.userId",
      "requesterId: body?.requesterId",
    ];

    for (const marker of unsafe) {
      expect(combined).not.toContain(marker);
    }
  });

  it("uses Prisma persistence", () => {
    const source = nodeFs.readFileSync(
      "src/core/lumalink/persistence.ts",
      "utf8",
    );

    for (const marker of [
      "prisma.lumaLinkConnection",
      "prisma.lumaLinkGroup",
      "prisma.lumaLinkGroupMember",
      "prisma.lumaLinkMessage",
      "prisma.lumaLinkPresence",
    ]) {
      expect(source).toContain(marker);
    }

    expect(source).not.toContain("new Map");
  });
});
