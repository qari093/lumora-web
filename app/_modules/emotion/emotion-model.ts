// LOCATION: app/_modules/emotion/emotion-model.ts
// PURPOSE: Unified types + helpers to fuse Avatars + Emoji Expressions (Lumora Emotion v1.0)

"use client";

const __emotionState: EmotionState = { activeAvatarId: null, mood: null, prompt: "" };

/* ────────────────────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────────────────── */

export type Mood =
  | "joy"
  | "love"
  | "sad"
  | "angry"
  | "cool"
  | "sleep"
  | "surprise"
  | "calm"
  | "focus";

export type Anim =
  | "beat"     // ❤️ heart beat
  | "bounce"   // 😂 hop/bounce
  | "tears"    // 😭 tear drip
  | "shake"    // 😡 shake/vibrate
  | "shine"    // 😎 gloss/shine
  | "float"    // 😴 gentle float
  | "twinkle"  // ✨ twinkle
  | "zap"      // ⚡ zap
  | "prism"    // 🌈 prism sweep
  | "flicker"  // 🔥 flicker
  | "stamp";   // 💯 stamp pop

export type MediaType = "avatar" | "emoji";

export interface EmotionMedia {
  id: string;
  name: string;            // avatar display name OR emoji label
  type: MediaType;
  mood: Mood;
  animation: Anim;
  colors: string[];        // accent/glow palette
  glow?: boolean;
  sound?: string;          // optional future: sfx key
  emojiChar?: string;      // for emojis only
  imageUrl?: string;       // for avatars (optional)
  accent?: string;         // ring color (avatars)
}

/* ────────────────────────────────────────────────────────────────────────────
   Canonical mood → default animation map
   (UI can override per-emoji/per-avatar if desired)
──────────────────────────────────────────────────────────────────────────── */

export const MOOD_ANIM_DEFAULT: Record<Mood, Anim> = {
  joy: "bounce",
  love: "beat",
  sad: "tears",
  angry: "shake",
  cool: "shine",
  sleep: "float",
  surprise: "twinkle",
  calm: "float",
  focus: "prism",
};

/* ────────────────────────────────────────────────────────────────────────────
   Emoji → animation presets (quick resolver)
   Keys may be the emoji itself or a normalized label.
   Extend freely as you add more.
──────────────────────────────────────────────────────────────────────────── */

export const EMOJI_ANIM_PRESETS: Record<string, Anim> = {
  // hearts
  "❤️": "beat",
  "🧡": "beat",
  "💛": "beat",
  "💚": "beat",
  "💙": "beat",
  "💜": "beat",
  "🖤": "beat",
  "🤍": "beat",
  "🤎": "beat",

  // faces
  "😀": "bounce",
  "😄": "bounce",
  "😂": "bounce",
  "😍": "beat",
  "😎": "shine",
  "🤔": "stamp",
  "😭": "tears",
  "😡": "shake",
  "🥳": "twinkle",
  "😴": "float",
  "😲": "twinkle",

  // quick reactions
  "✨": "twinkle",
  "⚡": "zap",
  "⚡️": "zap",
  "🌈": "prism",
  "🔥": "flicker",
  "💯": "stamp",
  "⭐": "twinkle",
  "⭐️": "twinkle",
  "💫": "twinkle",
};

export function getAnimForEmoji(emojiChar: string, fallbackMood?: Mood): Anim {
  if (EMOJI_ANIM_PRESETS[emojiChar]) return EMOJI_ANIM_PRESETS[emojiChar];
  if (fallbackMood && MOOD_ANIM_DEFAULT[fallbackMood]) {
    return MOOD_ANIM_DEFAULT[fallbackMood];
  }
  return "bounce";
}

/* ────────────────────────────────────────────────────────────────────────────
   Sample AVATARS (kept in sync with your AvatarBar)
──────────────────────────────────────────────────────────────────────────── */

export const AVATARS: EmotionMedia[] = [
  {
    id: "ava-1",
    name: "Naya Noor",
    type: "avatar",
    mood: "joy",
    animation: MOOD_ANIM_DEFAULT.joy,
    colors: ["#00f3ff", "#c0ffee", "#ffffff"],
    glow: true,
    accent: "#00f3ff",
  },
  {
    id: "ava-2",
    name: "Zayn",
    type: "avatar",
    mood: "calm",
    animation: MOOD_ANIM_DEFAULT.calm,
    colors: ["#00ff9d", "#b4ffe3", "#e8fff7"],
    glow: true,
    accent: "#00ff9d",
  },
  {
    id: "ava-3",
    name: "Isha",
    type: "avatar",
    mood: "love",
    animation: MOOD_ANIM_DEFAULT.love,
    colors: ["#ff00c8", "#ff7ae6", "#ffe6f8"],
    glow: true,
    accent: "#ff00c8",
  },
  {
    id: "ava-4",
    name: "Rafi",
    type: "avatar",
    mood: "angry",
    animation: MOOD_ANIM_DEFAULT.angry,
    colors: ["#ff6b6b", "#ffd1d1", "#fff5f5"],
    glow: false,
    accent: "#ff6b6b",
  },
  {
    id: "ava-5",
    name: "Arooj",
    type: "avatar",
    mood: "focus",
    animation: MOOD_ANIM_DEFAULT.focus,
    colors: ["#f59e0b", "#ffe4b3", "#fff7e6"],
    glow: true,
    accent: "#f59e0b",
  },
];

/* ────────────────────────────────────────────────────────────────────────────
   Minimal EMOJI set (to demonstrate the bridge)
   (Your HoloPanel can map its full catalog into this shape when needed.)
──────────────────────────────────────────────────────────────────────────── */

export const EMOJI_DEMO: EmotionMedia[] = [
  { id: "e-joy", name: "happy", type: "emoji", mood: "joy", animation: "bounce", colors: ["#fff"], emojiChar: "😀" },
  { id: "e-laugh", name: "tears", type: "emoji", mood: "joy", animation: "bounce", colors: ["#fff"], emojiChar: "😂" },
  { id: "e-love", name: "heart", type: "emoji", mood: "love", animation: "beat", colors: ["#fff"], emojiChar: "❤️" },
  { id: "e-cry", name: "cry", type: "emoji", mood: "sad", animation: "tears", colors: ["#fff"], emojiChar: "😭" },
  { id: "e-angry", name: "angry", type: "emoji", mood: "angry", animation: "shake", colors: ["#fff"], emojiChar: "😡" },
  { id: "e-cool", name: "cool", type: "emoji", mood: "cool", animation: "shine", colors: ["#fff"], emojiChar: "😎" },
  { id: "e-sleep", name: "sleep", type: "emoji", mood: "sleep", animation: "float", colors: ["#fff"], emojiChar: "😴" },
];

/* ────────────────────────────────────────────────────────────────────────────
   Event bridge (emoji → avatar, avatar → emoji)
   Usage:
     emitMood("love")
     onMood(m => console.log(m))
──────────────────────────────────────────────────────────────────────────── */

export const EMOJI_MOOD_EVENT = "lumora:emoji-mood";
export type MoodEventDetail = { mood: Mood; source?: MediaType; via?: string };

export function emitMood(mood: Mood, source: MediaType = "emoji", via?: string) {
  if (typeof window === "undefined") return;
  const ev = new CustomEvent<MoodEventDetail>(EMOJI_MOOD_EVENT, { detail: { mood, source, via } });
  window.dispatchEvent(ev);
}

export function onMood(handler: (mood: Mood, detail: MoodEventDetail) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => {
    const ce = e as CustomEvent<MoodEventDetail>;
    if (ce?.detail?.mood) handler(ce.detail.mood, ce.detail);
  };
  window.addEventListener(EMOJI_MOOD_EVENT, listener);
  return () => window.removeEventListener(EMOJI_MOOD_EVENT, listener);
}

/* ────────────────────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────────────────── */

export function moodFromEmoji(emojiChar: string): Mood {
  // quick heuristic fallbacks
  if ("❤️🧡💛💚💙💜🖤🤍🤎".includes(emojiChar)) return "love";
  if ("😀😄😂".includes(emojiChar)) return "joy";
  if ("😭".includes(emojiChar)) return "sad";
  if ("😡".includes(emojiChar)) return "angry";
  if ("😴".includes(emojiChar)) return "sleep";
  if ("😎".includes(emojiChar)) return "cool";
  if ("😲".includes(emojiChar)) return "surprise";
  return "focus";
}

export function toAnimClass(anim: Anim): string {
  // Map to CSS class names your panel already understands
  // (ensure your panel’s CSS has matching rules e.g. .anim-beat, .anim-tears, etc.)
  return `anim-${anim}`;
}
/* ──────────────────────────────────────────────
   Event & Emotion Bridge (v1 Completion)
────────────────────────────────────────────── */
type EmotionListener = (ev:any)=>void;
const _listeners = new Set<EmotionListener>();

type Listener = (s: EmotionState, ev: EmotionEvent) => void;
const __listeners = new Set<Listener>();

export function emit(ev: EmotionEvent){
  for(const fn of __listeners){ try{ fn(__emotionState, ev); } catch(_){} }
}

export function subscribe(fn: Listener){
  __listeners.add(fn);
  return () => __listeners.delete(fn);
}

export function getState(){ return __emotionState; }

export function selectAvatar(id: string | null){
  __emotionState.activeAvatarId = id;
  emit({ type: "avatar", id });
}

export function setMood(mood: Mood | null){
  __emotionState.mood = mood;
  emit({ type: "mood", mood });
}

export function setPrompt(prompt: string){
  __emotionState.prompt = prompt;
  emit({ type: "prompt", prompt });
}

export const moodAnimations: Record<Mood, Anim[]> = {
  joy: ["bounce","shine"],
  love: ["beat","twinkle"],
  sad: ["tears","float"],
  angry: ["shake","zap"],
  cool: ["shine","prism"],
  sleep: ["float"],
  surprise: ["zap","twinkle"],
  calm: ["float","prism"],
  focus: ["prism","shine"],
};

export function getAnimationsForMood(mood: Mood): Anim[] {
  return moodAnimations[mood] || [];
}

export function deriveQueryFromState(s: EmotionState = __emotionState): string {
  if (s.prompt && s.prompt.trim()) return s.prompt.trim();
  return s.mood ?? "";
}

export function resetEmotion(){
  __emotionState.activeAvatarId = null;
  __emotionState.mood = null;
  __emotionState.prompt = "";
  emit({ type: "reset" });
}
