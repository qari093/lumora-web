"use client";
import React from "react";
import { videoAction, videoImpression } from "@/lib/track";

type Props = { src: string; title?: string; videoId?: string; poster?: string };

export default function EmotionalCard({ src, title, videoId }: Props) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const sectionRef = React.useRef<HTMLDivElement | null>(null);

  // battery saver flag (set by the toggle button)
  const [batterySaver, setBatterySaver] = React.useState<boolean>(false);
  React.useEffect(() => {
    try {
      setBatterySaver(localStorage.getItem("lumora:batterySaver") === "1");
      const onStorage = (e: StorageEvent) => {
        if (e.key === "lumora:batterySaver") {
          setBatterySaver(e.newValue === "1");
        }
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    } catch {}
  }, []);

  // energy counter (persists per video)
  const key = React.useMemo(() => `lumora.energy.${videoId || src}`, [videoId, src]);
  const [energy, setEnergy] = React.useState<number>(() => {
    const v = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    const n = v ? parseInt(v, 10) : 0;
    return Number.isFinite(n) ? Math.max(0, Math.min(9999, n)) : 0;
  });
  React.useEffect(() => {
    try { localStorage.setItem(key, String(energy)); } catch {}
  }, [key, energy]);

  // autoplay/pause on visibility + impression ping
  React.useEffect(() => {
    const el = sectionRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      (ents) => {
        const onScreen = ents.some((e) => e.isIntersecting);
        if (onScreen) {
          v.play().catch(() => {});
          videoImpression(videoId, { src });
        } else {
          v.pause();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [videoId, src]);

  // energy ticking while playing
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let t: number | null = null;
    const tick = () => {
      setEnergy((e) => Math.min(9999, e + Math.max(1, Math.round(1 * v.playbackRate))));
      t = window.setTimeout(tick, 1000);
    };
    const onPlay = () => { if (t == null) tick(); videoAction(videoId, "play"); };
    const onPause = () => { if (t != null) { window.clearTimeout(t); t = null; } videoAction(videoId, "pause"); };
    const onEnded = () => { onPause(); videoAction(videoId, "ended"); };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    if (!v.paused) onPlay();
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      if (t != null) window.clearTimeout(t);
    };
  }, [videoId]);

  // actions
  const replay = React.useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    videoAction(videoId, "replay");
  }, [videoId]);

  const skip = React.useCallback(() => {
    // for now just pause & log; your feed pager will move to next item
    videoRef.current?.pause();
    videoAction(videoId, "skip");
  }, [videoId]);

  // like animation
  const [likedPulse, setLikedPulse] = React.useState(0);
  const like = React.useCallback(() => {
    setLikedPulse((n) => n + 1); // triggers CSS animation
    videoAction(videoId, "like");
  }, [videoId]);

  // keyboard shortcuts: L=like, R=replay, S=skip, Space=play/pause, ArrowUp/Down volume
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (!v) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (v.paused) v.play().catch(() => {}); else v.pause();
      } else if (e.key === "l" || e.key === "L") {
        like();
      } else if (e.key === "r" || e.key === "R") {
        replay();
      } else if (e.key === "s" || e.key === "S") {
        skip();
      } else if (e.key === "ArrowUp") {
        v.volume = Math.min(1, v.volume + 0.1);
      } else if (e.key === "ArrowDown") {
        v.volume = Math.max(0, v.volume - 0.1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [like, replay, skip]);

  return (
    <div
      ref={sectionRef}
      style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden", background: "#000" }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        playsInline
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* top-left labels */}
      <div style={{ position: "absolute", left: 12, top: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <span
          style={{
            padding: "3px 8px",
            borderRadius: 999,
            background: "rgba(20,200,120,0.25)",
            border: "1px solid rgba(100,255,200,0.35)",
            color: "#b6ffd8",
            fontSize: 12,
            fontWeight: 700,
            textShadow: "0 1px 6px rgba(0,0,0,.6)",
            userSelect: "none",
          }}
        >
          Enhanced <span style={{ marginLeft: 4 }}>🟢</span>
        </span>
        {title && (
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              textShadow: "0 2px 8px rgba(0,0,0,.6)",
              userSelect: "none",
            }}
          >
            {title}
          </span>
        )}
      </div>

      {/* action bar (right side) */}
      <div
        aria-label="Actions"
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 9999,
        }}
      >
        <IconButton label="Like (L)" onClick={like} batterySaver={batterySaver} kind="like" />
        <IconButton label="Replay (R)" onClick={replay} batterySaver={batterySaver} kind="replay" />
        <IconButton label="Skip (S)" onClick={skip} batterySaver={batterySaver} kind="skip" />
      </div>

      {/* energy pill */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 18,
          transform: "translateX(-50%)",
          padding: "8px 14px",
          borderRadius: 999,
          background: batterySaver
            ? "rgba(20,20,20,.75)"
            : "radial-gradient(65% 130% at 50% 50%, rgba(60,120,255,.25) 0%, rgba(20,20,30,.75) 60%, rgba(0,0,0,.85) 100%)",
          border: "1px solid rgba(255,255,255,.2)",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: 0.2,
          boxShadow: batterySaver
            ? "none"
            : "0 0 18px rgba(90,140,255,.25), inset 0 0 24px rgba(60,120,255,.18)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          animation: batterySaver ? "none" : "lumora-breathe 3s ease-in-out infinite",
          userSelect: "none",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: batterySaver ? "rgba(180,180,180,1)" : "rgba(120,200,255,1)",
            boxShadow: batterySaver ? "none" : "0 0 14px rgba(120,200,255,.9)",
            filter: batterySaver ? "none" : "saturate(130%)",
          }}
        />
        Energy: {energy}
      </div>

      {/* floating heart on like */}
      {!batterySaver && likedPulse > 0 && (
        <div
          key={likedPulse}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
            fontSize: 64,
            filter: "drop-shadow(0 6px 16px rgba(0,0,0,.5))",
            animation: "heart-pop 900ms ease-out forwards",
          }}
        >
          ❤️
        </div>
      )}

      {/* keyframes */}
      <style jsx>{`
        @keyframes lumora-breathe {
          0% {
            transform: translateX(-50%) scale(0.98);
            box-shadow: 0 0 16px rgba(90, 140, 255, 0.2), inset 0 0 20px rgba(60, 120, 255, 0.14);
          }
          50% {
            transform: translateX(-50%) scale(1.02);
            box-shadow: 0 0 28px rgba(90, 140, 255, 0.35), inset 0 0 26px rgba(60, 120, 255, 0.22);
          }
          100% {
            transform: translateX(-50%) scale(0.98);
            box-shadow: 0 0 16px rgba(90, 140, 255, 0.2), inset 0 0 20px rgba(60, 120, 255, 0.14);
          }
        }
        @keyframes heart-pop {
          0% {
            transform: translate(-50%, -50%) scale(0.4);
            opacity: 0;
          }
          40% {
            transform: translate(-50%, -60%) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -80%) scale(0.9);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  batterySaver,
  kind,
}: {
  label: string;
  onClick: () => void;
  batterySaver: boolean;
  kind: "like" | "replay" | "skip";
}) {
  const base = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "10px 12px",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    userSelect: "none" as const,
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };

  const bg =
    kind === "like"
      ? batterySaver
        ? "rgba(130,0,40,0.45)"
        : "linear-gradient(180deg, rgba(255,70,120,.35), rgba(120,0,40,.35))"
      : kind === "replay"
      ? batterySaver
        ? "rgba(0,60,120,0.45)"
        : "linear-gradient(180deg, rgba(90,150,255,.35), rgba(0,40,110,.35))"
      : // skip
        batterySaver
        ? "rgba(80,80,80,0.45)"
        : "linear-gradient(180deg, rgba(180,180,180,.35), rgba(40,40,40,.35))";

  const emoji = kind === "like" ? "❤️" : kind === "replay" ? "🔁" : "⏭️";

  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        ...base,
        background: bg,
        display: "flex",
        alignItems: "center",
        gap: 8,
        minWidth: 90,
        justifyContent: "center",
        boxShadow: batterySaver ? "none" : "0 8px 24px rgba(0,0,0,.35)",
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}