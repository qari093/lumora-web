export function eventCountdown(seconds: number) {
  return {
    seconds,
    urgent: seconds <= 60,
    ethical: true
  };
}
