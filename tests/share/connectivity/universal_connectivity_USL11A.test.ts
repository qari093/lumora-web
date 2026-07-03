import { describe, expect, it } from "vitest";
import {
  createConnectivityPayload,
  createConnectivityRoute,
  createUniversalShareUrl,
  getConnectivityCapability,
  listConnectivityChannels,
  selectBestConnectivityRoute,
} from "@/src/core/share";

describe("USL Mega Pack 11A — Universal Connectivity Core", () => {
  it("registers universal connectivity channels and capabilities", () => {
    const channels = listConnectivityChannels();

    expect(channels).toContain("whatsapp");
    expect(channels).toContain("qr");
    expect(channels).toContain("api");
    expect(channels).toContain("federation");
    expect(getConnectivityCapability("qr").supportsSilentDelivery).toBe(true);
  });

  it("creates universal share URLs and payloads", () => {
    const url = createUniversalShareUrl("https://lumora.app/", "share_1");
    const payload = createConnectivityPayload({
      shareId: "share_1",
      title: "Wonder Trace",
      url,
      channel: "api",
      metadata: { mood: "wonder" },
    });

    expect(url).toBe("https://lumora.app/share/share_1");
    expect(payload.text).toBe("Wonder Trace");
    expect(payload.metadata.mood).toBe("wonder");
  });

  it("selects the best healthy connectivity route", () => {
    const route = selectBestConnectivityRoute([
      createConnectivityRoute({ channel: "api", destination: "primary", priority: 20, healthy: false }),
      createConnectivityRoute({ channel: "qr", destination: "fallback", priority: 50, healthy: true }),
      createConnectivityRoute({ channel: "federation", destination: "node", priority: 40, healthy: true }),
    ]);

    expect(route.channel).toBe("qr");
    expect(route.healthy).toBe(true);
  });
});
