export function recommendationClarity(reason: string) {
  return {
    reason,
    visible: reason.length > 0
  };
}
