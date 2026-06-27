"use client";

import "@/src/styles/lumaspace/interaction-motion-field.css";

export default function InteractionMotionField() {
  return (
    <div
      className="ls-interaction-motion-field"
      data-testid="ls-interaction-motion-field"
      aria-hidden="true"
    >
      <span className="ls-motion-current c1" />
      <span className="ls-motion-current c2" />
      <span className="ls-motion-current c3" />
      <span className="ls-motion-current c4" />
      <span className="ls-motion-current c5" />
      <span className="ls-motion-current c6" />
    </div>
  );
}
