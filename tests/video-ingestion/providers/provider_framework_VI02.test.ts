import { beforeEach, describe, expect, it } from "vitest";
import {
  bootstrapUniversalVideoProviders,
  clearUniversalProviders,
  discoverAllEnabledProviders,
  discoverProviderAssets,
  genesisUniversalAdapter,
  getUniversalProvider,
  listUniversalProviders,
  registerUniversalProvider,
} from "@/src/core/video-ingestion";

describe("Video Ingestion Ω — Pack 02 Provider Framework", () => {
  beforeEach(() => {
    clearUniversalProviders();
  });

  it("registers universal providers", () => {
    registerUniversalProvider(genesisUniversalAdapter);

    expect(getUniversalProvider("genesis")?.adapter.provider.id).toBe("genesis");
    expect(listUniversalProviders()).toHaveLength(1);
  });

  it("bootstraps Genesis as the first canonical provider", () => {
    const boot = bootstrapUniversalVideoProviders();

    expect(boot.count).toBe(1);
    expect(boot.registered).toEqual(["genesis"]);
    expect(listUniversalProviders()[0].provider.kind).toBe("genesis");
  });

  it("discovers Genesis assets through the provider runtime", async () => {
    bootstrapUniversalVideoProviders();

    const result = await discoverProviderAssets("genesis");

    expect(result.providerId).toBe("genesis");
    expect(result.runtime.ok).toBe(true);
    expect(result.runtime.job.state).toBe("complete");
    expect(result.assets).toHaveLength(1);
    expect(result.assets[0].providerId).toBe("genesis");
  });

  it("discovers all enabled providers", async () => {
    bootstrapUniversalVideoProviders();

    const results = await discoverAllEnabledProviders();

    expect(results).toHaveLength(1);
    expect(results[0].providerId).toBe("genesis");
    expect(results[0].assets[0].metadata.genesisProtected).toBe(true);
  });

  it("rejects unknown providers", async () => {
    await expect(discoverProviderAssets("missing")).rejects.toThrow("provider_not_registered:missing");
  });
});
