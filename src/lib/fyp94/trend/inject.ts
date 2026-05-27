import type { Fyp94TrendMappedQuery } from "./types";

export type Fyp94TrendInjectedClip<T> = T & {
  trend: {
    trendId: string;
    caption: string;
    styleLabel: Fyp94TrendMappedQuery["styleLabel"];
  };
};

export function injectFyp94TrendMetadata<T extends { id?: string }>(
  clips: T[],
  mapped: Fyp94TrendMappedQuery,
): Fyp94TrendInjectedClip<T>[] {
  return clips.map((clip) => ({
    ...clip,
    trend: {
      trendId: mapped.trendId,
      caption: mapped.caption,
      styleLabel: mapped.styleLabel,
    },
  }));
}
