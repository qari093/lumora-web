import React from "react";
import TranslationControlsBar from "@/components/lumalink/TranslationControlsBar";

type Tone = "formal" | "neutral" | "informal";

export default function TranslationControlsBar() {
  const enabled = process.env.NEXT_PUBLIC_LUMALINK_TRANSLATION_UI === "1";
  if (!enabled) return null;

  return (
      {/* Translation UI Controls (feature-flagged) */}
      {process.env.NEXT_PUBLIC_LUMALINK_TRANSLATION_UI_CONTROLS === "1" ? (
        <TranslationControlsBar />
      ) : null}

    <div
      data-testid="lumalink-translation-controls"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "6px 10px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      {/* Left: language control */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
          <input
            type="checkbox"
            defaultChecked
            aria-label="Auto-detect language"
            disabled
          />
          <span style={{ fontSize: 12, opacity: 0.85 }}>Auto</span>
        </label>

        <select aria-label="From language" disabled style={{ fontSize: 12, opacity: 0.85 }}>
          <option value="auto">From: Auto</option>
        </select>

        <select aria-label="To language" disabled style={{ fontSize: 12, opacity: 0.85 }}>
          <option value="en">To: EN</option>
          <option value="de">To: DE</option>
          <option value="fr">To: FR</option>
          <option value="es">To: ES</option>
        </select>
      </div>

      {/* Right: tone control */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select
          aria-label="Translation tone"
          defaultValue={"neutral" as Tone}
          disabled
          style={{ fontSize: 12, opacity: 0.85 }}
        >
          <option value="formal">Formal</option>
          <option value="neutral">Neutral</option>
          <option value="informal">Informal</option>
        </select>
      </div>
    </div>
  );
}
