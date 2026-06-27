"use client";

import "@/src/styles/lumaspace/living-universe-composer.css";

const worlds = [
  { id: "dream", glyph: "✦", label: "Dream" },
  { id: "wonder", glyph: "◈", label: "Wonder" },
  { id: "creator", glyph: "⬡", label: "Creator" },
  { id: "shadow", glyph: "◐", label: "Shadow" },
  { id: "gaming", glyph: "◉", label: "Gaming" },
  { id: "calm", glyph: "❋", label: "Calm" }
];

export default function LivingUniverseComposer() {
  return (
    <section className="ls-composer" data-testid="ls-living-universe-composer">
      <div className="ls-composer-orbit" aria-hidden="true" />

      <div className="ls-composer-you" data-testid="ls-composer-you">
        <span>YOU</span>
      </div>

      {worlds.map((world) => (
        <button
          key={world.id}
          type="button"
          className={`ls-composer-world ${world.id}`}
          data-world={world.id}
          aria-label={`${world.label} world`}
        >
          <span className="ls-composer-glyph">{world.glyph}</span>
          <span className="ls-composer-label">{world.label}</span>
        </button>
      ))}
    </section>
  );
}
