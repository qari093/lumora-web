"use client";
import React from "react";

export function showGiftToast(text: string) {
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
      gap: "8px",
      pointerEvents: "none",
    } as CSSStyleDeclaration);
    document.body.appendChild(wrap);
  }
  const div = document.createElement("div");
  div.className = "toast";
  div.textContent = text;
  Object.assign(div.style, {
    padding: "10px 14px",
    borderRadius: "10px",
    background: "linear-gradient(45deg,#667eea,#764ba2)",
    color: "#fff",
    fontWeight: "600",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
    transform: "translateY(10px)",
    opacity: "0",
    transition: "all .25s ease",
    pointerEvents: "auto",
  } as CSSStyleDeclaration);
  wrap.appendChild(div);
  requestAnimationFrame(() => {
    div.style.transform = "translateY(0)";
    div.style.opacity = "1";
  });
  setTimeout(() => {
    div.style.opacity = "0";
    div.style.transform = "translateY(10px)";
    setTimeout(() => { wrap && wrap.contains(div) && wrap.removeChild(div); }, 250);
  }, 2200);
}

export const giftBtn: React.CSSProperties = {
  background: "linear-gradient(45deg,#667eea,#764ba2)",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
};
