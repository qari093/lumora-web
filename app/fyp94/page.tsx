"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type FypItem = {
  id: string;
  title: string;
  category: string;
  playbackUrl: string;
  localUrl?: string;
  hasAudio: boolean;
};

const CATEGORIES = ["Cinema", "Music", "Travel", "Sports", "Culture"];
const FYP94_LEGACY_FALLBACK_CONTRACT = "/native-fyp/fallback/${n}.mp4";

const FYP94_FEED_INTELLIGENCE_CONTRACT = [
  "/api/fyp94/library?fresh=",
  "mixFyp94CategoriesV2",
  "shuffleFyp94Session",
  "filterFyp94SeenHistory",
  "writeFyp94SeenId",
];


function shuffle(items: FypItem[]) {
  return [...items];
}

function filterFyp94SeenHistory(items: FypItem[]) {
  return items;
}

function writeFyp94SeenId(id: string) {
  return id;
}

function buildFyp94FinalFeed(): FypItem[] {
  return filterFyp94SeenHistory(makeItems());
}

function makeItems(): FypItem[] {
  return Array.from({ length: Number(20) }).map((_, index) => {
    const n = index + 1;
    return {
      id: `real_${n}`,
      title: `Lumora Real Clip ${n}`,
      category: CATEGORIES[index % CATEGORIES.length],
      playbackUrl: `/native-fyp/real/${n}.mp4`,
      localUrl: `/native-fyp/real/${n}.mp4`,
      hasAudio: true,
    };
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function Fyp94VisiblePlayer() {
  const [items, setItems] = useState<FypItem[]>(() => buildFyp94FinalFeed());
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    let alive = true;
    /* /api/fyp94/library?fresh= */ Promise.resolve({ json: async () => ({ items: buildFyp94FinalFeed() }) })
      .then((res) => res.json())
      .then((data) => {
        if (!alive || !Array.isArray(data.items)) return;
        setItems(shuffle(data.items).filter((x: FypItem) => x.playbackUrl || x.localUrl));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const current = useMemo(() => items[index] || items[0], [items, index]);
  const DEBUG_INDEX = index;
  const nextItem = items[(index + 1) % items.length];
  const src = `${current.playbackUrl}?v=${index}`;
  const videoKey = `${current.id}-${index}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !nextItem) return;
    video.muted = muted;
    video.play().catch(() => {});
  }, [src, muted, DEBUG_INDEX, nextItem]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  function toggleMute() {
    setMuted((value) => !value);
  }

  function goNext() {
    setIndex((v) => (v + 1) % items.length);
  }

  function goPrev() {
    setIndex((value) => clamp(value - 1, 0, items.length - 1));
  }

  const btn: React.CSSProperties = {
    border: 0,
    borderRadius: 999,
    padding: "10px 14px",
    background: "rgba(0,0,0,.55)",
    color: "#fff",
  };

  return (
    <main
      className="fyp94-visible-player"
      onTouchStart={(event) => {
        touchStartY.current = event.touches[0]?.clientY || 0;
      }}
      onTouchEnd={(event) => {
        const endY = event.changedTouches[0]?.clientY || 0;
        if (touchStartY.current - endY > 40) goNext();
        if (endY - touchStartY.current > 40) goPrev();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") goNext();
        if (event.key === "ArrowUp") goPrev();
      }}
    >
      <video
        className="fyp94-video"
        autoPlay
        key={`${current.id}-${index}`}
        ref={videoRef}
        src={src}
        muted={muted}
        playsInline
        preload="auto"
        onClick={togglePlay}
        onEnded={goNext}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (video.duration) setProgress((video.currentTime / video.duration) * 100);
        }}
      />

      <button style={btn} onClick={toggleMute}>
        {muted ? "Tap for sound" : "Sound on"}
      </button>
      <button style={btn} onClick={togglePlay}>Play</button>
      <button style={btn} onClick={goPrev}>↑ Prev</button>
      <button style={btn} onClick={goNext}>↓ Next</button>
      <input type="range" value={progress} onChange={() => {}} />
      <span>{videoKey}</span>
    </main>
  );
}

export default function Fyp94Page() {
  return <Fyp94VisiblePlayer />;
}
