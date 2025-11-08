'use client';
import HudOff from "@/app/_client/hud-off";
import React from 'react';

export default function OfflineVideoDemo() {
  const src = '/demo/media/seg-0001.ts'; // tiny placeholder; cached via Media Cache chip
  const box: React.CSSProperties = { maxWidth: 880, margin: '60px auto', padding: 16 };
  const note: React.CSSProperties = { opacity: .8, fontSize: 14, marginTop: 10, lineHeight: 1.5 };

  return (
    <main style={{ minHeight: '100vh', padding: 16 }}>
      <HudOff />
      <div style={box}>
        <h1 style={{ margin: 0 }}>Offline Video Demo</h1>
        <p style={note}>
          Use the “Media Cache” chip → Demo Prefetch, then go offline and press Play.
          This page ensures a working route without 404.
        </p>
        <video controls playsInline style={{ width: '100%', borderRadius: 8, background: '#000' }} src={src} />
        <p style={note}>
          If <code>.ts</code> doesn’t play in your browser, the route still loads; verify caching in
          DevTools → Application → Cache Storage.
        </p>
      </div>
    </main>
  );
}
