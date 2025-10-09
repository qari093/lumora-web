export type TrackPayload = {
  type: string;
  userId?: string;
  roomId?: string;
  path?: string;
  meta?: any;
  ts?: number;
};

export function track(ev: TrackPayload) {
  try {
    const payload = JSON.stringify({ ...ev, ts: ev.ts ?? Date.now(), path: ev.path ?? (typeof location!=="undefined"?location.pathname:undefined) });
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/stream", blob);
    } else {
      fetch("/api/analytics/stream", { method: "POST", headers: { "Content-Type":"application/json" }, body: payload });
    }
  } catch {}
}
