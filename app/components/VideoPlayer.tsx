"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

type Props = {
  playbackIdOrUrl: string; // either full hls url or CF playbackId
  poster?: string | null;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
};

function toHlsUrl(playbackIdOrUrl: string) {
  // If it's already a URL, return as-is. Otherwise treat as Cloudflare Stream playbackId
  if (/^https?:\/\//i.test(playbackIdOrUrl)) return playbackIdOrUrl;
  return `https://videodelivery.net/${playbackIdOrUrl}/manifest/video.m3u8`;
}

export default function VideoPlayer({
  playbackIdOrUrl,
  poster,
  className,
  autoPlay,
  controls = true,
  muted,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const url = toHlsUrl(playbackIdOrUrl);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safari / iOS have native HLS
    const canNative = video.canPlayType("application/vnd.apple.mpegurl");
    if (canNative) {
      video.src = url;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      return () => {
        hls.destroy();
      };
    } else {
      // last fallback: assign URL (most browsers won't play without hls.js)
      video.src = url;
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      poster={poster ?? undefined}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      playsInline
    />
  );
}
