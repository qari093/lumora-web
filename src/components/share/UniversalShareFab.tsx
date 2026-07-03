"use client";

import type { CreateShareInput } from "@/src/core/share";
import { useUniversalShare } from "./UniversalShareProvider";

export default function UniversalShareFab({ input }: { input: CreateShareInput }) {
  const { openShare } = useUniversalShare();

  return (
    <button
      type="button"
      className="usl-share-fab"
      data-testid="usl-share-fab"
      aria-label={`Open universal share for ${input.title}`}
      onClick={() =>
        openShare({
          input,
          favoriteDestinationIds: ["lumaspace"],
          recentDestinationIds: ["lumalink"],
        })
      }
    >
      ⇪
    </button>
  );
}
