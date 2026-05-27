export function moderationState(flagged: boolean) {
  return {
    reviewRequired: flagged
  };
}
