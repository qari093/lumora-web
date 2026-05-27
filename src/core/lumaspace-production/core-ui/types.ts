export type LumaViewport = "mobile" | "tablet" | "desktop";
export type RenderMode = "cinematic" | "atmospheric" | "poetic";

export interface CoreUiShell {
  id: string;
  viewport: LumaViewport;
  renderMode: RenderMode;
  reducedMotion: boolean;
  ready: boolean;
}

export interface UiTelemetryEvent {
  id: string;
  event: string;
  at: number;
}
