"use client";
import React, { useEffect, useState } from "react";

/**
 * LabsStudio
 * - Minimal, safe client component
 * - Shows install status
 * - Optionally pings /api/health (won't crash if route is missing)
 */
type ApiState = "checking" | "ok" | "fail";

export default function LabsStudio() {
  const [api, setApi] = useState<ApiState>("checking");
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/health", {
          cache: "no-store",
          signal: ctrl.signal,
        });
        setApi(res.ok ? "ok" : "fail");
      } catch {
        setApi("fail");
      }
    })();
    return () => ctrl.abort();
  }, []);

  return (
    <div className="rounded border p-4">
      <p className="font-medium">Lumora Labs is installed ✅</p>
      <div className="mt-1 text-sm text-neutral-500">
        <p>Stub UI — client ready.</p>
        <p className="mt-1">
          Network:{" "}
          <span className={online ? "text-emerald-500" : "text-amber-500"}>
            {online ? "online" : "offline"}
          </span>
          {" · "}
          API:{" "}
          <span
            className={
              api === "ok"
                ? "text-emerald-500"
                : api === "fail"
                ? "text-rose-500"
                : "text-neutral-500"
            }
          >
            {api === "checking"
              ? "checking…"
              : api === "ok"
              ? "healthy"
              : "unreachable"}
          </span>
        </p>
      </div>
    </div>
  );
}
