"use client";

import React from "react";
import { useEffect, useRef } from "react";
import FypRuntimeVideoSignalBridge from "./FypRuntimeVideoSignalBridge";
export default function FypVideoCard() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentTimeMs = Math.round((videoRef.current?.currentTime || 0) * 1000);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    function timeupdate() {
      return video?.currentTime || 0;
    }
    video.addEventListener("timeupdate", timeupdate);
    return () => video.removeEventListener("timeupdate", timeupdate);
  }, []);
  return (
    <article>
      <video ref={videoRef} />
      <FypRuntimeVideoSignalBridge currentTimeMs={currentTimeMs} />
      FypVideoCard
    </article>
  );
}
