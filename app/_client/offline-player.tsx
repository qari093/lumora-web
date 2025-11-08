"use client";
import React, {useEffect, useRef, useState} from "react";

type Props = { src: string; poster?: string };

export default function OfflinePlayer({ src, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady]   = useState(false);
  const [err, setErr]       = useState<string | null>(null);

  function canNativeHls(): boolean {
    const v = document.createElement("video");
    return !!v.canPlayType && v.canPlayType("application/vnd.apple.mpegurl") !== "";
  }

  useEffect(() => {
    let hls: any | null = null;
    let canceled = false;

    async function boot() {
      setErr(null);
      const el = videoRef.current;
      if (!el) return;

      try {
        if (canNativeHls()) {
          // Safari / iOS: native HLS
          el.src = src;
          await el.play().catch(() => {});
          setReady(true);
          return;
        }

        // Chrome/Edge/Firefox: use hls.js
        const mod = await import("hls.js");
        const Hls = (mod as any).default ?? mod;
        if (!Hls.isSupported()) {
          throw new Error("HLS not supported in this browser.");
        }

        hls = new Hls({
          // keep it tolerant for offline SW responses
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 30,
        });
        hls.on(Hls.Events.ERROR, (_ev: any, data: any) => {
          if (data?.fatal) setErr(String(data?.error || "fatal HLS error"));
        });
        hls.loadSource(src);
        hls.attachMedia(el);
        setReady(true);
      } catch (e: any) {
        setErr(String(e?.message || e));
      }
    }

    boot();
    return () => {
      canceled = true;
      try {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      } catch {}
    };
  }, [src]);

  return (
    <div style={{ width: "100%", maxWidth: 980 }}>
      <video
        ref={videoRef}
        controls
        playsInline
        poster={poster}
        style={{ width: "100%", background: "#000", borderRadius: 8 }}
      />
      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
        {ready ? "Player ready." : "Initializing player..."} {err ? " • Error: " + err : ""}
      </div>
    </div>
  );
}
