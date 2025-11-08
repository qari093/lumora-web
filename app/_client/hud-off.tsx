"use client";
import { useEffect } from "react";
export default function HudOff() {
  useEffect(() => {
    const el = document.body; if (!el) return;
    const prev = el.getAttribute("data-hud");
    el.setAttribute("data-hud","off");
    return () => { if (prev==null) el.removeAttribute("data-hud"); else el.setAttribute("data-hud", prev); };
  }, []);
  return null;
}
