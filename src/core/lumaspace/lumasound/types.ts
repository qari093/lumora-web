export interface AuraTone {
  id: string;
  frequency: number;
}

export interface WhisperEcho {
  id: string;
  whisper: string;
}

export interface LumaSoundRuntime {
  active: boolean;
  soundId: string;
}
