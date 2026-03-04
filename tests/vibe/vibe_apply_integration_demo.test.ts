import { describe, it, expect, vi } from "vitest";
import { prisma } from "../../lib/prisma";

// Ensure feature flag is enabled for integration tests regardless of runtime config
vi.mock("../../lib/flags/vibeTags", async () => {
  const actual: any = await vi.importActual("../../lib/flags/vibeTags");
  return {
    ...actual,
    vibeTagsLiteEnabled: () => true,
    isVibeTagsLiteEnabled: () => true,
    isVibeTagsEnabled: () => true,
    getVibeTagsLiteEnabled: () => true,
  };
});

async function pickExistingVibeSlug(): Promise<string> {
  const v = await prisma.vibeTag.findFirst({
    orderBy: { createdAt: "asc" },
    select: { slug: true },
  });
  if (!v?.slug) throw new Error("no_vibe_tags_in_db");
  return v.slug;
}

function assertIdempotentApply(json: any, slug: string) {
  const ok = Boolean(json?.ok);
  const status = String(json?.status || "");
  const err = String(json?.error || "");

  // Success rules:
  // 1) ok=true and status in ["applied","duplicate_vibe"]
  // 2) ok=false and error === "duplicate_vibe" (older handler style)
  const isSuccess =
    (ok && (status === "applied" || status === "duplicate_vibe")) ||
    (!ok && err === "duplicate_vibe");

  if (!isSuccess) {
    throw new Error(`apply_failed: ok=${ok} status=${status} error=${err} (slug=${slug})`);
  }

  // Normalize for expectations
  const normalized = status || err;
  expect(["applied", "duplicate_vibe"]).toContain(normalized);
}

describe("Vibe apply route integration (in-process)", () => {
  it("accepts apply with watchMs >= 5000 (using DB slug)", async () => {
    const route = await import("../../app/api/vibe/apply/route");
    const slug = await pickExistingVibeSlug();

    const nonce = String(Date.now());
    const body = {
      userId: `me_${nonce}`,
      videoId: `demo_video_${nonce}`,
      vibeSlug: slug,
      watchMs: 6000,
    };

    const req = new Request("http://localhost/api/vibe/apply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const res = await route.POST(req as any);
    expect(res.status).toBeGreaterThanOrEqual(200);
    const json = await res.json();

    assertIdempotentApply(json, slug);
  });

  it("rejects apply with watchMs < 5000", async () => {
    const route = await import("../../app/api/vibe/apply/route");
    const slug = await pickExistingVibeSlug();

    const nonce = String(Date.now());
    const body = {
      userId: `me_${nonce}`,
      videoId: `demo_video_${nonce}`,
      vibeSlug: slug,
      watchMs: 1000,
    };

    const req = new Request("http://localhost/api/vibe/apply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const res = await route.POST(req as any);
    const json = await res.json();
    expect(json?.ok).toBe(false);
  });
});
