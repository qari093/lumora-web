export type PersonaEmotion =
  | "neutral"
  | "happy"
  | "sad"
  | "angry"
  | "surprised"
  | "focused"
  | "calm";

export type PersonaReaction =
  | "love" | "laugh" | "wow" | "proud" | "calm" | "focus" | "spark" | "fire" | "ice"
  | "clap" | "salute" | "think" | "cry" | "rage" | "blush" | "wink" | "wave" | "yes"
  | "no" | "maybe" | "star" | "zen" | "aura" | "glitch" | "hype" | "coffee" | "sleep"
  | "joy" | "chill" | "shock" | "grin" | "sigh" | "snap" | "pulse" | "boom" | "soft"
  | "bold" | "sparkle" | "flow" | "steady";

export type ReactionWeight = { reaction: PersonaReaction; weight: number };

export const REACTION_LIST: readonly PersonaReaction[] = [
  "love","laugh","wow","proud","calm","focus","spark","fire","ice","clap","salute",
  "think","cry","rage","blush","wink","wave","yes","no","maybe","star","zen","aura",
  "glitch","hype","coffee","sleep","joy","chill","shock","grin","sigh","snap",
  "pulse","boom","soft","bold","sparkle","flow","steady",
] as const;

export const COLOR_VARIANTS: readonly string[] =
  ["01","02","03","04","05","06","07","08","09","10","11","12"] as const;

export function reactionCode(reaction: PersonaReaction, variant: string) {
  const v = String(variant).padStart(2, "0");
  return `rx_${reaction}_${v}`;
}

export const REACTION_MATRIX: Record<PersonaEmotion, readonly ReactionWeight[]> = {
  neutral: [
    { reaction: "zen", weight: 7 },
    { reaction: "steady", weight: 7 },
    { reaction: "calm", weight: 6 },
    { reaction: "soft", weight: 5 },
    { reaction: "flow", weight: 5 },
    { reaction: "think", weight: 4 },
    { reaction: "aura", weight: 4 },
    { reaction: "maybe", weight: 3 },
    { reaction: "star", weight: 2 },
    { reaction: "wave", weight: 2 },
  ],
  happy: [
    { reaction: "joy", weight: 8 },
    { reaction: "love", weight: 7 },
    { reaction: "laugh", weight: 7 },
    { reaction: "grin", weight: 6 },
    { reaction: "clap", weight: 5 },
    { reaction: "sparkle", weight: 5 },
    { reaction: "proud", weight: 4 },
    { reaction: "wink", weight: 3 },
    { reaction: "yes", weight: 3 },
    { reaction: "star", weight: 2 },
  ],
  sad: [
    { reaction: "cry", weight: 8 },
    { reaction: "sigh", weight: 7 },
    { reaction: "soft", weight: 6 },
    { reaction: "calm", weight: 5 },
    { reaction: "zen", weight: 5 },
    { reaction: "chill", weight: 4 },
    { reaction: "sleep", weight: 4 },
    { reaction: "think", weight: 3 },
    { reaction: "aura", weight: 2 },
    { reaction: "maybe", weight: 2 },
  ],
  angry: [
    { reaction: "rage", weight: 8 },
    { reaction: "fire", weight: 7 },
    { reaction: "bold", weight: 6 },
    { reaction: "boom", weight: 6 },
    { reaction: "snap", weight: 5 },
    { reaction: "pulse", weight: 5 },
    { reaction: "no", weight: 4 },
    { reaction: "glitch", weight: 3 },
    { reaction: "think", weight: 2 },
    { reaction: "ice", weight: 2 },
  ],
  surprised: [
    { reaction: "wow", weight: 8 },
    { reaction: "shock", weight: 7 },
    { reaction: "spark", weight: 6 },
    { reaction: "sparkle", weight: 5 },
    { reaction: "snap", weight: 4 },
    { reaction: "pulse", weight: 4 },
    { reaction: "hype", weight: 4 },
    { reaction: "star", weight: 3 },
    { reaction: "grin", weight: 2 },
    { reaction: "maybe", weight: 2 },
  ],
  focused: [
    { reaction: "focus", weight: 9 },
    { reaction: "steady", weight: 7 },
    { reaction: "flow", weight: 7 },
    { reaction: "think", weight: 6 },
    { reaction: "coffee", weight: 5 },
    { reaction: "pulse", weight: 4 },
    { reaction: "bold", weight: 3 },
    { reaction: "zen", weight: 3 },
    { reaction: "yes", weight: 2 },
    { reaction: "spark", weight: 2 },
  ],
  calm: [
    { reaction: "calm", weight: 9 },
    { reaction: "zen", weight: 8 },
    { reaction: "soft", weight: 7 },
    { reaction: "flow", weight: 6 },
    { reaction: "steady", weight: 6 },
    { reaction: "aura", weight: 5 },
    { reaction: "chill", weight: 4 },
    { reaction: "ice", weight: 3 },
    { reaction: "sleep", weight: 3 },
    { reaction: "think", weight: 2 },
  ],
} as const;

/* ───────────────────────────────────────────── */
/* 🎤 VOICE → REACTION BRIDGE (NEW, SAFE)         */
/* ───────────────────────────────────────────── */

export type VoiceToReactionResult = { reaction: PersonaReaction; intensity: number };
export function voiceToReaction(params: {
  isSpeaking: boolean;
  volume: number;
  emotionHint?: PersonaEmotion | null;
}): VoiceToReactionResult {
  if (!params.isSpeaking) return { reaction: "steady", intensity: 0 };
  if (params.volume > 0.75) return { reaction: "hype", intensity: 0.9 };
  if (params.emotionHint) {
    const map: Record<PersonaEmotion, PersonaReaction> = {
      neutral: "steady", happy: "joy", sad: "sigh", angry: "rage", surprised: "wow", focused: "focus", calm: "calm"
    };
    return { reaction: map[params.emotionHint], intensity: 0.7 };
  }
  return { reaction: "pulse", intensity: Math.min(1, params.volume + 0.2) };
}

/* ───────────────────────────────────────────── */

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickWeighted<T extends string>(
  items: readonly { value: T; weight: number }[],
  seed: string
): T {
  const h = xmur3(seed)();
  const rnd = mulberry32(h)();
  const total = items.reduce((s, it) => s + Math.max(0, it.weight), 0);
  if (total <= 0) return items[0]!.value;
  let r = rnd * total;
  for (const it of items) {
    r -= Math.max(0, it.weight);
    if (r <= 0) return it.value;
  }
  return items[items.length - 1]!.value;
}

export function pickReaction(
  emotion: PersonaEmotion,
  seed: string
): PersonaReaction {
  const list = REACTION_MATRIX[emotion];
  const items = list.map((x) => ({
    value: x.reaction,
    weight: x.weight,
  }));

  return pickWeighted(items, `emotion:${emotion}|${seed}`);
}

export function pickReactionVariant(seed: string): string {
  const idx = Math.floor(
    mulberry32(xmur3(`variant:${seed}`)())() * COLOR_VARIANTS.length
  );
  return COLOR_VARIANTS[Math.max(0, Math.min(COLOR_VARIANTS.length - 1, idx))]!;
}