import { describe, expect, it } from "vitest";
import { metadata } from "@/app/go/metadata";

describe("Lumora invite /go metadata", () => {
  it("contains WhatsApp/OpenGraph preview metadata", () => {
    expect(metadata.title).toBe("Lumora — Private Beta Access");
    expect(metadata.description).toBe("A private invite to enter Lumora.");
    expect(metadata.openGraph?.url).toBe("https://www.lumora.app/go");
      const images = metadata.openGraph?.images;
      const firstImage = Array.isArray(images) ? images[0] : images;
      expect(firstImage).toMatchObject({
      url: "https://www.lumora.app/lumora-invite.png",
      width: 1024,
      height: 1024,
    });
  });
});
