"use client";
import React from "react";
import InFeedAd from "@/components/ads/InFeedAd";
import fs from "fs";
import path from "path";

type Video = { slug: string; title: string; duration: number; category: string };

export default function VideosPage() {
  const [videos, setVideos] = React.useState<Video[]>([]);

  React.useEffect(() => {
    fetch("/videos/index.json")
      .then(r => r.json())
      .then(setVideos)
      .catch(() => setVideos([]));
  }, []);

  const ads = ["/ads/burger.png","/ads/energy.png","/ads/boots.png","/ads/hoodie.png"];

  return (
    <div style={{ padding: 20 }}>
      <h1>Lumora — Auto Videos with Holographic Ads</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, marginTop: 20 }}>
        {videos.map(v => {
          const ad = ads[Math.floor(Math.random()*ads.length)];
          return (
            <div key={v.slug} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10, background: "#fafafa", position: "relative" }}>
              <video src={`/videos/${v.slug}.mp4`} controls style={{ width: "100%", borderRadius: 6, background: "black" }} />
              <img src={ad} alt="ad" style={{ position: "absolute", top: 12, right: 12, width: 64, height: 64, pointerEvents: "none" }} />
              <button style={{ marginTop: 8, background: "gold", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}>
                👆 Buy Now
              </button>
              <div style={{ marginTop: 6, fontWeight: "bold" }}>{v.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>⏱ {v.duration}s • #{v.category}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
