import type { AtmosphereMode } from "../core/types";

export type ResonanceRowSurface =
  | "live_room"
  | "music"
  | "gmar"
  | "creator"
  | "cultural_pulse"
  | "echo_trace"
  | "relic"
  | "related_atmosphere";

export type ResonanceRowItem = {
  itemId: string;
  surface: ResonanceRowSurface;
  title: string;
  mode: AtmosphereMode;
  priority: number;
  deepLink: string;
};

export type ResonanceRow = {
  contentId: string;
  mode: AtmosphereMode;
  items: ResonanceRowItem[];
  expanded: boolean;
};
