export type CircleInteractionMode = {
  chatEnabled: false;
  commentsEnabled: false;
  witnessPromptEnabled: true;
  humanSignalsEnabled: true;
};

export function getCircleInteractionMode(): CircleInteractionMode {
  return {
    chatEnabled: false,
    commentsEnabled: false,
    witnessPromptEnabled: true,
    humanSignalsEnabled: true,
  };
}
