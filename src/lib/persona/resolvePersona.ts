const EMOTIONS = [
  "neutral",
  "happy",
  "sad",
  "angry",
  "surprised",
  "focused",
  "calm",
] as const;

export function resolveAvatar(
  personaCode: string,
  emotion: string
): string {
  const safeEmotion = EMOTIONS.includes(emotion as any)
    ? emotion
    : "neutral";

  return `/persona/avatars/${safeEmotion}/${personaCode}.png`;
}

export function resolveEmoji(reaction: string): string {
  return `/persona/emojis/${reaction}.png`;
}
