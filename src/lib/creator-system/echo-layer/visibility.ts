export type EchoVisibilityPolicy = {
  showCounts: false;
  showComments: false;
  showLikes: false;
  showHumanSignals: true;
};

export function getEchoVisibilityPolicy(): EchoVisibilityPolicy {
  return {
    showCounts: false,
    showComments: false,
    showLikes: false,
    showHumanSignals: true,
  };
}
