"use client";
import { useEffect } from "react";

function fmtStamp(d = new Date()) {
  const pad = (n:number)=>String(n).padStart(2,"0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function AutoWire() {
  useEffect(() => {
    try {
      const u = new URL(window.location.href);
      const auto = u.searchParams.get("auto") === "1";
      const period = parseInt(u.searchParams.get("period") || "10000", 10);

      const $chk = document.getElementById("autoChk") as HTMLInputElement | null;
      const $sel = document.getElementById("autoSel") as HTMLSelectElement | null;
      const $stamp = document.getElementById("autoStamp") as HTMLElement | null;

      if ($chk && !$chk.dataset.wired) {
        $chk.dataset.wired = "1";
        $chk.checked = auto;
        $chk.addEventListener("change", () => {
          const url = new URL(location.href);
          if ($chk.checked) url.searchParams.set("auto", "1");
          else url.searchParams.delete("auto");
          history.replaceState(null, "", url.toString());
          location.reload();
        });
      }

      if ($sel && !$sel.dataset.wired) {
        $sel.dataset.wired = "1";
        // try to match a value in seconds; fall back to current
        const sec = Math.max(1, Math.round(period / 1000));
        const opt = Array.from($sel.options).find(o => parseInt(o.value,10) === sec);
        if (opt) $sel.value = String(sec);
        $sel.addEventListener("change", () => {
          const nextSec = parseInt($sel.value || "10", 10);
          const url = new URL(location.href);
          url.searchParams.set("period", String(nextSec * 1000));
          // keep auto=1 when period changes
          if (!url.searchParams.has("auto")) url.searchParams.set("auto","1");
          history.replaceState(null, "", url.toString());
          location.reload();
        });
      }

      if ($stamp) {
        const sec = Math.max(1, Math.round(period / 1000));
        $stamp.textContent = `Auto ${sec}s — Updated ${fmtStamp()}`;
      }
    } catch {}
  }, []);

  return null;
}
