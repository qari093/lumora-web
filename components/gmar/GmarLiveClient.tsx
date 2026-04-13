"use client";

import { useEffect, useState } from "react";

type GmarSummary = {
  status: string;
  queueOpen: boolean;
  activeChallenges: number;
  rankedModes: number;
};

export default function GmarLiveClient() {
  const [summary, setSummary] = useState<GmarSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/gmar/summary", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!data?.ok || !data.summary) {
          setError("gmar_summary_unavailable");
          return;
        }
        setSummary(data.summary);
      })
      .catch(() => {
        if (!mounted) return;
        setError("gmar_summary_unavailable");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section data-gmar-live="ready">
      {error ? <div data-gmar-error={error}>GMAR unavailable</div> : null}

      {summary ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div data-gmar-status>Status: {summary.status}</div>
          <div data-gmar-queue-open>Queue Open: {String(summary.queueOpen)}</div>
          <div data-gmar-active-challenges>Active Challenges: {summary.activeChallenges}</div>
          <div data-gmar-ranked-modes>Ranked Modes: {summary.rankedModes}</div>
        </div>
      ) : null}
    </section>
  );
}
