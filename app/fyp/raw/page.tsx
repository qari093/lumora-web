"use client";
import React from "react";

export default function FypRawPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 12 }}>FYP Raw — Test File</h1>
      <p style={{ marginBottom: 8, opacity:.8 }}>Direct playback of <code>/videos/test-1.mp4</code>.</p>
      <video
        src="/videos/test-1.mp4"
        poster="/videos/poster.png"
        controls
        autoPlay
        muted
        playsInline
        preload="auto"
        style={{ width:"100%", maxWidth:800, background:"black", borderRadius:8, aspectRatio:"16/9" }}
      >
        <source src="/videos/test-1.mp4" type="video/mp4" />
        Your browser does not support MP4 playback.
      </video>
      <div style={{ marginTop: 12 }}>
        <a href="/fyp" style={{ padding:"8px 12px", borderRadius:8, border:"1px solid #333", textDecoration:"none" }}>← Back to Minimal FYP</a>
      </div>
    </div>
  );
}
