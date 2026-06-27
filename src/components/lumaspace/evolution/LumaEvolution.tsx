"use client";

import {
  getNextQuest,
  getQuestProgress,
  getReactionLabel,
  identityQuests,
  reactionStars
} from "@/src/core/lumaspace/evolution/runtime";

export default function LumaEvolution() {
  const nextQuest = getNextQuest();

  return (
    <section data-testid="lumaspace-evolution" style={{ display: "grid", gap: 18, color: "white" }}>
      <div
        data-testid="lumaspace-identity-quests"
        style={{
          borderRadius: 32,
          border: "1px solid rgba(255,255,255,.12)",
          background: "radial-gradient(circle at 30% 20%, rgba(251,191,36,.14), transparent 36%), rgba(255,255,255,.045)",
          padding: 18
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22 }}>Explorer Path</h2>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.64)", fontSize: 13 }}>
          Golden Aura awakens through real journeys.
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {identityQuests.map((quest) => {
            const progress = getQuestProgress(quest);
            return (
              <div key={quest.id} data-quest-id={quest.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                  <span>{quest.title}</span>
                  <span style={{ color: "rgba(103,232,249,.82)" }}>{quest.reward}</span>
                </div>
                <div
                  aria-label={`${quest.title} progress`}
                  style={{
                    marginTop: 8,
                    height: 8,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: "rgba(255,255,255,.10)"
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, rgba(34,211,238,.82), rgba(251,191,36,.76))",
                      boxShadow: "0 0 18px rgba(34,211,238,.32)"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,.58)" }}>
          Next: {nextQuest ? nextQuest.reward : "All current paths awakened"}
        </div>
      </div>

      <div
        data-testid="lumaspace-reaction-galaxy"
        style={{
          position: "relative",
          minHeight: 330,
          borderRadius: 34,
          overflow: "hidden",
          border: "1px solid rgba(103,232,249,.18)",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,.10), transparent 16%), radial-gradient(circle at 50% 45%, rgba(34,211,238,.14), transparent 38%), radial-gradient(circle at 25% 80%, rgba(168,85,247,.14), transparent 38%), #02030a"
        }}
      >
        <h2 style={{ position: "absolute", left: 20, top: 18, margin: 0, fontSize: 22 }}>
          Reaction Galaxy
        </h2>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "52%",
            width: 62,
            height: 62,
            transform: "translate(-50%, -50%)",
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(255,255,255,.95), rgba(34,211,238,.30))",
            boxShadow: "0 0 42px rgba(34,211,238,.42)"
          }}
        />

        {reactionStars.map((reaction) => (
          <button
            key={reaction.id}
            type="button"
            data-reaction-kind={reaction.kind}
            aria-label={`${reaction.from} left ${getReactionLabel(reaction.kind)}`}
            style={{
              position: "absolute",
              left: `${reaction.x}%`,
              top: `${reaction.y}%`,
              width: 18,
              height: 18,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.38)",
              background: "radial-gradient(circle, rgba(255,255,255,.96), rgba(103,232,249,.62), rgba(168,85,247,.20))",
              boxShadow: "0 0 26px rgba(103,232,249,.42)",
              transform: "translate(-50%, -50%)"
            }}
            title={`${reaction.from} · ${getReactionLabel(reaction.kind)}`}
          />
        ))}
      </div>
    </section>
  );
}
