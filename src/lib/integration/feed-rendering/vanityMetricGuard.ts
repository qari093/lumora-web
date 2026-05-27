export function stripVanityMetricsFromFyp(item: any) {
  const { views, likes, comments, followers, ...safe } = item || {};
  return {
    ...safe,
    vanityMetricsHidden: true,
  };
}
