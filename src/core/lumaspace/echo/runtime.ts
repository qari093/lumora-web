export type EchoVisibility = "private" | "circle" | "shared";

export type EchoMemory = {
  id: string;
  memoryId: string;
  durationSeconds: number;
  transcript: string;
  visibility: EchoVisibility;
};

export const ECHO_MAX_SECONDS = 15;

export function createEchoMemory(input: Omit<EchoMemory, "durationSeconds"> & { durationSeconds?: number }): EchoMemory {
  return {
    ...input,
    durationSeconds: Math.min(input.durationSeconds ?? ECHO_MAX_SECONDS, ECHO_MAX_SECONDS)
  };
}

export function isEchoValid(echo: EchoMemory): boolean {
  return echo.durationSeconds > 0 && echo.durationSeconds <= ECHO_MAX_SECONDS && echo.transcript.trim().length > 0;
}
