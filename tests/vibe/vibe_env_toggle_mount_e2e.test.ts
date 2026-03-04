import { describe, it, expect, vi, afterEach } from "vitest";

const ENV_KEY = "LUMORA_VIBE_TAGS_LITE";
const ENV_KEY_PUBLIC = "NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE";

afterEach(() => {
  delete process.env[ENV_KEY];
  delete process.env[ENV_KEY_PUBLIC];
  vi.resetModules();
});

describe("Vibe env toggle (mount E2E)", () => {
  it("mount renders null when env disables", async () => {
    process.env[ENV_KEY] = "0";
    vi.resetModules();
    const mod = await import("../../components/vibe/VibeTrayMount");
    const Comp = mod.default as any;
    const el = Comp({ userId: "u", videoId: "v", watchMs: 6000 });
    expect(el).toBeNull();
  });

  it("mount returns an element when env enables", async () => {
    process.env[ENV_KEY] = "1";
    vi.resetModules();
    const mod = await import("../../components/vibe/VibeTrayMount");
    const Comp = mod.default as any;
    const el = Comp({ userId: "u", videoId: "v", watchMs: 6000 });
    expect(el).not.toBeNull();
  });

  it("public env key also enables (NEXT_PUBLIC_*)", async () => {
    process.env[ENV_KEY_PUBLIC] = "true";
    vi.resetModules();
    const mod = await import("../../components/vibe/VibeTrayMount");
    const Comp = mod.default as any;
    const el = Comp({ userId: "u", videoId: "v", watchMs: 6000 });
    expect(el).not.toBeNull();
  });
});
