import {
  createUniversalShareIntent,
  materializeShareIntent,
  transformShareForPortal,
  createLivingMemoryRecord,
  createUniversalConnectivityFinalManifest,
  evaluateTrustSafety,
  createTrustPolicy,
  createPrivacyPolicy,
  canActorView,
} from "@/src/core/share";

export type ShareJourneyStep = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type ShareJourneyResult = {
  id: string;
  source: string;
  destination: string;
  steps: ShareJourneyStep[];
  passed: boolean;
};

export function createShareJourneyStep(id: string, label: string, passed: boolean, detail: string): ShareJourneyStep {
  return { id, label, passed, detail };
}

export function runFypToLumaSpaceJourney(): ShareJourneyResult {
  const intent = createUniversalShareIntent(
    {
      kind: "video",
      sourcePortal: "fyp",
      destinationPortal: "lumaspace",
      sourceObjectId: "visual_e2e_trace_001",
      title: "Visual E2E Wonder Trace",
      createdBy: "visual-audit",
      metadata: {
        mood: "wonder",
        atmosphere: "cyan-stardust",
        echo: true,
        echoDurationSeconds: 12,
      },
    },
    "lumaspace",
    "silent",
  );

  const share = materializeShareIntent(intent);
  const transformed = transformShareForPortal(share, "lumaspace");
  const memory = createLivingMemoryRecord(share);
  const privacy = createPrivacyPolicy({
    ownerId: share.createdBy,
    audience: "friends",
    allowedActorIds: ["recipient_1"],
  });
  const trust = evaluateTrustSafety({
    policy: createTrustPolicy({ actorId: share.createdBy, requireConsent: true }),
    actorId: share.createdBy,
    recipientId: "recipient_1",
    baseTrust: 0.86,
    priorShares: 6,
    successfulDeliveries: 6,
    consentGranted: true,
    external: false,
  });

  const steps = [
    createShareJourneyStep("intent", "Share intent created", intent.destination.id === "lumaspace", intent.confirmationLabel),
    createShareJourneyStep("materialized", "Share object materialized", share.destinationPortal === "lumaspace", share.id),
    createShareJourneyStep("transformed", "Transformed into LumaSpace artifact", transformed.artifactKind === "memory_star", transformed.artifactKind),
    createShareJourneyStep("memory", "Living memory record created", memory.kind === "memory_star", memory.id),
    createShareJourneyStep("privacy", "Recipient visibility allowed", canActorView(privacy, "recipient_1"), "friends visibility"),
    createShareJourneyStep("trust", "Trust safety allowed", trust.decision === "allow", trust.decision),
  ];

  return {
    id: "journey_fyp_to_lumaspace",
    source: "fyp",
    destination: "lumaspace",
    steps,
    passed: steps.every((step) => step.passed),
  };
}

export function runLumaSpaceToLumaLinkJourney(): ShareJourneyResult {
  const intent = createUniversalShareIntent(
    {
      kind: "memory",
      sourcePortal: "lumaspace",
      destinationPortal: "lumalink",
      sourceObjectId: "visual_e2e_memory_001",
      title: "Memory Bridge",
      createdBy: "visual-audit",
      metadata: {
        mood: "calm",
        atmosphere: "soft-orbit",
        note: "This belongs in our conversation.",
      },
    },
    "lumalink",
    "echo",
  );

  const share = materializeShareIntent(intent);
  const transformed = transformShareForPortal(share, "lumalink");

  const steps = [
    createShareJourneyStep("intent", "LumaLink intent created", intent.destination.id === "lumalink", intent.confirmationLabel),
    createShareJourneyStep("materialized", "Share object materialized", share.destinationPortal === "lumalink", share.id),
    createShareJourneyStep("transformed", "Transformed into conversation card", transformed.artifactKind === "conversation_card", transformed.artifactKind),
  ];

  return {
    id: "journey_lumaspace_to_lumalink",
    source: "lumaspace",
    destination: "lumalink",
    steps,
    passed: steps.every((step) => step.passed),
  };
}

export function runExternalConnectivityJourney(origin = "https://lumora.app"): ShareJourneyResult {
  const intent = createUniversalShareIntent(
    {
      kind: "link",
      sourcePortal: "lumaspace",
      destinationPortal: "external",
      sourceObjectId: "visual_external_001",
      title: "External Share Trace",
      createdBy: "visual-audit",
      url: `${origin}/share/visual_external_001`,
      metadata: {
        mood: "wonder",
        atmosphere: "cyan-stardust",
      },
    },
    "external_qr",
    "external",
  );

  const share = materializeShareIntent(intent);
  const manifest = createUniversalConnectivityFinalManifest(
    {
      shareId: share.id,
      title: share.title,
      text: share.description ?? share.title,
      url: share.url ?? `${origin}/share/${share.id}`,
      channel: "qr",
      metadata: share.metadata,
    },
    origin,
  );

  const steps = [
    createShareJourneyStep("intent", "External intent created", intent.destination.id === "external_qr", intent.confirmationLabel),
    createShareJourneyStep("materialized", "External share materialized", share.destinationPortal === "external", share.id),
    createShareJourneyStep("qr", "QR route available", manifest.qr.version === "usl-qr-v1", manifest.qr.version),
    createShareJourneyStep("embed", "Embed route available", manifest.embed.revocationAware === true, manifest.embed.version),
    createShareJourneyStep("api", "API envelope available", manifest.api.idempotencyKey.includes(share.id), manifest.api.idempotencyKey),
    createShareJourneyStep("federation", "Federation document available", manifest.federation.type === "LumoraShare", manifest.federation.type),
  ];

  return {
    id: "journey_external_connectivity",
    source: "lumaspace",
    destination: "external",
    steps,
    passed: steps.every((step) => step.passed),
  };
}

export function summarizeShareJourneys(journeys: ShareJourneyResult[]) {
  const total = journeys.length;
  const passed = journeys.filter((journey) => journey.passed).length;
  const steps = journeys.flatMap((journey) => journey.steps);
  const passedSteps = steps.filter((step) => step.passed).length;

  return {
    total,
    passed,
    stepTotal: steps.length,
    stepPassed: passedSteps,
    score: Number((passedSteps / Math.max(1, steps.length)).toFixed(4)),
    ready: total > 0 && passed === total && passedSteps === steps.length,
  };
}
