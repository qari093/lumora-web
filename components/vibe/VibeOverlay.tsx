'use client';

import * as React from "react";
import VibeTray from "@/components/vibe/VibeTray";

export type VibeOverlayProps = {
  enabled: boolean;
  userId?: string;
  videoId?: string;
};

export default function VibeOverlay({ enabled, userId, videoId }: VibeOverlayProps) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const lastAtRef = React.useRef<number>(0);
  const cooldownMs = 3000;

  if (!enabled) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Add Vibe"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "absolute",
          right: 12,
          bottom: 84,
          width: 44,
          height: 44,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(10px)",
          pointerEvents: "auto",
        }}
      >
        ✨
      </button>

      <VibeTray
        open={open}

        onClose={() => setOpen(false)}
        onPick={async (slug: string) => {
          const now = Date.now();
          if (now - lastAtRef.current < cooldownMs) return;
          lastAtRef.current = now;

          setBusy(true);
          try {
            await fetch("/api/vibe/apply", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                // TODO: wire real auth/session userId + actual currently playing videoId
                userId: userId || "me",
                videoId: videoId || "unknown",
                vibeSlug: slug,
                watchMs: 6000, // TODO: wire true watch time
              }),
            });
          } catch {
            // ignore
          } finally {
            setBusy(false);
            setOpen(false);
          }
        }}
      />
    </>
  );
}
