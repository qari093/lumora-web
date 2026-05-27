export type WhisperSignal =
  | "rewatch_peak"
  | "silent_linger"
  | "completion_rhythm"
  | "save_overlap"
  | "tone_softening"
  | "quiet_return";

export type MiniMirrorSymbol =
  | "silence"
  | "patience"
  | "bloom"
  | "echo"
  | "return"
  | "restlessness"
  | "softness"
  | "threshold";

export interface WhisperEvent {
  signal: WhisperSignal;
  videoId: string;
  timestampSeconds?: number;
  strength: number;
  sampleSize: number;
}

export interface GeneratedWhisper {
  id: string;
  text: string;
  signal: WhisperSignal;
  videoId: string;
  timestampSeconds?: number;
  priority: number;
  safe: boolean;
}

export interface EmotionalWeather {
  visible: boolean;
  text: string;
  symbol: MiniMirrorSymbol | null;
  strength: number;
}

export interface MiniMirror {
  monthKey: string;
  symbol: MiniMirrorSymbol;
  phrase: string;
  accepted: boolean | null;
  stored: boolean;
}
