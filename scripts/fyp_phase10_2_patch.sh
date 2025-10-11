#!/usr/bin/env bash
set -euo pipefail
mkdir -p src/hooks src/components/fyp

# 1) Watch tracker hook
cat > src/hooks/useWatchTracker.ts <<EOF_WATCH
import { useEffect, useRef } from "react";

type Opt = { videoRef: React.RefObject<HTMLVideoElement>; videoId: string; };

/** Aggregates watch time and POSTs to /api/fyp/learn periodically. */
export function useWatchTracker({ videoRef, videoId }: Opt){
  const accMs = useRef(0);
  const last = useRef<number | null>(null);
  const likeFlag = useRef(false);
  const skipFlag = useRef(false);
  const flushing = useRef(false);

  useEffect(()=>{
    const v = videoRef.current;
    if(!v) return;

    const onTick = () => {
      const now = performance.now();
      if(last.current!=null) accMs.current += now - last.current;
      last.current = now;
    };
    const onPlay = () => { last.current = performance.now(); };
    const onPause = () => { last.current = null; };
    const onEnded = () => { skipFlag.current = false; void flush(); };

    async function flush(){
      if(flushing.current) return;
      flushing.current = true;
      try{
        const ms = Math.round(accMs.current);
        accMs.current = 0;
        if(ms>0){
          await fetch("/api/fyp/learn",{
            method:"POST",
            headers:{ "content-type":"application/json" },
            body: JSON.stringify({ videoId, watchMs: ms, liked: likeFlag.current, skipped: skipFlag.current })
          });
        }
      }catch{} finally{
        likeFlag.current = false;
        skipFlag.current = false;
        flushing.current = false;
      }
    }

    const tickInt = setInterval(onTick, 250);
    const flushInt = setInterval(()=>void flush(), 900);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);

    return ()=>{
      clearInterval(tickInt);
      clearInterval(flushInt);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      if(accMs.current>0) void flush();
    };
  }, [videoRef, videoId]);

  return {
    markLike(){ likeFlag.current = true; },
    markSkip(){ skipFlag.current = true; },
  };
}
EOF_WATCH

# 2) EmotionalCard with tracker + sound toggle + audio ring
cat > src/components/fyp/EmotionalCard.tsx <<EOF_CARD
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHaptics } from "@/hooks/useHaptics";
import { useAudioLevel } from "@/hooks/useAudioLevel";
import { useWatchTracker } from "@/hooks/useWatchTracker";

type Props = {
  src: string;
  poster?: string;
  title?: string;
  videoId?: string;
  onLike?: () => void;
};

export default function EmotionalCard({ src, poster, title, videoId, onLike }: Props) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const { tap, success } = useHaptics();
  const { markLike } = useWatchTracker({ videoRef: vidRef, videoId: videoId || title || src });
  const level = useAudioLevel(vidRef);

  // Micro parallax
  const wrapRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const calc = (x: number, y: number) => ({
        x: ((x - cx) / rect.width) * 8,
        y: ((y - cy) / rect.height) * 8,
      });
      if (e instanceof TouchEvent) {
        const t = e.touches[0] || e.changedTouches[0];
        setParallax(calc(t.clientX, t.clientY));
      } else {
        const m = e as MouseEvent;
        setParallax(calc(m.clientX, m.clientY));
      }
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onMove);
    };
  }, []);

  // Audio-reactive ring
  const ring = useMemo(() => {
    const intensity = Math.min(1, level * 3.5);
    const px = 8 + intensity * 22;
    const opacity = 0.35 + intensity * 0.45;
    return { px, opacity };
  }, [level]);

  const [liked, setLiked] = useState(false);
  const onLikeClick = () => {
    setLiked(v => !v);
    markLike();
    onLike?.();
    success();
  };

  const toggleSound = () => {
    const v = vidRef.current;
    if (!v) return;
    const next = !muted;
    setMuted(next);
    try {
      v.muted = next;
      if (!next) void v.play();
    } catch {}
    tap();
  };

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "linear-gradient(180deg, var(--fyp-bg-start), var(--fyp-bg-end))",
        touchAction: "manipulation",
      }}
    >
      <video
        ref={vidRef}
        src={src}
        poster={poster}
        autoPlay
        muted={muted}
        playsInline
        loop
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: ,
          transition: "transform 120ms ease-out, opacity 240ms ease",
          willChange: "transform",
          filter: "brightness(0.96) contrast(1.02)",
        }}
        onPlay={() => tap()}
      />

      {title && (
        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 90,
            color: "rgba(255,255,255,0.93)",
            fontWeight: 700,
            fontSize: 18,
            textShadow: "0 2px 12px rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
          }}
        >
          {title}
        </div>
      )}

      {/* Volume toggle */}
      <button
        onClick={toggleSound}
        aria-label="Toggle sound"
        style={{
          position: "absolute",
          top: 14,
          right: 12,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(15,15,20,0.55)",
          backdropFilter: "blur(6px)",
          color: "white",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Right rail */}
      <div style={{ position: "absolute", right: 12, bottom: 90, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <button
          onClick={onLikeClick}
          aria-label="Like"
          style={{
            position: "relative",
            width: 52, height: 52,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            background: liked ? "radial-gradient(circle, rgba(255,70,120,0.9), rgba(255,70,120,0.4))" : "rgba(15,15,20,0.55)",
            backdropFilter: "blur(6px)",
            cursor: "pointer",
            boxShadow: ,
            transition: "box-shadow 80ms linear, transform 80ms ease",
          }}
          onPointerDown={() => tap()}
        >
          <span style={{ fontSize: 20, color: "white", userSelect: "none" }}>❤</span>
        </button>
        <button onPointerDown={() => tap()} aria-label="Comment"
          style={railBtnStyle}>💬</button>
        <button onPointerDown={() => tap()} aria-label="Share"
          style={railBtnStyle}>↗️</button>
      </div>

      {/* Energy bar hint */}
      <div style={{
        position: "absolute",
        left: 12, bottom: 24, right: 12,
        height: 8, borderRadius: 8,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        <div style={{
          width: "35%",
          height: "100%",
          background: "linear-gradient(90deg, var(--fyp-accent), rgba(255,255,255,0.6))",
          filter: "saturate(1.2)",
          boxShadow: "0 0 16px var(--fyp-accent)",
        }} />
      </div>
    </div>
  );
}

const railBtnStyle: React.CSSProperties = {
  width: 48, height: 48,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(15,15,20,0.55)",
  backdropFilter: "blur(6px)",
  cursor: "pointer",
  color: "white",
  fontSize: 18,
  display: "grid",
  placeItems: "center",
};
EOF_CARD

# 3) Restart Next and show tail
pkill -f "next dev" >/dev/null 2>&1 || true
( [ -x ./node_modules/.bin/next ] && ./node_modules/.bin/next dev || npx next dev ) >/tmp/next-dev.out 2>&1 & disown
sleep 7
tail -n 40 /tmp/next-dev.out || true

echo; echo "✅ Tracker + sound toggle wired. Open: http://localhost:3000/fyp"
