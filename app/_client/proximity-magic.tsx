"use client";
import { useEffect, useRef, useState } from "react";

type PingReply = {
  ok: boolean;
  cellId?: string;
  center?: { lat: number; lng: number };
  radiusKm?: number;
  nextPingSec?: number;
  nearby?: { vendors: any[]; campaigns: any[] };
  error?: string;
};

function badgeStyle(status: "init" | "on" | "denied"): React.CSSProperties {
  const bg =
    status === "on" ? "rgba(40,180,120,0.70)" : status === "denied" ? "rgba(200,70,70,0.75)" : "rgba(40,40,55,0.70)";
  return {
    position: "fixed",
    right: 14,
    bottom: 130,
    zIndex: 9997,
    background: bg,
    color: "#fff",
    padding: "8px 10px",
    borderRadius: 10,
    font: "600 12px/1.2 system-ui",
    boxShadow: "0 6px 22px rgba(0,0,0,.35)",
    backdropFilter: "blur(6px)",
  };
}

export default function ProximityMagic() {
  const [status, setStatus] = useState<"init" | "on" | "denied">("init");
  const [text, setText] = useState("init");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function ping(lat: number, lng: number, accuracy?: number, radiusKm = 50) {
      try {
        const res = await fetch("/api/proximity/ping", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ lat, lng, accuracy, radiusKm }),
          cache: "no-store",
        });
        const data: PingReply = await res.json();
        if (cancelled) return;

        if (data.ok) {
          setStatus("on");
          const radius = data.radiusKm ?? 50;
          setText(`on • ${radius}km • ${data.cellId}`);
          const wait = Math.max(10, Math.min(120, data.nextPingSec ?? 60));
          if (timerRef.current) window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => requestGeo(false), wait * 1000);
        } else {
          setStatus("denied");
          setText(data.error || "error");
        }
      } catch (e: any) {
        setStatus("denied");
        setText("network");
      }
    }

    function requestGeo(first = true) {
      if (!("geolocation" in navigator)) {
        setStatus("denied");
        setText("no-geo");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          localStorage.setItem("lumora_geo_consent", "granted");
          ping(latitude, longitude, accuracy);
        },
        (err) => {
          localStorage.setItem("lumora_geo_consent", "denied");
          setStatus("denied");
          setText(err?.code === 1 ? "denied" : "error");
          if (!first) {
            // back off retry
            if (timerRef.current) window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => requestGeo(false), 60000);
          }
        },
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 7000 }
      );
    }

    const saved = localStorage.getItem("lumora_geo_consent");
    if (saved === "granted") {
      requestGeo(true);
    } else if (saved === "denied") {
      setStatus("denied");
      setText("denied");
    } else {
      // first time: try once (browser will prompt)
      requestGeo(true);
    }

    return () => {
      cancelled = true;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div style={badgeStyle(status)} title="Proximity Magic Engine">
      {"Geo: "}{text}
    </div>
  );
}
