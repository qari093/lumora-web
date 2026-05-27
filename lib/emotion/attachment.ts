export type EmotionAttachment = {
  emotion: string;
  intensity: number;
};

export function attachEmotion(
  emotion: string,
  intensity = 1
): EmotionAttachment {
  return {
    emotion,
    intensity
  };
}

export default {
  attachEmotion
};
