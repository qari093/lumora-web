export function recoverLiveStream(signal: { dropped: boolean; retryCount: number }) {
  return { recovered: signal.dropped ? signal.retryCount <= 3 : true, fallbackMode: signal.dropped && signal.retryCount > 3, resumeToken: "live-resume-token", safeReplay: true };
}
