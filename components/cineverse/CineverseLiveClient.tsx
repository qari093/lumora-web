"use client";

import { useEffect, useState } from "react";

type CineverseSummary = {
  status: string;
  featuredTitles: number;
  trailersReady: boolean;
  spotlightCategory: string;
};

export default function CineverseLiveClient() {
  const [summary, setSummary] = useState<CineverseSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/cineverse/summary", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!data?.ok || !data.summary) {
          setError("cineverse_summary_unavailable");
          return;
        }
        setSummary(data.summary);
      })
      .catch(() => {
        if (!mounted) return;
        setError("cineverse_summary_unavailable");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section data-cineverse-live="ready">
      {error ? <div data-cineverse-error={error}>CineVerse unavailable</div> : null}

      {summary ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div data-cineverse-status>Status: {summary.status}</div>
          <div data-cineverse-featured-titles>Featured Titles: {summary.featuredTitles}</div>
          <div data-cineverse-trailers-ready>Trailers Ready: {String(summary.trailersReady)}</div>
          <div data-cineverse-spotlight-category>Spotlight Category: {summary.spotlightCategory}</div>
        </div>
      ) : null}
    </section>
  );
}
