export type Anim = "beat" | "tears" | "bounce" | "shake" | "shine" | "float" | "prism" | "zap";
export type Emoji = { emoji: string; label: string; keywords: string[]; anim?: Anim };
export type Category = { id: string; name: string; color: string; emojis: Emoji[] };

export const EMOJI_CATEGORIES: Category[] = [
  {
    id: "faces",
    name: "Faces",
    color: "#ff6b6b",
    emojis: [
      { emoji: "😀", label: "grinning", keywords: ["smile", "happy", "joy"] },
      { emoji: "😂", label: "tears of joy", keywords: ["laugh", "funny"], anim: "bounce" },
      { emoji: "😍", label: "love", keywords: ["heart", "adore"], anim: "shine" },
      { emoji: "😎", label: "cool", keywords: ["sunglasses", "confident"], anim: "shine" },
      { emoji: "🤔", label: "thinking", keywords: ["ponder", "question"] },
      { emoji: "😭", label: "crying", keywords: ["sad", "tears"], anim: "tears" },
      { emoji: "😡", label: "angry", keywords: ["mad", "annoyed"], anim: "shake" },
      { emoji: "🥳", label: "party", keywords: ["celebrate", "yay"], anim: "bounce" },
      { emoji: "😴", label: "sleep", keywords: ["tired", "zzz"], anim: "float" },
      { emoji: "🤩", label: "starstruck", keywords: ["wow", "amazed"], anim: "shine" },
      { emoji: "🥺", label: "pleading", keywords: ["cute", "please"] },
      { emoji: "🤯", label: "mind blown", keywords: ["shock", "boom"], anim: "zap" },
      { emoji: "😮", label: "open mouth", keywords: ["surprised", "wow"], anim: "zap" },
      { emoji: "🙂", label: "slight smile", keywords: ["soft", "calm"], anim: "prism" },
    ],
  },
  {
    id: "hearts",
    name: "Hearts",
    color: "#ff8ff3",
    emojis: [
      { emoji: "❤️", label: "red heart", keywords: ["love", "romance"], anim: "beat" },
      { emoji: "🧡", label: "orange heart", keywords: ["friendship"], anim: "beat" },
      { emoji: "💛", label: "yellow heart", keywords: ["happiness"], anim: "beat" },
      { emoji: "💚", label: "green heart", keywords: ["nature", "envy"], anim: "beat" },
      { emoji: "💙", label: "blue heart", keywords: ["trust", "calm"], anim: "beat" },
      { emoji: "💜", label: "purple heart", keywords: ["compassion"], anim: "beat" },
      { emoji: "🖤", label: "black heart", keywords: ["dark", "goth"], anim: "beat" },
      { emoji: "🤍", label: "white heart", keywords: ["pure"], anim: "beat" },
      { emoji: "🤎", label: "brown heart", keywords: ["earth"], anim: "beat" },
      { emoji: "💖", label: "sparkling heart", keywords: ["glow", "love"], anim: "shine" },
    ],
  },
  {
    id: "hands",
    name: "Gestures",
    color: "#ffd36b",
    emojis: [
      { emoji: "👍", label: "thumbs up", keywords: ["yes", "approve"], anim: "bounce" },
      { emoji: "👎", label: "thumbs down", keywords: ["no", "disapprove"], anim: "bounce" },
      { emoji: "👏", label: "clapping", keywords: ["applause", "praise"], anim: "bounce" },
      { emoji: "🙏", label: "pray", keywords: ["thanks", "hope"], anim: "prism" },
      { emoji: "🤝", label: "handshake", keywords: ["agreement", "deal"] },
      { emoji: "🤌", label: "pinched", keywords: ["small", "perfect"] },
      { emoji: "🤙", label: "call me", keywords: ["phone", "hang loose"] },
      { emoji: "✋", label: "raised hand", keywords: ["stop", "hi"] },
      { emoji: "👋", label: "wave", keywords: ["hello", "goodbye"], anim: "shake" },
      { emoji: "✌️", label: "victory", keywords: ["peace", "two"], anim: "shine" },
    ],
  },
];

export function animForEmojiDefault(
  e: Emoji,
  mood: string | null,
  moodMap?: Record<string, Anim[]>
): Anim {
  switch (e.emoji) {
    case "❤️": return "beat";
    case "😂": return "bounce";
    case "😭": return "tears";
    case "😡": return "shake";
    case "😎": return "shine";
    case "😴": return "float";
  }
  if (mood && moodMap?.[mood]?.length) return moodMap[mood][0];
  return e.anim || "shine";
}