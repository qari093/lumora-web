export function validateRealtimeCircleFlow(input: {
  session?: { live?: boolean };
  attendees?: unknown[];
  activeVideo?: unknown;
  signalCapture?: { enabled?: boolean };
}) {
  const ok = Boolean(
    input.session?.live === true &&
    Array.isArray(input.attendees) &&
    input.attendees.length > 0 &&
    input.activeVideo &&
    input.signalCapture?.enabled === true,
  );

  return {
    ok,
    reason: ok ? "realtime_circle_flow_valid" : "realtime_circle_flow_incomplete",
  };
}
