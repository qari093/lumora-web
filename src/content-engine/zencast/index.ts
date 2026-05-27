export type ZencastMode = "off" | "blend" | "fallback";

export function checkFeedAliveness(input: {
  poolSize: number;
  freshPoolSize: number;
}) {
  const mode: ZencastMode =
    input.poolSize <= 0 ? "fallback" : input.poolSize < 10 ? "blend" : "off";

  return {
    ok: input.poolSize > 0,
    poolSize: input.poolSize,
    freshPoolSize: input.freshPoolSize,
    zencastMode: mode,
  };
}

export function createZencast(input: {
  seed: string;
  emotionalTone?: "calm" | "warm" | "still" | "curious";
}) {
  const tone = input.emotionalTone || "calm";

  return {
    contentId: `zencast_${input.seed}`,
    type: "zencast" as const,
    hlsPlaylistUrl: `/api/zencast/${input.seed}.m3u8`,
    thumbnailUrl: `/api/zencast/${input.seed}.jpg`,
    categoryTags: ["zencast", tone],
    durationMs: 18000,
    resonanceIndex: 0.25,
    generated: true,
  };
}

export function blendZencasts(input: {
  items: any[];
  mode: ZencastMode;
  seed?: string;
}) {
  if (input.mode === "off") return input.items;

  const zencast = createZencast({
    seed: input.seed || "default",
    emotionalTone: "calm",
  });

  if (input.mode === "fallback") return [zencast];

  return input.items.flatMap((item, index) =>
    index === 2 ? [item, zencast] : [item],
  );
}

export function validateNoEmptyFeed(input: {
  items: any[];
  poolSize: number;
}) {
  const alive = checkFeedAliveness({
    poolSize: input.poolSize,
    freshPoolSize: input.items.length,
  });

  const blended = blendZencasts({
    items: input.items,
    mode: alive.zencastMode,
    seed: "seal",
  });

  return {
    ok: blended.length > 0,
    items: blended,
    zencastMode: alive.zencastMode,
  };
}

export function sealContentEngine() {
  return {
    complete: true,
    totalSteps: 60,
    totalPacks: 12,
    signalFirst: true,
    lumoraAligned: true,
    noEmptyFeed: true,
  };
}
