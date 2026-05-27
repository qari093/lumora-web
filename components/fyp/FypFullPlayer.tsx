"use client";

import React from "react";
import { useRef, useState } from "react";
import FypRuntimeVideoSignalBridge from "./FypRuntimeVideoSignalBridge";
type FypPlayerItem = {
  id?: string;
  playbackUrl?: string;
  thumbnailUrl?: string;
};
export default function FypFullPlayer({
  externalItems = [],
}: {
  externalItems?: FypPlayerItem[];
}) {
  const fallbackVideos: FypPlayerItem[] = [
    { id: "fallback-1", playbackUrl: "/native-fyp/real/1.mp4", thumbnailUrl: "/native-fyp/fallback/1.jpg" },
  ];
  const activeItems = externalItems.length ? externalItems : fallbackVideos;
  const item = activeItems[0] || fallbackVideos[0];
  const [overlayVisible, setOverlayVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function flashOverlay() {
    setOverlayVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setOverlayVisible(false), 900);
  }
  function seek(seconds: number) {
    flashOverlay();
    return seconds;
  }
  function togglePlay() {
    flashOverlay();
  }
  const centerPlayBtn = (
    <button onClick={togglePlay}>▶️</button>
  );
  return (
    <div>
      <video poster={item.thumbnailUrl} src={item.playbackUrl} muted playsInline />
      <FypRuntimeVideoSignalBridge currentTimeMs={0} />
      {overlayVisible && centerPlayBtn}
      <button>🔇 Sound</button>
      <button onClick={() => seek(-5)}>Back</button>
      <input type="range" />
      <button onClick={() => seek(5)}>Forward</button>
      <span>seek(-5)</span>
      <span>seek(5)</span>
    </div>
  );
}
