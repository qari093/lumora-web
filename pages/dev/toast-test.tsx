import React from "react";

function ensurePulseCSS() {
  if (document.getElementById("zc-pulse-css")) return;
  const css = `
  @keyframes zcPulse {
    0% { box-shadow: 0 0 0 0 rgba(255,215,0,.55); }
    70% { box-shadow: 0 0 0 18px rgba(255,215,0,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,215,0,0); }
  }`;
  const style = document.createElement("style");
  style.id = "zc-pulse-css";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

function showGiftToast(text: string) {
  ensurePulseCSS();
  let wrap = document.getElementById("toasts");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "toasts";
    Object.assign(wrap.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      pointerEvents: "none",
      fontFamily: "ui-sans-serif, system-ui, -apple-system",
    } as CSSStyleDeclaration);
    document.body.appendChild(wrap);
  }
  const div = document.createElement("div");
  div.innerHTML = `\uD83E\uDE99 <b>${text}</b>`;
  Object.assign(div.style, {
    padding: "12px 18px",
    borderRadius: "14px",
    background: "linear-gradient(135deg,#ffd700,#ffb100)",
    color: "#2b2100",
    fontWeight: "800",
    fontSize: "15px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
    transform: "translateY(16px) scale(0.96)",
    opacity: "0",
    transition: "all .28s cubic-bezier(0.4,0,0.2,1)",
    pointerEvents: "auto",
    border: "1px solid rgba(255,255,255,.35)",
  } as CSSStyleDeclaration);
  wrap.appendChild(div);
  requestAnimationFrame(() => {
    div.style.transform = "translateY(0) scale(1)";
    div.style.opacity = "1";
    (div.style as any).animation = "zcPulse 1.6s ease-out 1";
  });
  setTimeout(() => {
    div.style.opacity = "0";
    div.style.transform = "translateY(16px) scale(0.96)";
    setTimeout(() => { wrap && wrap.contains(div) && wrap.removeChild(div); }, 300);
  }, 2400);
}

export default function Page() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Toast Test (Pages Router)</h1>
      <button
        style={{
          background: "linear-gradient(45deg,#ffd700,#ffb100)",
          color: "#2b2100",
          border: "none",
          padding: "10px 16px",
          borderRadius: 12,
          cursor: "pointer",
          fontWeight: 800,
          boxShadow: "0 8px 18px rgba(0,0,0,.25)",
          outline: "2px solid rgba(255,255,255,.35)",
        }}
        onClick={() => {
          console.log("✅ Button clicked — calling showGiftToast");
          showGiftToast("Gift sent! +10 ZC");
        }}
      >
        {"\uD83E\uDE99"} Show Gift Toast
      </button>
    </div>
  );
}
