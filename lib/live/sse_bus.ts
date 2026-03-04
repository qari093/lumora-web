type Listener = (line: string) => void;

const listeners = new Set<Listener>();

export function liveListenerCount(): number {
  return listeners.size;
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function publish(obj: any) {
  const line = `data: ${JSON.stringify(obj)}\n\n`;
  for (const fn of Array.from(listeners)) {
    try { fn(line); } catch {}
  }
}
