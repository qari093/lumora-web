"use client";

import {
  getSovereigntyPromise,
  sovereigntyItems
} from "@/src/core/lumaspace/sovereignty/runtime";

export default function LumaSovereignty() {
  return (
    <section
      data-testid="lumaspace-sovereignty"
      style={{
        display: "grid",
        gap: 16,
        color: "white",
        borderRadius: 34,
        border: "1px solid rgba(255,255,255,.12)",
        background:
          "radial-gradient(circle at 50% 0%, rgba(34,211,238,.14), transparent 34%), radial-gradient(circle at 20% 80%, rgba(168,85,247,.14), transparent 38%), rgba(255,255,255,.04)",
        padding: 20
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: ".24em", color: "rgba(103,232,249,.82)" }}>
        DATA SOVEREIGNTY
      </div>

      <h2 style={{ margin: 0, fontSize: 26, letterSpacing: "-.04em" }}>
        Your universe belongs to you.
      </h2>

      <p style={{ margin: 0, color: "rgba(255,255,255,.66)", lineHeight: 1.5 }}>
        {getSovereigntyPromise()}
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {sovereigntyItems.map((item) => (
          <article
            key={item.action}
            data-sovereignty-action={item.action}
            style={{
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,.10)",
              background: "rgba(2,3,10,.42)",
              padding: 14
            }}
          >
            <strong>{item.title}</strong>
            <p style={{ margin: "7px 0 0", color: "rgba(255,255,255,.62)", fontSize: 13 }}>
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
