export function viewerGravity(viewers: number) {
  return {
    momentum: viewers > 25
  };
}
