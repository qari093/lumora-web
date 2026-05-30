"use client";

import { useEffect, useState } from "react";
import { useSwipe } from "./useSwipe";
import { usePreload } from "./usePreload";
import { useNetworkMode } from "./useNetworkMode";
import { handleVideoError } from "./useFailureSkip";
import { useGlobalMute } from "./useGlobalMute";
import { useDwellTracker } from "./useDwellTracker";
import { useSwipeIntent } from "./useSwipeIntent";
import { useNativeFypKeyboard } from "./useNativeFypKeyboard";
import FypOverlay from "./FypOverlay";
import FypVideoCard from "./FypVideoCard";
import { usePlaybackRetry } from "./usePlaybackRetry";
import { usePlaybackWarmup } from "./usePlaybackWarmup";
import { useLowPowerMode } from "./useLowPowerMode";

type Item = {
  id: string;
  title: string;
  playbackUrl: string;
  posterUrl: string;
};

export default function FypSwiper({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);
  const { muted, toggle } = useGlobalMute();
  const retry = usePlaybackRetry(2);
  const mode = useNetworkMode();
  const lowPower = useLowPowerMode();

  const goNext = () => setIndex(i => Math.min(i + 1, items.length - 1));
  const goPrev = () => setIndex(i => Math.max(i - 1, 0));

  useNativeFypKeyboard({ onNext: goNext, onPrev: goPrev, onMuteToggle: toggle });

  const current = items[index];
  const prev = items[index - 1];
  const next = items[index + 1];

  usePreload(next?.playbackUrl, mode);
  usePlaybackWarmup(next?.playbackUrl, next?.posterUrl);

  useDwellTracker(current?.id, (id, ms) => {
    void fetch("/api/fyp/native-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "dwell", id, ms }),
    }).catch(() => {});
  });

  const { onPointerDown, onPointerMove, resetIntent } = useSwipeIntent((direction) => {
    if (direction === "up") usePreload(next?.playbackUrl, mode);
    if (direction === "down") usePreload(prev?.playbackUrl, mode);
  });

  const { onTouchStart, onTouchEnd } = useSwipe(
    goNext,
    goPrev
  );

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (e.deltaY > 0) goNext();
      if (e.deltaY < 0) goPrev();
    };
    window.addEventListener("wheel", handler);
    return () => window.removeEventListener("wheel", handler);
  }, [index, items.length]);

  return (
    <div
      onClick={toggle}
      style={{ height: "100vh", overflow: "hidden", position: "relative", background: "#000" }}
      onPointerDown={(e) => onPointerDown(e.clientY)}
      onPointerMove={(e) => onPointerMove(e.clientY)}
      onPointerUp={resetIntent}
      onPointerCancel={resetIntent}
      onTouchStart={onTouchStart as any}
      onTouchEnd={onTouchEnd as any}
    >
      {[prev, current, next].map((v, i) => {
        if (!v) return null;

        const pos = i - 1;
        const isActive = pos === 0;

        return (
          <div
            key={v.id}
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate3d(0, ${pos * 100}%, 0)`,
              transition: "transform 90ms ease-out",
              overflow: "hidden",
            }}
          >
            <FypVideoCard
              item={v}
              isActive={isActive}
              muted={muted}
              lowPower={lowPower}
              retry={retry}
              onVideoError={() => handleVideoError(index, items.length, setIndex)}
            />
          </div>
        );
      })}

      {current && (
        <FypOverlay
          title={current.title}
          index={index}
          total={items.length}
          muted={muted}
        />
      )}
    </div>
  );
}
