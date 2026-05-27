import type {
  AuraTone,
  WhisperEcho,
  LumaSoundRuntime
} from "../types";

export function validateAuraTone(
  tone: AuraTone
): boolean {
  return Boolean(
    tone.id &&
    tone.frequency > 0
  );
}

export function validateWhisperEcho(
  echo: WhisperEcho
): boolean {
  return Boolean(
    echo.id &&
    echo.whisper
  );
}

export function validateLumaSoundRuntime(
  runtime: LumaSoundRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.soundId
  );
}
