export interface FypFallbackFailureWindow {
  failures: number;
  windowSeconds: number;
}

export function shouldTriggerFallbackExhaustionAlert(
  input: FypFallbackFailureWindow
): boolean {
  return input.windowSeconds <= 60 && input.failures >= 5;
}
