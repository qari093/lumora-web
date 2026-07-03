import type { ConnectivityPayload } from "./types";
import type { ExternalPlatform, PlatformEnvironment } from "./platformTypes";
import { buildExternalBridgeAction } from "./bridgeBuilder";
import { validateBridgeAction } from "./validation";
import { createOpenGraphMetadata, createTwitterCardMetadata, createExternalPreviewCard } from "./metadataCards";
import { createDeferredDeepLink } from "./deepLinks";
import { createReturnToLumoraUrl } from "./returnRecovery";
import { createExternalBridgeAudit } from "./bridgeAudit";
import { createBridgeTelemetryEvent } from "./bridgeTelemetry";

export function createCompleteExternalBridgeManifest(params: {
  payload: ConnectivityPayload;
  platform: ExternalPlatform;
  environment: PlatformEnvironment;
  origin: string;
}) {
  const action = buildExternalBridgeAction(params.platform, params.payload);
  const validation = validateBridgeAction(action);

  return {
    version: "usl-external-bridges-v1",
    environment: params.environment.platform,
    action,
    validation,
    deferredDeepLink: createDeferredDeepLink({
      origin: params.origin,
      shareId: params.payload.shareId,
      destination: params.platform,
      returnTo: createReturnToLumoraUrl(params.origin, params.payload.shareId, "sent"),
    }),
    metadata: {
      openGraph: createOpenGraphMetadata(action.payload),
      twitterCard: createTwitterCardMetadata(action.payload),
      previewCard: createExternalPreviewCard(action.payload),
    },
    audit: createExternalBridgeAudit(action, validation.ok ? "allow" : "limit"),
    telemetry: createBridgeTelemetryEvent({
      shareId: params.payload.shareId,
      platform: params.platform,
      status: "opened",
    }),
  };
}
