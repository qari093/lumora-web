"use client";

import { useEffect, useState } from "react";

type LiveSummary = {
  status: string;
  roomsActive: number;
  streamsLive: number;
  moderationReady: boolean;
};

export default function LivePortalClient() {
  const [summary, setSummary] = useState<LiveSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/live/summary", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!data?.ok || !data.summary) {
          setError("live_summary_unavailable");
          return;
        }
        setSummary(data.summary);
      })
      .catch(() => {
        if (!mounted) return;
        setError("live_summary_unavailable");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section data-live-portal="ready">
      {error ? <div data-live-error={error}>Live unavailable</div> : null}

      {summary ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div data-live-status>Status: {summary.status}</div>
          <div data-live-rooms-active>Rooms Active: {summary.roomsActive}</div>
          <div data-live-streams-live>Streams Live: {summary.streamsLive}</div>
          <div data-live-moderation-ready>Moderation Ready: {String(summary.moderationReady)}</div>
        </div>
      ) : null}
    </section>
  );
}
