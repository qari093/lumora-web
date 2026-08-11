"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import clsx from "clsx";

// Emotion model (state + helpers)
import {
  subscribe,
  getState,
  setPrompt,
  setMood,
  getAnimationsForMood,
  deriveQueryFromState,
} from "@/app/_modules/emotion/emotion-model";

// Shared emoji data + default animation helper
import {
  EMOJI_CATEGORIES,            // Category[] { id, name, color, emojis[] }
  animForEmojiDefault,         // (emoji, mood, moodMap?) => "beat"|"tears"|...
} from "@/app/_modules/emojis/emoji-data";

/* ------------------------------------------------------------------
   HOLOPANEL v5.3 — Emotion-Synced + AI-Powered Emoji Engine
   - Uses shared emoji catalog (emoji-data.ts)
   - SSR-friendly data-anim assignment (iconic fallbacks)
   - Memoized filtering & lazy loading
   - A11y + tiny UX polish
-------------------------------------------------------------------*/

// Skin tone modifiers (constant to avoid undefined errors)
const SKIN_TONES = ["🏻", "🏼", "🏽", "🏾", "🏿"] as const;

// Animation names we use on the glyph
type Anim = "beat" | "tears" | "bounce" | "shake" | "shine" | "float" | "prism" | "zap";

type Props = {
  enablePulse?: boolean;
  externalPrompt?: string;
};

export default function HoloPanel({ enablePulse = false, externalPrompt }: Props) {
  const [activeCategory, setActiveCategory] = useState(EMOJI_CATEGORIES[0]?.id ?? "faces");
  const [skinTone, setSkinTone] = useState<string | null>(null);
  const [query, setQuery] = useState(externalPrompt ?? "");
  const [lazyLimit, setLazyLimit] = useState(72);
  const [currentMood, setCurrentMood] = useState(getState().mood);

  // Sync current mood from the emotion model
  useEffect(() => {
    const off = subscribe(() => setCurrentMood(getState().mood));
    return () => off();
  }, []);

  // Flatten all emojis for search
  const allEmojis = useMemo(
    () => EMOJI_CATEGORIES.flatMap((c) => c.emojis),
    []
  );

  // Filter + paginate
  const filtered = useMemo(() => {
    const list = query
      ? allEmojis.filter((e) =>
          (e.label + " " + e.keywords.join(" ")).toLowerCase().includes(query.toLowerCase())
        )
      : EMOJI_CATEGORIES.find((c) => c.id === activeCategory)?.emojis || [];
    return list.slice(0, lazyLimit);
  }, [query, activeCategory, allEmojis, lazyLimit]);

  // Lazy load on scroll (throttled)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
          setLazyLimit((l) => l + 24);
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click handler (copy + flash)
  const handleEmojiClick = useCallback(
    (emojiChar: string) => {
      navigator.clipboard.writeText(emojiChar + (skinTone ?? "")).catch(() => {});
      const flashId = "light-flash";
      let flash = document.getElementById(flashId);
      if (!flash) {
        flash = document.createElement("div");
        flash.id = flashId;
        flash.className = "light-flash";
        document.body.appendChild(flash);
      }
      flash.classList.add("on");
      setTimeout(() => flash && flash.classList.remove("on"), 420);
    },
    [skinTone]
  );

  // Determine animation for a single emoji (mood-aware, with iconic fallbacks)
  const animForEmoji = useCallback(
    (emojiChar: string, perEmojiFallback?: Anim): Anim => {
      // Strong iconic fallbacks for SSR (guarantees data-anim even if mood is null)
      switch (emojiChar) {
        case "❤️": return "beat";
        case "😂": return "bounce";
        case "😭": return "tears";
        case "😡": return "shake";
        case "😎": return "shine";
        case "😴": return "float";
      }
      // Mood-derived, then per-emoji fallback, then safe default
      const moodMap = currentMood ? { [currentMood]: getAnimationsForMood(currentMood as any) } : {};
      return (animForEmojiDefault({ emoji: emojiChar } as any, currentMood, moodMap as any) as Anim)
        || (perEmojiFallback as Anim)
        || "shine";
    },
    [currentMood]
  );

  return (
    <section className="holo-panel" aria-label="Holographic Emoji Panel">
      <header className="nex-header">
        <h3>Holographic Emojis v5</h3>
        <p>Linked with your avatar mood & Emotion AI</p>
      </header>

      <div className="controls" role="group" aria-label="Emoji controls">
        <div className="search">
          <input
            placeholder="Search or describe emotions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search emojis"
          />
          <button
            type="button"
            className="ai-btn"
            onClick={() => {
              try {
                const q = (query || "").trim();
                setPrompt(q || deriveQueryFromState());
              } catch (err) {
                console.error(err);
              }
            }}
            aria-label="Send to Emotion AI"
          >
            AI
          </button>
        </div>

        <div className="tones" role="group" aria-label="Skin tones">
          {SKIN_TONES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSkinTone(skinTone === t ? null : t)}
              className={clsx("tone", skinTone === t && "on")}
              aria-pressed={skinTone === t}
              aria-label={`Skin tone ${t}`}
              title={`Skin tone ${t}`}
            >
              ✋{t}
            </button>
          ))}
        </div>
      </div>

      <nav className="categories" aria-label="Emoji categories">
        {EMOJI_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            style={{ background: activeCategory === c.id ? c.color : "rgba(255,255,255,0.1)" }}
            className={clsx("cat", activeCategory === c.id && "on")}
            aria-pressed={activeCategory === c.id}
            onClick={() => {
              setActiveCategory(c.id);
              setQuery("");
              // gentle mood hint by category
              try {
                const hint = c.name.toLowerCase();
                if (/heart/.test(hint)) setMood("love" as any);
                else if (/face/.test(hint)) setMood("joy" as any);
                else if (/gesture|hand/.test(hint)) setMood("focus" as any);
              } catch {}
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {c.name}
          </button>
        ))}
      </nav>

      <div className="grid" role="list">
        {filtered.map((e) => {
          const tone = skinTone ?? "";
          const emojiChar = e.emoji; // from shared catalog
          const anim = animForEmoji(emojiChar, (e as any).anim);
          return (
            <button
              key={`${e.label}-${emojiChar}`}
              type="button"
              role="listitem"
              aria-label={e.label}
              title={e.keywords.join(", ")}
              className={clsx("emoji", enablePulse && "act-breathe")}
              onClick={() => handleEmojiClick(emojiChar)}
            >
              <span className="halo" aria-hidden="true" />
              <span className="sheen" aria-hidden="true" />
              {/* Put data-anim on glyph so grep/SSR checks find it reliably */}
              <span className="glyph" data-anim={anim}>
                {emojiChar}
                {tone}
              </span>
            </button>
          );
        })}
      </div>

      <footer className="quick-reactions" aria-label="Quick reactions">
        <h4>Quick Reactions</h4>
        <div className="strip">
          {["🔥", "💯", "🌈", "⭐️", "🌙", "☀️", "⚡️", "💫"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => navigator.clipboard.writeText(r)}
              aria-label={`React ${r}`}
            >
              {r}
            </button>
          ))}
        </div>
      </footer>

      {/* Scoped styles kept inside the component to match existing pattern */}
      <style jsx>{`
        .holo-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: center;
          color: #fff;
        }

        .nex-header h3 {
          font-size: 1.3rem;
          font-weight: 700;
          background: linear-gradient(90deg, #6ef, #f9f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .controls {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        input {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 8px 12px;
          color: #fff;
          min-width: 220px;
        }

        .ai-btn {
          background: linear-gradient(90deg, #6ef, #f9f);
          border: none;
          padding: 8px 14px;
          border-radius: 10px;
          color: #000;
          font-weight: 700;
          cursor: pointer;
        }

        .tones .tone {
          font-size: 16px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
        }
        .tones .tone.on { background: rgba(255, 255, 255, 0.2); }

        .categories {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-top: 6px;
        }
        .cat {
          border: none;
          padding: 6px 10px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 13px;
          color: #111;
          transition: 0.2s;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          gap: 12px;
          justify-items: center;
        }

        .emoji {
          position: relative;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.1);
          box-shadow:
            inset 0 0 8px rgba(255, 255, 255, 0.05),
            0 0 10px rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .emoji:hover { transform: scale(1.1); }

        .glyph {
          font-size: 32px;
          text-shadow: 0 0 1px rgba(0, 0, 0, 0.45), 0 0 6px rgba(0, 0, 0, 0.25);
          position: relative;
          display: inline-block;
        }

        /* Click flash (copy feedback) */
        .light-flash {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          background: radial-gradient(circle, rgba(255,255,255,.16), transparent 55%);
          opacity: 0;
          animation: none;
        }
        .light-flash.on { animation: flash 0.38s ease; }
        @keyframes flash { from { opacity:1 } to { opacity:0 } }

        /* ================= Animations (scoped to .glyph) ================= */

        /* Heartbeat */
        .glyph[data-anim="beat"] {
          animation: beat 0.9s infinite ease-in-out;
          transform-origin: center;
        }
        @keyframes beat {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(255,0,80,0)); }
          25% { transform: scale(1.12); filter: drop-shadow(0 0 6px rgba(255,0,80,.35)); }
          50% { transform: scale(0.98); }
          75% { transform: scale(1.09); }
        }

        /* Tears */
        .glyph[data-anim="tears"]::after {
          content: "💧";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 38%;
          animation: tear 1.2s ease-in infinite;
          font-size: 14px;
          opacity: 0.9;
        }
        @keyframes tear {
          0% { transform: translate(-50%, 0) scale(0.9); opacity: 0; }
          15% { opacity: 1; }
          70% { transform: translate(-50%, 22px) scale(1); opacity: 1; }
          100% { transform: translate(-50%, 30px) scale(0.9); opacity: 0; }
        }

        /* Bounce */
        .glyph[data-anim="bounce"] { animation: bounce 1.05s ease-in-out infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
          55% { transform: translateY(0); }
          70% { transform: translateY(-2px); }
        }

        /* Shake */
        .glyph[data-anim="shake"] {
          animation: shake 0.7s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-5deg); }
          40% { transform: rotate(4deg); }
          60% { transform: rotate(-3deg); }
          80% { transform: rotate(2deg); }
        }

        /* Shine */
        .glyph[data-anim="shine"] {
          background: linear-gradient(90deg, #fff, #fff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 2.2s linear infinite;
        }
        @keyframes shine {
          0% { filter: drop-shadow(0 0 0 rgba(255,255,255,0)); }
          50% { filter: drop-shadow(0 0 8px rgba(255,255,255,.55)); }
          100% { filter: drop-shadow(0 0 0 rgba(255,255,255,0)); }
        }

        /* Float (sleep/calm) */
        .glyph[data-anim="float"] {
          animation: em_float 2.6s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes em_float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }

        /* Prism sweep (calm/focus) */
        .glyph[data-anim="prism"] {
          position: relative;
          display: inline-block;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-image: linear-gradient(90deg, #fff, #9ff, #f9f, #fff);
          background-size: 300% 100%;
          animation: em_prism 2.8s linear infinite;
          filter: drop-shadow(0 0 4px rgba(255,255,255,.35));
        }
        @keyframes em_prism {
          0%   { background-position: 0% 50%;   }
          100% { background-position: 100% 50%; }
        }

        /* Zap pulse (surprise/angry accent) */
        .glyph[data-anim="zap"] {
          animation: em_zap 0.9s cubic-bezier(.3,.7,.2,1) infinite;
          display: inline-block;
        }
        @keyframes em_zap {
          0%   { transform: scale(1) rotate(0deg);  filter: drop-shadow(0 0 0 rgba(255,255,0,0)); }
          20%  { transform: scale(1.15) rotate(-6deg); filter: drop-shadow(0 0 12px rgba(255,255,0,.65)); }
          40%  { transform: scale(0.97) rotate(5deg); }
          60%  { transform: scale(1.07) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg);  filter: drop-shadow(0 0 0 rgba(255,255,0,0)); }
        }
      `}</style>
    </section>
  );
}