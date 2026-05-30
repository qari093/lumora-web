"use client";

import { useActiveVideo } from "./useActiveVideo";
import { useVideoReady } from "./useVideoReady";
import { usePlaybackHealth } from "./usePlaybackHealth";
import { usePlaybackMetrics } from "./usePlaybackMetrics";
import { useVisibilityPause } from "./useVisibilityPause";

type Item = {
  id: string;
  title: string;
  playbackUrl: string;
  posterUrl: string;
};

export default function FypVideoCard({
  item,
  isActive,
  muted,
  lowPower,
  retry,
  onVideoError,
}: {
  item: Item;
  isActive: boolean;
  muted: boolean;
  lowPower: boolean;
  retry: {
    canRetry(): boolean;
    recordRetry(): void;
    resetRetry(): void;
  };
  onVideoError(): void;
}) {
  const ref = useActiveVideo(isActive);
  const { ready, onLoadedData } = useVideoReady();
  const { slow } = usePlaybackHealth(isActive, ready);

  usePlaybackMetrics(isActive ? item.id : undefined, ready);
  useVisibilityPause(isActive ? ref.current : null);

  return (
    <>
      <img
        src={item.posterUrl}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: ready ? 0 : 1,
          transition: "opacity 70ms ease",
        }}
      />

      {slow && isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background: "rgba(0,0,0,0.25)",
            fontSize: 13,
          }}
        >
          Loading stream…
        </div>
      )}

      <video
        ref={ref}
        src={isActive ? item.playbackUrl : undefined}
        poster={item.posterUrl}
        muted={muted}
        playsInline
        preload="metadata"
        autoPlay={isActive && !lowPower}
        loop
        onLoadedData={() => {
          retry.resetRetry();
          onLoadedData();
        }}
        onError={(e) => {
          if (!isActive) return;

          if (retry.canRetry()) {
            retry.recordRetry();
            const el = e.currentTarget;
            el.load();
            void el.play().catch(() => {});
            return;
          }

          retry.resetRetry();
          onVideoError();
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: ready ? 1 : 0,
          transition: "opacity 70ms ease",
        }}
      />
    </>
  );
}
