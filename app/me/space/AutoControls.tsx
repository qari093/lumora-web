"use client";
import { useEffect } from "react";

export default function AutoControls() {
  useEffect(() => {
    try {
      const qa = <T extends HTMLElement>(sel: string) =>
        Array.from(document.querySelectorAll<T>(sel));
      const byText = (txt: string) =>
        qa<HTMLButtonElement | HTMLAnchorElement>("button,a")
          .find(el => (el.textContent || "").trim().toLowerCase() === txt.toLowerCase());

      const copyBtn  = byText("Copy Link");
      const resetBtn = byText("Reset");

      if (copyBtn && !copyBtn.hasAttribute("data-wired-copy")) {
        copyBtn.setAttribute("data-wired-copy", "1");
        copyBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          const url = location.href;
          try { await navigator.clipboard.writeText(url); }
          catch {
            const ta = document.createElement("textarea");
            ta.value = url; document.body.appendChild(ta);
            ta.select(); document.execCommand("copy"); ta.remove();
          }
        });
      }

      if (resetBtn && !resetBtn.hasAttribute("data-wired-reset")) {
        resetBtn.setAttribute("data-wired-reset", "1");
        resetBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const u = new URL(location.href);
          const email = u.searchParams.get("email") || "demo@lumora.local";
          location.href = `${u.origin}/me/space?email=${encodeURIComponent(email)}`;
        });
      }
    } catch {}
  }, []);

  return null;
}
