import { describe, expect, it } from "vitest";
import { metadata } from "@/app/go/metadata";

describe("Lumora invite /go metadata", () => {
  it("contains WhatsApp/OpenGraph preview metadata", () => {
    expect(metadata.title).toBe("Lumora — Private Beta Access");
    expect(metadata.description).toBe("A private invite to enter Lumora.");
    expect(metadata.openGraph?.url).toBe("https://www.lumora.app/go");
    expect(metadata.openGraph?.images?.[0]).toMatchObject({
      url: "https://www.lumora.app/lumora-invite.png",
      width: 1024,
      height: 1024,
    });
  });
});
