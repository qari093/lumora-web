"use client";

import { useEffect, useState } from "react";

type ProfileSummary = {
  status: string;
  creatorMode: boolean;
  completionScore: number;
  identityReady: boolean;
};

export default function ProfileLiveClient() {
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/profile/summary", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (!data?.ok || !data.summary) {
          setError("profile_summary_unavailable");
          return;
        }
        setSummary(data.summary);
      })
      .catch(() => {
        if (!mounted) return;
        setError("profile_summary_unavailable");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section data-profile-live="ready">
      {error ? <div data-profile-error={error}>Profile unavailable</div> : null}

      {summary ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div data-profile-status>Status: {summary.status}</div>
          <div data-profile-creator-mode>Creator Mode: {String(summary.creatorMode)}</div>
          <div data-profile-completion-score>Completion Score: {summary.completionScore}</div>
          <div data-profile-identity-ready>Identity Ready: {String(summary.identityReady)}</div>
        </div>
      ) : null}
    </section>
  );
}
