"use client";

import { LivingWorldIdentities } from "@/src/core/lumaspace/experience/livingWorldIdentities";
import "@/src/styles/lumaspace/living-world-identities-f2.css";

export default function LivingWorldIdentitiesLayer() {
  return (
    <div
      className="ls-f2-world-identities"
      data-testid="ls-f2-world-identities"
      aria-hidden="true"
    >
      {LivingWorldIdentities.worlds.map((world) => (
        <div
          key={world.id}
          className={`ls-f2-world ${world.id}`}
          data-world={world.id}
          data-atmosphere={world.atmosphere}
        >
          <span className="ls-f2-world-glass" />
          <span className="ls-f2-world-particles p1" />
          <span className="ls-f2-world-particles p2" />
          <span className="ls-f2-world-particles p3" />
          <span className="ls-f2-world-aura" />
        </div>
      ))}
    </div>
  );
}
