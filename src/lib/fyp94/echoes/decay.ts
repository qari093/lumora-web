import type { Fyp94WaveEcho } from "./types";

export function applyFyp94EchoDecay(input: {
  echo: Fyp94WaveEcho;
  now?: Date;
}): Fyp94WaveEcho {
  const now = input.now ?? new Date();
  if (new Date(input.echo.expiresAt).getTime() <= now.getTime()) {
    return { ...input.echo, state: "expired" };
  }
  return input.echo;
}

export function extendFyp94EchoLifetime(input: {
  echo: Fyp94WaveEcho;
  extraDays: number;
}): Fyp94WaveEcho {
  const expires = new Date(input.echo.expiresAt).getTime();
  return {
    ...input.echo,
    expiresAt: new Date(expires + input.extraDays * 24 * 60 * 60_000).toISOString(),
  };
}
