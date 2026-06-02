export type GravityAnimationResult = {
  springEnabled: boolean;
  collapseEnabled: boolean;
};

export function computeGravityAnimation(): GravityAnimationResult {
  return {
    springEnabled: true,
    collapseEnabled: true,
  };
}
