"use client";

import { PresenceConstellations } from "@/src/core/lumaspace/presence/presenceConstellations";
import "@/src/styles/lumaspace/presence-constellations.css";

export default function PresenceConstellationField() {
  return (
    <div
      className="ls-presence-constellation-field"
      data-testid="ls-presence-constellation-field"
      aria-hidden="true"
    >
      {PresenceConstellations.people.map((person) => (
        <div
          key={person.id}
          className={`ls-presence-star ${person.world} ${person.aura}`}
          data-person={person.id}
          data-world={person.world}
        >
          <span className="ls-presence-trace" />
          <span className="ls-presence-core" />
          <span className="ls-presence-name">{person.id}</span>
        </div>
      ))}
    </div>
  );
}
