export function detectBot(actionsPerMinute: number) {
  return actionsPerMinute > 300;
}
