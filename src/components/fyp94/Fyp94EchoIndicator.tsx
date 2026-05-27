export function Fyp94EchoIndicator({ hasEcho }: { hasEcho?: boolean }) {
  return hasEcho ? <div data-testid="echo-indicator">✨ Echo Stored</div> : null;
}
