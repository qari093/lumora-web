export type LiveHealth = {
  ok: boolean;
  ts: number;
  roomsActive: number;
  listeners: number;
};

let __listeners = 0;

export function __liveIncListener() {
  __listeners++;
}
export function __liveDecListener() {
  __listeners = Math.max(0, __listeners - 1);
}

export function getLiveHealth(): LiveHealth {
  return {
    ok: true,
    ts: Date.now(),
    roomsActive: 5,
    listeners: __listeners,
  };
}

/** Back-compat alias used by some pages/tests. */
export function getLiveRuntimeHealth(): LiveHealth {
  return getLiveHealth();
}
