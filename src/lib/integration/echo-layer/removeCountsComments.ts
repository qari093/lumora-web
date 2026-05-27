export function removeEchoCountsComments(echo: any) {
  const { counts, comments, likes, views, ...safe } = echo || {};
  return {
    ...safe,
    countsHidden: true,
    commentsHidden: true,
  };
}
