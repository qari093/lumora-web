"use client";

import { useMemo } from "react";

export default function LivingYouStar() {

  const particles = useMemo(
    () => Array.from({ length: 8 }, (_, i) => i),
    []
  );

  return (
    <div
      className="ls-you-wrapper"
      data-testid="ls-you-star"
    >

      <div className="ls-you-aura"></div>

      <div className="ls-you-core">
        YOU
      </div>

      <div className="ls-you-ripple"></div>

      {particles.map((p) => (
        <span
          key={p}
          className={`ls-you-particle p-${p}`}
        />
      ))}

    </div>
  );
}
