import "./BreathingDashboard.css";
import React from "react";
import type { BreathingDashboardModel, ConstellationOrbModel, WhisperModel } from "@/src/core/creator-alchemy/dashboard";

export interface BreathingDashboardProps {
  model: BreathingDashboardModel;
}

function Whisper({ whisper }: { whisper: WhisperModel | null }) {
  if (!whisper) {
    return (
      <section data-zone="whisper_panel" aria-label="Whisper Panel">
        <h2>Whisper</h2>
        <p>No whisper is needed today. Silence is part of the rhythm.</p>
      </section>
    );
  }

  return (
    <section data-zone="whisper_panel" aria-label="Whisper Panel">
      <h2>Whisper</h2>
      <p>{whisper.text}</p>
      {typeof whisper.timestampSeconds === "number" ? (
        <button type="button" aria-label={`Jump to ${whisper.timestampSeconds} seconds`}>
          Play moment
        </button>
      ) : null}
    </section>
  );
}

function ConstellationRiver({ orbs }: { orbs: ConstellationOrbModel[] }) {
  if (orbs.length === 0) return null;

  return (
    <section data-zone="constellation_river" aria-label="Constellation River">
      <h2>Constellation River</h2>
      <div role="list">
        {orbs.map((orb) => (
          <button
            key={orb.creatorId}
            type="button"
            role="listitem"
            aria-label={`${orb.displayName} in ${orb.constellation}${orb.pulse ? " has new activity" : ""}`}
          >
            {orb.isSelf ? "◎" : orb.pulse ? "✦" : "○"} {orb.displayName}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function BreathingDashboard({ model }: BreathingDashboardProps) {
  return (
    <main data-lumora="breathing-dashboard" data-stage={model.stage}>
      {model.atmosphere.visible ? (
        <section data-zone="atmosphere_bar" aria-label="Atmosphere Bar">
          <p>{model.atmosphere.text}</p>
        </section>
      ) : null}

      <section data-zone="living_seed" aria-label="Living Seed">
        <h2>Living Seed</h2>
        <p>{model.seed.label}</p>
        <p>{model.seed.log}</p>
      </section>

      <Whisper whisper={model.whisper} />

      <ConstellationRiver orbs={model.constellationOrbs} />

      <section data-zone="quiet_impact" aria-label="Quiet Impact Corner">
        <h2>Quiet Impact</h2>
        <p>{model.quietImpact.silentReturnsText}</p>
        <p>{model.quietImpact.quietGiftsText}</p>
        <p>{model.quietImpact.legacyEchoText}</p>
        <p>Resonance: {model.quietImpact.resonanceState.replaceAll("_", " ")}</p>
        <progress value={model.quietImpact.horizonProgress} max={1} aria-label="Resonance horizon" />
      </section>

      <button type="button" data-zone="breath_button" aria-label="Create content">
        ＋
      </button>
    </main>
  );
}
