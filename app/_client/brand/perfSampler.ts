"use client";

type SampleResult = {
  avgFrameMs: number | null;
  p95FrameMs: number | null;
  longFrames: number | null;
  memUsedMB: number | null;
};

function percentile(arr: number[], p: number): number {
  if (!arr.length) return 0;
  const a = arr.slice().sort((x,y)=>x-y);
  const idx = Math.min(a.length - 1, Math.max(0, Math.floor((p/100) * a.length)));
  return a[idx];
}

export function sampleFrames(durationMs: number): Promise<SampleResult> {
  return new Promise((resolve) => {
    const frames: number[] = [];
    let last = performance.now();
    let raf: number | null = null;

    const endAt = performance.now() + durationMs;

    const tick = () => {
      const now = performance.now();
      frames.push(now - last);
      last = now;
      if (now >= endAt) {
        if (raf) cancelAnimationFrame(raf);
        const avg = frames.length ? frames.reduce((a,b)=>a+b,0)/frames.length : null;
        const p95 = frames.length ? percentile(frames, 95) : null;
        const longFrames = frames.length ? frames.filter(f => f > 22).length : null; // > ~45fps threshold
        const memUsedMB =
          (performance as any)?.memory?.usedJSHeapSize
            ? Math.round(((performance as any).memory.usedJSHeapSize / (1024*1024))*10)/10
            : null;

        resolve({
          avgFrameMs: avg ? Math.round(avg*10)/10 : null,
          p95FrameMs: p95 ? Math.round(p95*10)/10 : null,
          longFrames,
          memUsedMB
        });
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
  });
}
