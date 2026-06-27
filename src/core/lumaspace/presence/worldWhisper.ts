export type LumaWorld = "dream" | "wonder" | "creator" | "shadow" | "gaming" | "calm";

export type WorldWhisper = {
  world: LumaWorld;
  label: string;
  tone: string;
  durationMs: number;
  volume: number;
};

export const worldWhispers: Record<LumaWorld, WorldWhisper> = {
  dream: {
    world: "dream",
    label: "Dream",
    tone: "gentle wind chime",
    durationMs: 1400,
    volume: 0.18
  },
  wonder: {
    world: "wonder",
    label: "Wonder",
    tone: "faint shimmering bell",
    durationMs: 1400,
    volume: 0.18
  },
  creator: {
    world: "creator",
    label: "Creator",
    tone: "soft blue forge hum",
    durationMs: 1400,
    volume: 0.16
  },
  shadow: {
    world: "shadow",
    label: "Shadow",
    tone: "low velvet nebula tone",
    durationMs: 1500,
    volume: 0.14
  },
  gaming: {
    world: "gaming",
    label: "Gaming",
    tone: "warm analog synth hum",
    durationMs: 1400,
    volume: 0.15
  },
  calm: {
    world: "calm",
    label: "Calm",
    tone: "soft water drop ripple",
    durationMs: 1500,
    volume: 0.13
  }
};

export function getWorldWhisper(world: LumaWorld): WorldWhisper {
  return worldWhispers[world];
}

export function isSerenitySafeWhisper(whisper: WorldWhisper): boolean {
  return whisper.durationMs <= 1500 && whisper.volume <= 0.18;
}
