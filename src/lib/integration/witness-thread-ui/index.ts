export type Anchor = { id: string; createdAt: string };

export function attachAnchor(id: string, createdAt: string): Anchor {
  return { id, createdAt };
}

export function renderThread(anchors: Anchor[]) {
  return {
    visible: true,
    anchors: [...anchors].sort((a,b)=>a.createdAt.localeCompare(b.createdAt)),
    numericHidden: true,
  };
}

export function tone(n: number) {
  if (n >= 5) return "has been still with you often";
  if (n >= 2) return "has returned to your circle";
  return "a first quiet presence";
}

export function validate(t: any) {
  return { ok: t?.visible && Array.isArray(t?.anchors) && t.numericHidden };
}
