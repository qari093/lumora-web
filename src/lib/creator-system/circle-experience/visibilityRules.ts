export type CircleVisibilityConfig = {
  showFollowers: false;
  showViews: false;
  showLikes: false;
  showComments: false;
  showHumanSignals: true;
};

export function getCircleVisibilityConfig(): CircleVisibilityConfig {
  return {
    showFollowers: false,
    showViews: false,
    showLikes: false,
    showComments: false,
    showHumanSignals: true,
  };
}
