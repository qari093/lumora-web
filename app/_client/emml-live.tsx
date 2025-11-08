"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Listens to /api/emotion/stream (SSE) and refreshes the page on new EMML events */
export default function EmmlLive() {
  const router = useRouter();

  useEffect(() => {
    const es = new EventSource("/api/emotion/stream", { withCredentials: false });
    es.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg?.kind === "emml:new") router.refresh();
      } catch {
        // non-JSON keep-alives are fine; ignore
      }
    };
    es.onerror = () => {
      // Auto-reconnect: close and let browser re-open on re-mount after refresh
      es.close();
    };
    return () => es.close();
  }, [router]);

  return null; // no UI
}
