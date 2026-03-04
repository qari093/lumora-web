"use client";

import * as React from "react";
import { applyVibe } from "@/components/vibe/applyVibe";
import VibeTray, { type VibeTag } from "@/components/vibe/VibeTray";

const DEMO_TAGS: VibeTag[] = [
  { slug: "mind-blown", label: "Mind Blown", category: "AWE", intensity: 4, rarity: "CORE" },
  { slug: "tears", label: "Tears", category: "WARMTH", intensity: 4, rarity: "CORE" },
  { slug: "mood", label: "Mood", category: "INSIGHT", intensity: 3, rarity: "CORE" },
  { slug: "savage", label: "Savage", category: "ENERGY", intensity: 4, rarity: "CORE" },
  { slug: "take-it-back", label: "Take It Back", category: "ENERGY", intensity: 3, rarity: "CORE" },
  { slug: "woo", label: "Woo!", category: "ENERGY", intensity: 3, rarity: "CORE" },
  { slug: "art", label: "Art", category: "AWE", intensity: 3, rarity: "CORE" },
  { slug: "underrated", label: "Underrated", category: "INSIGHT", intensity: 3, rarity: "CORE" },
  { slug: "this-is-gold", label: "This Is Gold", category: "AWE", intensity: 4, rarity: "CORE" },
  { slug: "vibing", label: "Vibing", category: "WARMTH", intensity: 2, rarity: "CORE" },
];

export default function VibeDemoPage() {
  const [open, setOpen] = React.useState(false);
  const [applied, setApplied] = React.useState<string[]>([]);
  const [serverNote, setServerNote] = React.useState<string>("");

  return (
    <main style={{ padding: 18 }}>
      <h1 style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>Vibe Tags Lite — Demo</h1>

      <div
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.05)",
          padding: 14,
          position: "relative",
          overflow: "hidden",
          minHeight: 220,
        }}
      >
        <div style={{ opacity: 0.75, fontSize: 12, marginBottom: 10 }}>
          Demo “video card” (no real player yet).
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {applied.slice(-3).map((slug, i) => (
            <div
              key={`${slug}_${i}`}
              style={{
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.08)",
                padding: "6px 10px",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {DEMO_TAGS.find((t) => t.slug === slug)?.label ?? slug}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            position: "absolute",
            right: 14,
            bottom: 14,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.10)",
            padding: "10px 14px",
            fontSize: 12,
            fontWeight: 900,
            cursor: "pointer",
          }}
          aria-label="Add Vibe"
        >
          ✨ Add Vibe
        </button>
      </div>
      {serverNote ? (
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>API: {serverNote}</div>
      ) : null}

      <VibeTray
        open={open}
        onClose={() => setOpen(false)}
        tags={DEMO_TAGS}
        onPick={async (slug) => {
          // Demo wiring: simulate "watched 6s" and a fake video id.
          const userId = "me";
          const videoId = "demo_video_001";
          const watchMs = 6000;

          const out = await applyVibe({ userId, videoId, vibeSlug: slug, watchMs });
          if (out.ok) {
            setApplied((a) => a.concat([slug]));
            setServerNote(out.status === "duplicate_vibe" ? "Duplicate vibe (idempotent)." : "Vibe applied.");
          } else {
            setServerNote("Apply failed: " + out.error);
          }
          setOpen(false);
        }} />
    </main>
  );
}
