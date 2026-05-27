export type FypEvent =
  | { type: "view"; id: string; duration: number }
  | { type: "skip"; id: string }
  | { type: "stash"; id: string };

export function createEvent(e: FypEvent) {
  return { ...e, ts: Date.now() };
}
