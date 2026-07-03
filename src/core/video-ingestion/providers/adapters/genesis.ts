import {
  createCanonicalVideoAsset,
  createVideoLicense,
  createVideoProvider,
} from "../../runtime";

import type { UniversalProviderAdapter } from "../types";

export const genesisUniversalAdapter: UniversalProviderAdapter = {
  provider: createVideoProvider({
    id: "genesis",
    label: "Genesis Collection",
    kind: "genesis",
    enabled: true,
    priority: 100,
    constitutionId: "genesis.v1",
  }),

  capabilities: {
    api: false,
    directDownload: true,
    pagination: false,
    webhooks: false,
    incrementalSync: false,
  },

  discover() {
    return {
      cursor: "genesis.static.v1",
      assets: [
        createCanonicalVideoAsset({
          providerId: "genesis",
          sourceAssetId: "genesis_trace_001",
          sourceUrl: "https://lumora.app/media/genesis_trace_001.mp4",
          title: "Genesis Trace 001",
          description: "Protected Genesis seed trace.",
          durationSeconds: 32,
          width: 1920,
          height: 1080,
          hasAudio: true,
          mimeType: "video/mp4",
          attribution: "Lumora Genesis Collection",
          license: createVideoLicense({
            id: "lumora-owned",
            label: "Lumora Owned",
            commercialUse: true,
            derivativesAllowed: true,
            attributionRequired: false,
            sourceUrl: "https://lumora.app/licenses/genesis",
          }),
          tags: ["genesis", "wonder", "protected"],
          metadata: {
            genesisProtected: true,
            serenity: 0.92,
            wonder: 0.88,
            spectacle: 0.12,
          },
        }),
      ],
    };
  },
};
