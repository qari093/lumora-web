import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  createNativeSharePayload,
  createShareCopyText,
  createUniversalShareDeepLink,
  createUniversalShareIntent,
  createUniversalSharePreview,
  explainShareRecommendation,
  getShareDestination,
  groupShareDestinations,
  materializeShareIntent,
  rankShareDestinations,
  searchShareDestinations,
} from "@/src/core/share";

describe("USL Mega Pack 02 — Final Universal Share Experience Ω", () => {
  it("supports final search, grouping, ranking, preview, and recommendation", () => {
    const ranked = rankShareDestinations({ sourcePortal: "fyp", favoriteDestinationIds: ["lumaspace"] });
    const searched = searchShareDestinations(ranked, "lumaspace");
    const groups = groupShareDestinations(ranked);
    const destination = getShareDestination("lumaspace");

    if (!destination) throw new Error("missing_lumaspace_destination");

    const preview = createUniversalSharePreview(
      {
        kind: "video",
        sourcePortal: "fyp",
        destinationPortal: "lumaspace",
        sourceObjectId: "trace",
        title: "Trace",
        createdBy: "founder",
      },
      destination,
      "silent",
    );

    expect(ranked[0].id).toBe("lumaspace");
    expect(searched[0].id).toBe("lumaspace");
    expect(groups.some((group) => group.id === "portal")).toBe(true);
    expect(preview.transformationLabel).toBe("Memory Star");
    expect(explainShareRecommendation(
      {
        kind: "video",
        sourcePortal: "fyp",
        destinationPortal: "lumaspace",
        sourceObjectId: "trace",
        title: "Trace",
        createdBy: "founder",
      },
      destination,
    )).toContain("FYP trace");
  });

  it("creates deep links, copy text, and native share payloads", () => {
    const intent = createUniversalShareIntent(
      {
        kind: "video",
        sourcePortal: "fyp",
        destinationPortal: "lumaspace",
        sourceObjectId: "trace_003",
        title: "Trace Three",
        createdBy: "founder",
      },
      "lumaspace",
      "silent",
    );

    const share = materializeShareIntent(intent);
    const deepLink = createUniversalShareDeepLink(share, "https://lumora.test");
    const copyText = createShareCopyText(share, "https://lumora.test");
    const nativePayload = createNativeSharePayload(share, "https://lumora.test");

    expect(deepLink).toContain("/share/open?");
    expect(deepLink).toContain(share.id);
    expect(copyText).toContain("Trace Three");
    expect(nativePayload.url).toBe(deepLink);
  });

  it("locks production provider, buttons, FAB, search, success, error, retry, copy, and native share UX", () => {
    const provider = fs.readFileSync("src/components/share/UniversalShareProvider.tsx", "utf8");
    const button = fs.readFileSync("src/components/share/UniversalShareButton.tsx", "utf8");
    const fab = fs.readFileSync("src/components/share/UniversalShareFab.tsx", "utf8");
    const sheet = fs.readFileSync("src/components/share/UniversalShareSheet.tsx", "utf8");
    const css = fs.readFileSync("src/components/share/universal-share-sheet.css", "utf8");

    expect(provider).toContain("UniversalShareProvider");
    expect(provider).toContain("useUniversalShare");
    expect(button).toContain('data-testid="usl-share-button"');
    expect(fab).toContain('data-testid="usl-share-fab"');
    expect(sheet).toContain('data-testid="usl-share-search"');
    expect(sheet).toContain('data-testid="usl-share-success"');
    expect(sheet).toContain('data-testid="usl-share-error"');
    expect(sheet).toContain("Retry");
    expect(sheet).toContain("navigator.clipboard");
    expect(sheet).toContain("navigator.share");
    expect(css).toContain("@media (max-width: 560px)");
    expect(css).toContain("prefers-reduced-motion");
  });

  it("locks demo route through provider and reusable triggers", () => {
    const source = fs.readFileSync("app/share/ShareDemoClient.tsx", "utf8");

    expect(source).toContain("UniversalShareProvider");
    expect(source).toContain("UniversalShareButton");
    expect(source).toContain("UniversalShareFab");
    expect(source).toContain('data-testid="usl-share-demo-page"');
    expect(source).toContain('data-testid="usl-toggle-fab"');
  });
});
