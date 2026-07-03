"use client";

import type { CreateShareInput } from "@/src/core/share";
import { useUniversalShare } from "./UniversalShareProvider";

export type UniversalShareButtonProps = {
  input: CreateShareInput;
  label?: string;
  className?: string;
  recentDestinationIds?: string[];
  favoriteDestinationIds?: string[];
};

export default function UniversalShareButton({
  input,
  label = "Share",
  className,
  recentDestinationIds,
  favoriteDestinationIds,
}: UniversalShareButtonProps) {
  const { openShare } = useUniversalShare();

  return (
    <button
      type="button"
      className={className ?? "usl-inline-share-button"}
      data-testid="usl-share-button"
      aria-label={`Share ${input.title}`}
      onClick={() => openShare({ input, recentDestinationIds, favoriteDestinationIds })}
    >
      {label}
    </button>
  );
}
