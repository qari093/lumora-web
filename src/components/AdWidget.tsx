"use client";
import React from "react";

type ServeMeta = { ok: boolean; reason?: string; waitSec?: number; count?: number; cap?: number; };
type Ad = {
  id: string; ownerId: string; title: string; mediaUrl: string; clickUrl: string;
  cta?: string; radiusKm?: number;
  geo?: { lat?: number; lon?: number; city?: string; country?: string };
  maxImpressionsPerDay?: number; maxImpressionsPerUser?: number; minSecondsBetweenViews?: number;
};
type ServeResponse =
  | { ok: true; ad: Ad; ownerId: string; geo?: any; km?: number | null; currency?: string }
  | { ok: true; ad: null; ownerId?: string; reason: string; geo?: any; km?: number | null; meta?: any }
  | { ok: false; error: string };

function useClient() {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);
  return isClient;
}

export default function AdWidget({ ownerId = "OWNER_A", className }: { ownerId?: string; className?: string }) {
  const isClient = useClient();
  const [state, setState] = React.useState<{ loading: boolean; data?: ServeResponse; error?: string; impressionSent?: boolean; }>({ loading: true });

  React.useEffect(() => {
    let cancelled = false;
    async function fetchWithGeo() {
      const geo = await new Promise<{lat?: number; lon?: number}>(resolve => {
        if (!("geolocation" in navigator)) return resolve({});
        const t = setTimeout(() => resolve({}), 1200);
        navigator.geolocation.getCurrentPosition(
          (pos) => { clearTimeout(t); resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }); },
          () => { clearTimeout(t); resolve({}); },
          { enableHighAccuracy: false, timeout: 1000, maximumAge: 60000 }
        );
      });
      const qs = new URLSearchParams({ ownerId });
      if (typeof geo.lat === "number" && typeof geo.lon === "number") { qs.set("lat", String(geo.lat)); qs.set("lon", String(geo.lon)); }
      const r = await fetch(`/api/ads/serve?${qs.toString()}`, { cache: "no-store" });
      const j = (await r.json()) as ServeResponse;
      if (!cancelled) setState({ loading: false, data: j });
    }
    if (isClient) fetchWithGeo();
    return () => { cancelled = true; };
  }, [isClient, ownerId]);

  React.useEffect(() => {
    const d = state.data as any;
    if (!d || !("ad" in d) || !d.ad || state.impressionSent) return;
    const ad: Ad = d.ad;
    let done = false;
    (async () => {
      try {
        await fetch(`/api/ads/track`, {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ adId: ad.id, ownerId: ad.ownerId, event: "impression" }), keepalive: true
        });
      } catch {}
      if (!done) setState(s => ({ ...s, impressionSent: true }));
    })();
    return () => { done = true; };
  }, [state.data, state.impressionSent]);

  function onClick(ad: Ad) {
    window.open(ad.clickUrl, "_blank", "noopener,noreferrer");
    fetch(`/api/ads/track`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ adId: ad.id, ownerId: ad.ownerId, event: "click" }), keepalive: true
    }).catch(() => {});
  }

  if (!isClient) return null;
  if (state.loading) return <div className={className} style={boxStyle}><span style={muted}>Loading ad…</span></div>;

  const data = state.data!;
  if ("error" in data && !data.ok) return <div className={className} style={boxStyle}><span style={err}>Error: {data.error}</span></div>;

  if ("ad" in data && data.ad) {
    const ad = data.ad;
    return (
      <div className={className} style={boxStyle}>
        <div style={badge}>Sponsored</div>
        <img src={ad.mediaUrl} alt={ad.title} style={{ width: "100%", height: "auto", borderRadius: 8, cursor: "pointer" }} onClick={() => onClick(ad)} />
        <div style={{ marginTop: 8, fontWeight: 600 }}>{ad.title}</div>
        <button onClick={() => onClick(ad)} style={ctaBtn} aria-label={ad.cta ?? "Learn more"}>
          {ad.cta ?? "Learn more"}
        </button>
      </div>
    );
  }

  const reason = ("reason" in data) ? (data as any).reason : "NO_FILL";
  const meta: ServeMeta | undefined = ("meta" in data) ? (data as any).meta : undefined;
  return (
    <div className={className} style={boxStyle}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>No ad right now</div>
      <div style={muted}>
        {reason === "PACING_DELAY" && meta?.waitSec ? <>Pacing — retry in ~{meta.waitSec}s</> : null}
        {reason === "USER_PACING" && meta?.waitSec ? <>Please wait ~{meta.waitSec}s</> : null}
        {reason === "USER_CAPPED" ? <>User cap reached</> : null}
        {reason === "CAPPED_24H" ? <>Daily cap reached</> : null}
        {reason === "OUT_OF_RADIUS" ? <>Not in geo radius</> : null}
        {["PACING_DELAY","USER_PACING","USER_CAPPED","CAPPED_24H","OUT_OF_RADIUS","INSUFFICIENT_FUNDS","NO_FILL"].includes(reason) ? null : <>{reason}</>}
      </div>
    </div>
  );
}

const boxStyle: React.CSSProperties = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, maxWidth: 360, background: "#fff" };
const badge: React.CSSProperties = { fontSize: 11, color: "#64748b", marginBottom: 8 };
const ctaBtn: React.CSSProperties = { marginTop: 10, border: "1px solid #93c5fd", background: "#eef2ff", padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontWeight: 600 };
const muted: React.CSSProperties = { color: "#6b7280" };
const err: React.CSSProperties = { color: "#b91c1c" };
