"use client";
import { useState } from "react";

export function VoiceControls(props: {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  speaking: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: 10,
        background: "rgba(0,0,0,.35)",
        backdropFilter: "blur(8px)",
      }}
    >
      <button
        onClick={() => props.onToggle(!props.enabled)}
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          fontWeight: 700,
          background: props.enabled ? "#22c55e" : "#ef4444",
          color: "#000",
        }}
      >
        {props.enabled ? "Mic ON" : "Mic OFF"}
      </button>

      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: props.speaking ? "#22c55e" : "#555",
          boxShadow: props.speaking
            ? "0 0 10px rgba(34,197,94,.8)"
            : "none",
          transition: "all .15s ease",
        }}
      />
    </div>
  );
}
