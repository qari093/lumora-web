export function injectEchoIntoFeed(feed: any[], echo: any) {
  if (!echo?.active) return feed;
  return [{ type: "echo", ...echo }, ...feed];
}
