"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const swUrl = "/service-worker.js";

    // Best-effort register; never hard-fail UI.
    navigator.serviceWorker
      .register(swUrl, { scope: "/" })
      .catch(() => {});
  }, []);

  return null;
}
