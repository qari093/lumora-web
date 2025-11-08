"use client";
import React, { useEffect, useRef, useState } from "react";

type CoachStage = "hidden" | "hint" | "halfPull" | "success";
const getN = (k: string, d: number) => { try { const v = localStorage.getItem(k); return v ? Number(v) : d; } catch { return d; } };
const setN = (k: string, v: number) => { try { localStorage.setItem(k, String(v)); } catch {} };

export default function GestureDialog() {
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<CoachStage>("hidden");
  const drag = useRef({ y0: 0, y: 0, act: false });
  const opens   = useRef(getN("lumora:coach:opens", 0));
  const ignores = useRef(getN("lumora:coach:ignores", 0));
  const seen    = useRef(getN("lumora:coach:seen", 0));

  // Show a few times only
  useEffect(() => {
    if (seen.current < 5) {
      setVisible(true);
      setStage("hint");
      seen.current += 1; setN("lumora:coach:seen", seen.current);
    }
  }, []);

  // React to overlay open/close
  useEffect(() => {
    const onOpen = () => {
      opens.current += 1; setN("lumora:coach:opens", opens.current);
      try { (window as any).Haptics?.bloom?.(); } catch {}
      setStage("success"); setTimeout(() => setVisible(false), 900);
    };
    const onClose = () => { try { (window as any).Haptics?.pulse?.(); } catch {} };
    addEventListener("lumora:overlay-open", onOpen as EventListener);
    addEventListener("lumora:overlay-close", onClose as EventListener);
    return () => {
      removeEventListener("lumora:overlay-open", onOpen as EventListener);
      removeEventListener("lumora:overlay-close", onClose as EventListener);
    };
  }, []);

  // Hotkey teaching
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key?.toLowerCase() === "k";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        dispatchEvent(new CustomEvent("lumora:overlay-open"));
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  // Drag logic
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { y0: e.clientY, y: e.clientY, act: true };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setStage("halfPull");
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.act) return;
    drag.current.y = e.clientY;
    const dy = Math.max(0, Math.min(drag.current.y - drag.current.y0, 80));
    const bar = document.getElementById("lumora-coach-bar") as HTMLDivElement | null;
    if (bar) bar.style.transform = "translate(-50%, " + dy + "px)";
  };
  const onUp = () => {
    if (!drag.current.act) return;
    const dy = drag.current.y - drag.current.y0;
    drag.current.act = false;
    const bar = document.getElementById("lumora-coach-bar") as HTMLDivElement | null;
    if (bar) bar.style.transform = "translate(-50%, 0px)";
    if (dy > 60) {
      dispatchEvent(new CustomEvent("lumora:overlay-open"));
    } else {
      ignores.current += 1; setN("lumora:coach:ignores", ignores.current);
      try { (window as any).Haptics?.wave?.(); } catch {}
      if (ignores.current >= 3) setVisible(false);
      setStage("hint");
    }
  };

  if (!visible) return null;

  const hint =
    stage === "hint"
      ? "Pull down from here · یا یہاں سے نیچے کھینچیں"
      : stage === "halfPull"
      ? "Keep pulling… اور تھوڑا سا"
      : "Nice! زبردست";

  return (
    <div className="lumora-coach-root" aria-hidden>
      <div
        id="lumora-coach-bar"
        className={"coach-bar " + stage}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
      >
        <div className="grabber" />
        {/* chevron appears only during hint */}
        <div className={"chevron " + (stage === "hint" ? "show" : "")}>⌄</div>
      </div>

      <div className="coach-bubble">
        <span className="dot" />
        <span className="text">{hint}</span>
      </div>

      <style jsx>{`
        .lumora-coach-root{ position:fixed; inset:0; pointer-events:none; z-index:70; }

        .coach-bar{
          pointer-events:auto;
          position:absolute; left:50%; bottom:92px; transform:translate(-50%,0);
          width:140px; height:40px; border-radius:999px;
          background:rgba(255,255,255,0.65);
          backdrop-filter:blur(16px);
          box-shadow:0 8px 30px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.06);
          display:grid; place-items:center;
          transition:box-shadow .2s ease, background .2s ease, transform .2s ease;
          animation:bar-breathe 2.4s ease-in-out infinite;
        }
        .coach-bar.halfPull{ box-shadow:0 12px 40px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.08); }

        .grabber{
          width:46px; height:6px; border-radius:999px;
          background:linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0.15));
        }
        .chevron{
          position:absolute; top:-16px; left:50%; transform:translate(-50%,0);
          font-size:18px; opacity:0; pointer-events:none;
        }
        .chevron.show{ animation:chevron-nudge 1.8s ease-in-out infinite; }

        .coach-bubble{
          position:absolute; left:50%; bottom:148px; transform:translate(-50%,0);
          pointer-events:none; display:inline-flex; align-items:center; gap:10px;
          padding:10px 14px; border-radius:14px;
          background:rgba(255,255,255,0.72); backdrop-filter:blur(18px);
          box-shadow:0 10px 30px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.6);
          font-weight:700; animation:bubble-breathe 2.8s ease-in-out infinite;
        }
        .dot{ width:8px; height:8px; border-radius:50%; background:#2f86ff; box-shadow:0 0 0 8px #2f86ff22; }
        .text{ color:#0b1424; letter-spacing:.2px; white-space:nowrap; }

        @keyframes bar-breathe {
          0%,100%{ transform:translate(-50%,0) scale(1); box-shadow:0 8px 30px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.06);}
          50%{ transform:translate(-50%,0) scale(1.03); box-shadow:0 12px 38px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.08);}
        }
        @keyframes bubble-breathe {
          0%,100%{ transform:translate(-50%,0) scale(1); }
          50%{ transform:translate(-50%,0) scale(1.02); }
        }
        @keyframes chevron-nudge {
          0%,100%{ opacity:0.0; transform:translate(-50%,0); }
          30%{ opacity:0.9; transform:translate(-50%,4px); }
          60%{ opacity:0.0; transform:translate(-50%,0); }
        }

        :global(html.dark) .coach-bar{ background:rgba(32,34,38,0.65); box-shadow:0 8px 30px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.06); }
        :global(html.dark) .coach-bubble{ background:rgba(28,30,34,0.75); box-shadow:0 10px 34px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06); }
        :global(html.dark) .text{ color:#e6ebff; }
      `}</style>
    </div>
  );
}
