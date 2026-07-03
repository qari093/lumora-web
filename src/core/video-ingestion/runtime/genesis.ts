import {
  createCanonicalVideoAsset,
  createVideoLicense,
  createVideoProvider,
} from "./schema";
import { createProviderAdapter } from "./adapter";

export const genesisProvider = createVideoProvider({
  id: "genesis",
  label: "Genesis Collection",
  kind: "genesis",
  priority: 100,
  constitutionId: "genesis.v1",
});

export const genesisAdapter = createProviderAdapter(
  genesisProvider,
  () => ({
    providerId: genesisProvider.id,
    cursor: "genesis_cursor_v1",
    assets: [
      createCanonicalVideoAsset({
        providerId: genesisProvider.id,
        sourceAssetId: "genesis_trace_001",
        sourceUrl:
          "https://lumora.app/media/genesis_trace_001.mp4",
        title: "Genesis Trace 001",
        durationSeconds: 32,
        width: 1920,
        height: 1080,
        hasAudio: true,
        mimeType: "video/mp4",
        attribution: "Lumora",
        license: createVideoLicense({
          id: "lumora-owned",
          label: "Lumora Owned",
          commercialUse: true,
          derivativesAllowed: true,
          attributionRequired: false,
          sourceUrl:
            "https://lumora.app/licenses/genesis",
        }),
        tags: ["genesis", "wonder"],
        metadata: {
          serenity: 0.92,
          source: "genesis",
        },
      }),
    ],
  }),
);
