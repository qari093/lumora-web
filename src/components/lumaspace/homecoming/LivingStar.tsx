"use client";

export default function LivingStar({
  expanded = false,
}: {
  expanded?: boolean;
}) {
  return (
    <div
      data-testid="lumaspace-living-star"
      aria-hidden="true"
      style={{
        position: "relative",
        width: expanded ? 140 : 18,
        height: expanded ? 140 : 18,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(103,232,249,.96) 35%, rgba(34,211,238,.55) 58%, rgba(15,23,42,.08) 100%)",
        boxShadow:
          "0 0 24px rgba(255,255,255,.88), 0 0 72px rgba(103,232,249,.62), 0 0 128px rgba(168,85,247,.26)",
        transform: "translateZ(0)",
        transition:
          "width 1400ms cubic-bezier(.2,.8,.2,1), height 1400ms cubic-bezier(.2,.8,.2,1), box-shadow 1400ms ease",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-16px",
          borderRadius: "50%",
          border: "1px solid rgba(103,232,249,.34)",
          opacity: expanded ? 0.7 : 0.35,
          transform: expanded ? "scale(1.08)" : "scale(.8)",
          transition: "all 1400ms ease",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-38px",
          borderRadius: "50%",
          border: "1px solid rgba(168,85,247,.18)",
          opacity: expanded ? 0.45 : 0.18,
          transform: expanded ? "scale(1.16)" : "scale(.65)",
          transition: "all 1400ms ease",
        }}
      />
    </div>
  );
}
