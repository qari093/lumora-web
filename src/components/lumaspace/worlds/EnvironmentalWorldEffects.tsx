"use client";

import { EnvironmentalWorlds } from "@/src/core/lumaspace/worlds/environmentalWorlds";
import "@/src/styles/lumaspace/environmental-worlds.css";

export default function EnvironmentalWorldEffects() {
  return (
    <div
      className="ls-environment-worlds"
      data-testid="ls-environment-worlds"
      aria-hidden="true"
    >
      {EnvironmentalWorlds.map(world => (
        <div
          key={world.id}
          className={`ls-env-world ${world.id}`}
          data-world={world.id}
        >
          <span className="ls-env-atmosphere" />
          <span className="ls-env-particles" />
        </div>
      ))}
    </div>
  );
}
