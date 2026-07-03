import type { ConnectivityPayload } from "./types";
import { createAdvancedQrPayload } from "./qrAdvanced";
import { createPortableEmbedManifest } from "./embedAdvanced";
import { createConnectivityApiEnvelope } from "./apiBridge";
import { createFederatedShareDocument } from "./federationAdvanced";

export function createUniversalConnectivityFinalManifest(payload: ConnectivityPayload, origin: string) {
  return {
    version: "usl-connectivity-final-v1",
    shareId: payload.shareId,
    qr: createAdvancedQrPayload(payload),
    embed: createPortableEmbedManifest(payload),
    api: createConnectivityApiEnvelope("share.deliver", payload),
    federation: createFederatedShareDocument(payload, origin),
    lockedCapabilities: [
      "external_apps",
      "native_share",
      "clipboard",
      "qr",
      "nfc_ready",
      "airdrop_ready",
      "nearby_share_ready",
      "web_embed",
      "api",
      "import_export",
      "federation_ready",
    ],
  };
}

export function validateUniversalConnectivityFinalManifest(
  manifest: ReturnType<typeof createUniversalConnectivityFinalManifest>,
): boolean {
  return (
    manifest.version === "usl-connectivity-final-v1" &&
    manifest.qr.version === "usl-qr-v1" &&
    manifest.embed.version === "usl-portable-embed-v1" &&
    manifest.api.version === "usl-connectivity-api-v1" &&
    manifest.federation.type === "LumoraShare" &&
    manifest.lockedCapabilities.includes("federation_ready")
  );
}
