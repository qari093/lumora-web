"use client";

import {
  computeAssistedPortalReveal,
  computeAssistedReturnAffordance,
  getGravityAssistedActivation,
  type GravityAssistedDecision,
} from "@/src/core/gravity-core";

type GravityAssistedPortalRevealProps = {
  decision?: GravityAssistedDecision | null;
};

export default function GravityAssistedPortalReveal({ decision = null }: GravityAssistedPortalRevealProps) {
  const activation = getGravityAssistedActivation(
    typeof process !== "undefined" ? process.env : {},
  );

  const safeDecision: GravityAssistedDecision =
    decision ?? {
      integrated: true,
      enabled: activation.enabled,
      stage: activation.enabled ? "observing" : "disabled",
      canRevealPortal: false,
      canSuggestReturn: false,
      canNavigate: false,
      confidence: 0,
      reason: activation.reason,
    };

  const reveal = computeAssistedPortalReveal(safeDecision);
  const affordance = computeAssistedReturnAffordance(reveal);

  return (
    <div
      aria-hidden="true"
      data-gravity-assisted-portal-reveal="true"
      data-assisted-enabled={reveal.enabled ? "true" : "false"}
      data-navigation-enabled="false"
      className="pointer-events-none fixed inset-0 z-[37]"
    >
      <div
        className="absolute left-1/2 bottom-8 h-24 w-24 -translate-x-1/2 rounded-full border border-cyan-200/50 bg-cyan-200/5"
        style={{
          opacity: reveal.revealOpacity,
          transform: `translateX(-50%) scale(${reveal.revealScale})`,
          transition: "opacity 180ms ease-out, transform 180ms ease-out",
        }}
      />
      <div
        className="absolute left-1/2 bottom-36 -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] text-white/80 backdrop-blur-md"
        style={{
          opacity: affordance.visible ? 1 : 0,
          transition: "opacity 160ms ease-out",
        }}
      >
        {affordance.text}
      </div>
    </div>
  );
}
