"use client";

import { useEffect, useState } from "react";

type NexaSummary = {
  status: string;
  routinesActive: number;
  insightsReady: boolean;
  recoveryMode: string;
};

export default function NexaLiveClient() {
  const [summary, setSummary] = useState<NexaSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/nexa/summary", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!data?.ok || !data.summary) {
          setError("nexa_summary_unavailable");
          return;
        }
        setSummary(data.summary);
      })
      .catch(() => {
        if (!mounted) return;
        setError("nexa_summary_unavailable");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section data-nexa-live="ready">
      {error ? <div data-nexa-error={error}>NEXA unavailable</div> : null}

      {summary ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div data-nexa-status>Status: {summary.status}</div>
          <div data-nexa-routines-active>Routines Active: {summary.routinesActive}</div>
          <div data-nexa-insights-ready>Insights Ready: {String(summary.insightsReady)}</div>
          <div data-nexa-recovery-mode>Recovery Mode: {summary.recoveryMode}</div>
        </div>
      ) : null}
    </section>
  );
}
