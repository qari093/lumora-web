import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

describe("Mega29 exceptional security residual closure", () => {
  it("claims a pending appeal atomically", () => {
    const text = source(
      "src/core/moderation-production/appeal.ts",
    );

    expect(text).toContain(
      "tx.moderationAppeal.updateMany",
    );

    expect(text).toMatch(
      /status:\s*MODERATION_APPEAL_PENDING/,
    );

    expect(text).toMatch(
      /claimed\.count\s*!==\s*1/,
    );
  });

  it("binds upload ownership to canonical user session", () => {
    const text = source(
      "app/api/stream/upload-token/route.ts",
    );

    expect(text).toContain("requireUserSession");
    expect(text).toContain(
      "const ownerId = auth.identity.userId",
    );

    expect(text).not.toMatch(
      /const\s*\{\s*ownerId\s*\}\s*=\s*await\s+req\.json/,
    );

    expect(text).toContain(
      'ownershipSource: "authenticated_upload_token"',
    );
  });

  it("persists authenticated ownership before webhook processing", () => {
    const text = source(
      "app/api/stream/upload-token/route.ts",
    );

    expect(text).toContain(
      "prisma.streamVideo.upsert",
    );

    expect(text).toMatch(
      /create:\s*\{[\s\S]*ownerId/,
    );
  });

  it("fails the stream webhook closed without its secret", () => {
    const text = source(
      "app/api/stream/webhook/route.ts",
    );

    expect(text).toContain(
      "LUMORA_STREAM_WEBHOOK_SECRET",
    );

    expect(text).toContain(
      'req.headers.get("x-lumora-sign")',
    );

    expect(text).toMatch(
      /status:\s*401/,
    );
  });

  it("does not allow webhook payloads to establish ownership", () => {
    const text = source(
      "app/api/stream/webhook/route.ts",
    );

    expect(text).toContain(
      "prisma.streamVideo.findUnique",
    );

    expect(text).toContain(
      "prisma.streamVideo.update",
    );

    expect(text).not.toContain(
      "prisma.streamVideo.upsert",
    );

    const updateData =
      text.match(
        /prisma\.streamVideo\.update\s*\(\s*\{[\s\S]*?data:\s*\{([\s\S]*?)\}\s*,\s*select\s*:/,
      )?.[1] ?? "";

    expect(updateData).not.toMatch(
      /\bownerId\s*:/,
    );

    expect(updateData).not.toMatch(
      /body(?:\?|\.)[\s\S]*?ownerId/,
    );
  });

  it("rejects webhook updates for unknown upload ids", () => {
    const text = source(
      "app/api/stream/webhook/route.ts",
    );

    expect(text).toContain('"unknown_upload"');
    expect(text).toMatch(/status:\s*404/);
  });

  it("preserves typed appeal target mappings", () => {
    const text = source(
      "app/api/moderation/appeal/route.ts",
    );

    expect(text).toContain(
      "APPEAL_TARGET_NOT_FOUND",
    );

    expect(text).toContain(
      "APPEAL_TARGET_FORBIDDEN",
    );

    expect(text).toContain(
      "APPEAL_TARGET_NOT_APPEALABLE",
    );

    expect(text).toContain("404");
    expect(text).toContain("403");
    expect(text).toContain("409");
  });
});
