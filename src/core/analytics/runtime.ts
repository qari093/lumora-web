export function trackEvent(name: string) {
  return {
    tracked: true,
    event: name,
  };
}
