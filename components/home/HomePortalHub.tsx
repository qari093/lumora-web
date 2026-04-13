"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PortalCard = {
  key: string;
  path: string;
  enabled: boolean;
  title: string;
  subtitle: string;
  status: "active";
};

type PortalOverview = {
  total: number;
  active: number;
  healthy: number;
};

type LaunchReadiness = {
  status: string;
  passed: number;
  total: number;
  score: number;
};

export default function HomePortalHub() {
  const [cards, setCards] = useState<PortalCard[]>([]);
  const [overview, setOverview] = useState<PortalOverview | null>(null);
  const [readiness, setReadiness] = useState<LaunchReadiness | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetch("/api/portal-cards", { cache: "no-store" }).then((res) => res.json()),
      fetch("/api/portal-overview", { cache: "no-store" }).then((res) => res.json()),
      fetch("/api/launch/readiness", { cache: "no-store" }).then((res) => res.json()),
    ])
      .then(([cardsData, overviewData, readinessData]) => {
        if (!mounted) return;

        if (!cardsData?.ok || !Array.isArray(cardsData.cards)) {
          setError("portal_cards_unavailable");
          return;
        }

        if (!overviewData?.ok || !overviewData?.overview) {
          setError("portal_overview_unavailable");
          return;
        }

        if (!readinessData?.ok || !readinessData?.readiness) {
          setError("launch_readiness_unavailable");
          return;
        }

        setCards(cardsData.cards);
        setOverview({
          total: overviewData.overview.total,
          active: overviewData.overview.active,
          healthy: overviewData.overview.healthy,
        });
        setReadiness({
          status: readinessData.readiness.status,
          passed: readinessData.readiness.passed,
          total: readinessData.readiness.total,
          score: readinessData.readiness.score,
        });
      })
      .catch(() => {
        if (!mounted) return;
        setError("portal_home_data_unavailable");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Lumora</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Portal Hub</h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
          All core portals are now mounted and reachable.
        </p>

        {readiness ? (
          <div
            data-home-readiness="ready"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: 18,
              marginBottom: 18,
            }}
          >
            <div style={{ opacity: 0.7, fontSize: 12, marginBottom: 8 }}>Launch Readiness</div>
            <div data-home-readiness-status style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
              {readiness.status}
            </div>
            <div data-home-readiness-passed style={{ opacity: 0.8 }}>
              Passed: {readiness.passed}/{readiness.total}
            </div>
            <div data-home-readiness-score style={{ opacity: 0.8 }}>
              Score: {readiness.score}
            </div>
          </div>
        ) : null}

        {overview ? (
          <div
            data-home-overview="ready"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
              <div style={{ opacity: 0.7, fontSize: 12 }}>Total Portals</div>
              <div data-home-overview-total style={{ fontSize: 28, fontWeight: 800 }}>{overview.total}</div>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
              <div style={{ opacity: 0.7, fontSize: 12 }}>Active</div>
              <div data-home-overview-active style={{ fontSize: 28, fontWeight: 800 }}>{overview.active}</div>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
              <div style={{ opacity: 0.7, fontSize: 12 }}>Healthy</div>
              <div data-home-overview-healthy style={{ fontSize: 28, fontWeight: 800 }}>{overview.healthy}</div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div data-home-error={error} style={{ padding: 16, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }}>
            Failed to load portal home data.
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {cards.map((card) => (
            <Link
              key={card.key}
              href={card.path}
              data-home-portal-key={card.key}
              data-home-portal-status={card.status}
              style={{
                display: "block",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 18,
                padding: 18,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                {card.title}
              </div>
              <div style={{ opacity: 0.75, marginBottom: 10 }}>{card.subtitle}</div>
              <div style={{ fontSize: 12, opacity: 0.65 }}>
                {card.status} • {card.path}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
