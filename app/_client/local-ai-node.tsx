"use client";
import { useEffect, useState } from "react";

/**
 * Local AI Node — lightweight offline AI mood/focus estimator.
 * Stores last computed mood locally and refreshes when online.
 */
export default function LocalAiNode() {
  const [mood, setMood] = useState<string>("Calm");
  const [focus, setFocus] = useState<number>(82);
  const [calm, setCalm] = useState<number>(90);

  useEffect(() => {
    const saved = localStorage.getItem("local_ai_state");
    if (saved) {
      try {
        const j = JSON.parse(saved);
        setMood(j.mood || "Balanced");
        setFocus(j.focus || 70);
        setCalm(j.calm || 80);
      } catch {}
    }

    const iv = setInterval(() => {
      // Random minor drift to simulate AI changes
      const nf = Math.max(0, Math.min(100, focus + (Math.random() * 6 - 3)));
      const nc = Math.max(0, Math.min(100, calm + (Math.random() * 6 - 3)));
      const moods = ["Calm", "Focused", "Curious", "Reflective", "Energized"];
      const nm = moods[Math.floor(Math.random() * moods.length)];
      setFocus(nf);
      setCalm(nc);
      setMood(nm);
      localStorage.setItem("local_ai_state", JSON.stringify({ mood: nm, focus: nf, calm: nc }));
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        right: 20,
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        fontSize: 13,
        lineHeight: 1.5,
        zIndex: 4000,
        fontFamily: "ui-sans-serif,system-ui",
        boxShadow: "0 4px 18px rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)"
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Local AI Node</div>
      <div>Mood: <b>{mood}</b></div>
      <div>Focus: <b>{focus.toFixed(1)}%</b></div>
      <div>Calm: <b>{calm.toFixed(1)}%</b></div>
    </div>
  );
}
