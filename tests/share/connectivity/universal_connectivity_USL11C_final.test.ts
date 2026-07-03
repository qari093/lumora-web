import { describe, expect, it } from "vitest";
import {
  createAdvancedQrPayload,
  createConnectivityApiEnvelope,
  createFederatedShareDocument,
  createFederationDiscoveryDocument,
  createPortableEmbedManifest,
  createQrDeepLinkPayload,
  createQrExportFilename,
  createSafeEmbedHtml,
  createConnectivityPayload,
  createUniversalConnectivityFinalManifest,
  validateConnectivityApiEnvelope,
  validateFederatedShareDocument,
  validateUniversalConnectivityFinalManifest,
} from "@/src/core/share";

describe("USL Mega Pack 11C — QR Embed API Federation Final Lock", () => {
  function payload() {
    return createConnectivityPayload({
      shareId: "share_11c",
      title: "Final Connectivity",
      text: "A portable Lumora share.",
      url: "https://lumora.app/share/share_11c",
      channel: "qr",
      metadata: { creatorId: "creator_1" },
    });
  }

  it("creates advanced QR payloads and exports", () => {
    const qr = createAdvancedQrPayload(payload());
    const deep = createQrDeepLinkPayload(payload());

    expect(qr.version).toBe("usl-qr-v1");
    expect(qr.downloadable).toBe(true);
    expect(createQrExportFilename(payload())).toBe("lumora-share-share_11c.svg");
    expect(deep.fallbackUrl).toContain("share_11c");
  });

  it("creates safe portable embed manifests", () => {
    const html = createSafeEmbedHtml(payload());
    const embed = createPortableEmbedManifest(payload());

    expect(html).toContain("sandbox=");
    expect(embed.version).toBe("usl-portable-embed-v1");
    expect(embed.revocationAware).toBe(true);
  });

  it("creates and validates API envelopes", () => {
    const envelope = createConnectivityApiEnvelope("share.deliver", payload());

    expect(envelope.idempotencyKey).toContain("share_11c");
    expect(validateConnectivityApiEnvelope(envelope)).toBe(true);
  });

  it("creates federation discovery and share documents", () => {
    const doc = createFederatedShareDocument(payload(), "https://lumora.app");
    const discovery = createFederationDiscoveryDocument("lumora.app");

    expect(validateFederatedShareDocument(doc)).toBe(true);
    expect(discovery.links.some((link) => link.rel === "lumora-usl-share")).toBe(true);
  });

  it("locks the final universal connectivity manifest", () => {
    const manifest = createUniversalConnectivityFinalManifest(payload(), "https://lumora.app");

    expect(validateUniversalConnectivityFinalManifest(manifest)).toBe(true);
    expect(manifest.lockedCapabilities).toContain("external_apps");
    expect(manifest.lockedCapabilities).toContain("federation_ready");
  });
});
