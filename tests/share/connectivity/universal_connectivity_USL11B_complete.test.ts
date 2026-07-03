import { describe, expect, it } from "vitest";
import {
  buildExternalBridgeAction,
  createBridgeHealth,
  createBridgeTelemetryEvent,
  createCompleteExternalBridgeManifest,
  createConnectivityPayload,
  createDeferredDeepLink,
  createExternalBridgeAudit,
  createFailedExternalShareRecovery,
  createOpenGraphMetadata,
  createReturnToLumoraUrl,
  detectPlatformEnvironment,
  enqueueExternalBridgeRetry,
  listPlatformBridges,
  markExternalBridgeRetry,
  parseReturnToLumoraUrl,
  sanitizeExternalPayload,
  selectHealthyBridge,
  selectPreferredPlatform,
  stripPrivateMetadata,
  validateBridgeAction,
} from "@/src/core/share";

describe("USL Mega Pack 11B — Complete External Platform Bridges Ω", () => {
  it("registers complete external platform bridge coverage", () => {
    const platforms = listPlatformBridges().map((bridge) => bridge.platform);

    expect(platforms).toContain("whatsapp");
    expect(platforms).toContain("telegram");
    expect(platforms).toContain("signal");
    expect(platforms).toContain("sms");
    expect(platforms).toContain("email");
    expect(platforms).toContain("android_intent");
    expect(platforms).toContain("ios_universal_link");
    expect(platforms).toContain("native_share");
    expect(platforms).toContain("clipboard");
    expect(platforms).toContain("web_embed");
  });

  it("builds platform actions and validates external payloads", () => {
    const payload = createConnectivityPayload({
      shareId: "share_11b",
      title: "Wonder Trace",
      text: "Open this trace",
      url: "https://lumora.app/share/share_11b",
      channel: "whatsapp",
      metadata: { email: "hidden@example.com", mood: "wonder" },
    });

    const safe = sanitizeExternalPayload(payload);
    const action = buildExternalBridgeAction("whatsapp", safe);
    const validation = validateBridgeAction(action);

    expect(stripPrivateMetadata(payload.metadata).email).toBeUndefined();
    expect(safe.metadata.mood).toBe("wonder");
    expect(action.action).toContain("wa.me");
    expect(validation.ok).toBe(true);
  });

  it("supports deep links, return recovery, retries, health, and telemetry", () => {
    const payload = createConnectivityPayload({
      shareId: "share_recover",
      title: "Recover Trace",
      url: "https://lumora.app/share/share_recover",
      channel: "email",
    });

    const action = buildExternalBridgeAction("email", payload);
    const returnUrl = createReturnToLumoraUrl("https://lumora.app", payload.shareId, "sent");
    const parsed = parseReturnToLumoraUrl(returnUrl);
    const deep = createDeferredDeepLink({ origin: "https://lumora.app", shareId: payload.shareId, destination: "email" });
    const recovery = createFailedExternalShareRecovery(payload.shareId, "email");
    const retry = markExternalBridgeRetry(enqueueExternalBridgeRetry([], action), `bridge_retry_${payload.shareId}_email`, false);
    const telemetry = createBridgeTelemetryEvent({ shareId: payload.shareId, platform: "email", status: "opened" });

    expect(parsed.shareId).toBe("share_recover");
    expect(deep).toContain("deferred=1");
    expect(recovery.action).toBe("retry_or_copy_link");
    expect(retry[0].state).toBe("retrying");
    expect(telemetry.privacySafe).toBe(true);
  });

  it("detects platform environment and selects healthy bridge paths", () => {
    const env = detectPlatformEnvironment("Mozilla iPhone", { hasNavigatorShare: false, secureContext: true });
    const preferred = selectPreferredPlatform(env);
    const bridge = selectHealthyBridge(
      [{ platform: "clipboard" as const }, { platform: "email" as const }],
      [createBridgeHealth("clipboard", false), createBridgeHealth("email", true)],
    );

    expect(env.platform).toBe("ios");
    expect(preferred).toBe("ios_universal_link");
    expect(bridge?.platform).toBe("email");
  });

  it("creates complete bridge manifest with cards, audit, and validation", () => {
    const payload = createConnectivityPayload({
      shareId: "share_manifest",
      title: "Manifest Trace",
      text: "A share with external metadata",
      url: "https://lumora.app/share/share_manifest",
      channel: "telegram",
    });

    const env = detectPlatformEnvironment("Mozilla Android", { hasNavigatorShare: true });
    const manifest = createCompleteExternalBridgeManifest({
      payload,
      platform: "telegram",
      environment: env,
      origin: "https://lumora.app",
    });
    const og = createOpenGraphMetadata(payload);
    const audit = createExternalBridgeAudit(manifest.action, "allow");

    expect(manifest.version).toBe("usl-external-bridges-v1");
    expect(manifest.action.action).toContain("t.me/share/url");
    expect(manifest.metadata.twitterCard["twitter:title"]).toBe("Manifest Trace");
    expect(og["og:site_name"]).toBe("Lumora");
    expect(audit.decision).toBe("allow");
  });
});
