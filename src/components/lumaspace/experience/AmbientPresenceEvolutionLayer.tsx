"use client";

import "@/src/styles/lumaspace/ambient-presence-evolution-f3.css";

const people = [
  "wonder",
  "dream",
  "creator",
  "shadow",
  "gaming",
  "calm"
] as const;

export default function AmbientPresenceEvolutionLayer() {
  return (
    <div className="ls-f3-presence-field" data-testid="ls-f3-presence-field" aria-hidden="true">
      {people.map((id) => (
        <span key={id} className={`ls-f3-presence ${id}`}>
          <span className="ls-f3-trace" />
          <span className="ls-f3-orb" />
          <span className="ls-f3-echo a" />
          <span className="ls-f3-echo b" />
        </span>
      ))}
    </div>
  );
}
