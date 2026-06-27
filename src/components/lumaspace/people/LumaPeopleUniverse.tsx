"use client";

import {
  createWorldRipple,
  getSharedWorldsForCircle,
  lumaCircles,
  sharedWorlds
} from "@/src/core/lumaspace/people/runtime";

export default function LumaPeopleUniverse() {
  const ripple = createWorldRipple("Ayesha", "calm");
  const closestWorlds = getSharedWorldsForCircle("closest");

  return (
    <section
      data-testid="lumaspace-people-universe"
      style={{
        display: "grid",
        gap: 18,
        color: "white"
      }}
    >
      <div
        data-testid="lumaspace-circles"
        style={{
          borderRadius: 32,
          border: "1px solid rgba(255,255,255,.12)",
          background:
            "radial-gradient(circle at 50% 20%, rgba(34,211,238,.12), transparent 36%), rgba(255,255,255,.045)",
          padding: 18
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22 }}>Your People</h2>
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {lumaCircles.map((circle) => (
            <div
              key={circle.id}
              data-circle-id={circle.id}
              style={{
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,.10)",
                background: "rgba(2,3,10,.36)",
                padding: 14
              }}
            >
              <strong>{circle.name}</strong>
              <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,.62)", fontSize: 13 }}>
                {circle.members.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        data-testid="lumaspace-shared-worlds"
        style={{
          position: "relative",
          minHeight: 310,
          borderRadius: 34,
          overflow: "hidden",
          border: "1px solid rgba(103,232,249,.18)",
          background:
            "radial-gradient(circle at 50% 50%, rgba(34,211,238,.13), transparent 35%), radial-gradient(circle at 25% 75%, rgba(168,85,247,.16), transparent 40%), #02030a",
          padding: 18
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22 }}>Shared Worlds</h2>

        {sharedWorlds.map((world, index) => (
          <div
            key={world.id}
            data-shared-world-id={world.id}
            style={{
              position: "absolute",
              left: index === 0 ? "24%" : "66%",
              top: index === 0 ? "52%" : "62%",
              transform: "translate(-50%, -50%)",
              width: 142,
              borderRadius: 28,
              border: "1px solid rgba(255,255,255,.15)",
              background: "linear-gradient(135deg, rgba(34,211,238,.14), rgba(168,85,247,.12))",
              padding: 14,
              boxShadow: "0 0 34px rgba(34,211,238,.18)"
            }}
          >
            <strong style={{ fontSize: 14 }}>{world.title}</strong>
            <p style={{ margin: "7px 0 0", color: "rgba(255,255,255,.62)", fontSize: 11 }}>
              {world.memories.join(" · ")}
            </p>
          </div>
        ))}

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "55%",
            width: 58,
            height: 58,
            transform: "translate(-50%, -50%)",
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(255,255,255,.9), rgba(34,211,238,.28))",
            boxShadow: "0 0 36px rgba(34,211,238,.34)"
          }}
        />
      </div>

      <div
        data-testid="lumaspace-world-ripple"
        style={{
          borderRadius: 28,
          border: "1px solid rgba(147,197,253,.22)",
          background: "linear-gradient(135deg, rgba(147,197,253,.12), rgba(34,211,238,.08))",
          padding: 18
        }}
      >
        <strong>World Ripple</strong>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.66)" }}>
          {ripple.message}
        </p>
      </div>

      <div
        data-testid="lumaspace-orbit-drop"
        style={{
          borderRadius: 28,
          border: "1px solid rgba(251,191,36,.22)",
          background: "linear-gradient(135deg, rgba(251,191,36,.12), rgba(168,85,247,.10))",
          padding: 18
        }}
      >
        <strong>Orbit Drop</strong>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.66)" }}>
          {closestWorlds.length} shared discovery path unlocked with your Closest Circle.
        </p>
      </div>
    </section>
  );
}
