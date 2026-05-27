export type AnimationClip = {
  id: string;
  duration: number;
};

export function playAnimation(clip: AnimationClip) {
  return {
    playing: true,
    clip
  };
}
