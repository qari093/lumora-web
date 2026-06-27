"use client";

import { storyStars } from "@/src/core/lumaspace/story/runtime";
import StoryStar from "./StoryStar";

export default function StoryConstellation() {
  return (
    <section
      data-testid="lumaspace-story-constellation"
      aria-label="Your Story Constellation"
      style={{
        position: "relative",
        minHeight: 360,
        borderRadius: 34,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,.12)",
        background:
          "radial-gradient(circle at 50% 50%, rgba(34,211,238,.12), transparent 32%), radial-gradient(circle at 30% 70%, rgba(168,85,247,.14), transparent 36%), #02030a",
        color: "white"
      }}
    >
      <h2 style={{ position: "absolute", left: 22, top: 18, margin: 0, fontSize: 22 }}>
        Your Story
      </h2>

      <svg aria-hidden="true" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M50 18 L24 48 L36 76 L62 72 L74 45 Z" fill="none" stroke="rgba(103,232,249,.22)" strokeWidth="0.5" />
      </svg>

      {storyStars.map((star) => <StoryStar key={star.id} star={star} />)}
    </section>
  );
}
