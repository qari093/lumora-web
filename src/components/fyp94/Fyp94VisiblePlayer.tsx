"use client";

import { useEffect, useMemo, useState } from "react";
import { Fyp94Overlay } from "./Fyp94Overlay";
import { Fyp94WaveIndicator } from "./Fyp94WaveIndicator";
import { Fyp94CrowdIndicator } from "./Fyp94CrowdIndicator";
import { Fyp94SwerveControls } from "./Fyp94SwerveControls";

export type Fyp94VisibleItem = {
  id: string;
  title: string;
  category: string;
  playbackUrl: string;
  posterUrl: string;
  thrillScore: number;
};

export function Fyp94VisiblePlayer({ items }: { items: Fyp94VisibleItem[] }) {
  const [index, setIndex] = useState(0);
  const [loadingError, setLoadingError] = useState(false);

  const current = items[index];

  const nextItem = items[index + 1];
  useEffect(() => {
    if (!nextItem) return;
    const v = document.createElement("video");
    v.src = nextItem.playbackUrl;
    v.preload = "auto";
  }, [index]);


  const nextIndex = useMemo(() => Math.min(index + 1, Math.max(items.length - 1, 0)), [index, items.length]);
  const prevIndex = useMemo(() => Math.max(index - 1, 0), [index]);

  if (!current) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#05060a", color: "#fff" }}>
        FYP94 loading…
      </main>
    );
  }

  return (
    <main
      data-testid="fyp94-visible-player"
      style={{
        minHeight: "100vh",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background: "#05060a",
        color: "#fff",
        position: "relative",
        touchAction: "none",
      }}
      onWheel={(event) => {
        if (event.deltaY > 0) setIndex(nextIndex);
        if (event.deltaY < 0) setIndex(prevIndex);
      }}
    >
      <video
        key={current.id + "-" + index}
        data-testid="fyp94-video"
        src={current.playbackUrl}
        poster={current.posterUrl}
        muted
        playsInline
        autoPlay
        loop
        onError={() => setLoadingError(true)}
        onLoadedData={() => setLoadingError(false)}
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "translate3d(0,0,0)",
          background: "#000",
        }}
      />

      <Fyp94Overlay>
        <div style={{ padding: 16, display: "flex", gap: 8, alignItems: "center" }}>
          <Fyp94WaveIndicator active={current.thrillScore >= 85} />
          <Fyp94CrowdIndicator label={`${100 + index * 7} watching now`} />
        </div>

        <div style={{ padding: 20, pointerEvents: "auto" }}>
          <div style={{ opacity: 0.72, fontSize: 12 }}>FYP 9.4 · {index + 1}/{items.length} · DEBUG_INDEX:{index}</div>
          <h1 style={{ margin: "6px 0 4px", fontSize: 22, lineHeight: 1.1 }}>{current.title}</h1>
          <div style={{ opacity: 0.8, fontSize: 13 }}>{current.category} · Thrill {current.thrillScore}</div>

          {loadingError && (
            <div style={{ marginTop: 10, fontSize: 13, color: "#ffd166" }}>
              Loading next pulse…
            </div>
          )}

          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <button onClick={() => setIndex(prevIndex)} style={{ padding: "10px 14px" }}>Prev</button>
            <button onClick={() => setIndex(nextIndex)} style={{ padding: "10px 14px" }}>Next</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <Fyp94SwerveControls
              onMore={() => undefined}
              onDifferent={() => undefined}
              onSwitch={() => setIndex(nextIndex)}
            />
          </div>
        </div>
      </Fyp94Overlay>
    </main>
  );
}
