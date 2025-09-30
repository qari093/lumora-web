'use client';
import React, { useEffect, useRef, useState } from 'react';

// Load videos from manifest.json (local fallback if fetch fails)
async function loadVideos() {
  try {
    const res = await fetch('/videos/manifest.json');
    if (!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    return json.items || [];
  } catch {
    return [
      { id:'w1', title:'Warmup', url:'/videos/workout.mp4', durationHintSec:600 }
    ];
  }
}

export default function Arena() {
  const [playlist,setPlaylist] = useState<any[]>([]);
  const [current,setCurrent]   = useState<any|null>(null);
  const videoRef = useRef<HTMLVideoElement|null>(null);

  useEffect(()=>{
    (async()=>{
      const vids = await loadVideos();
      setPlaylist(vids);
      setCurrent(vids[0] || null);
    })();
  },[]);

  // when video ends, go to next in playlist
  function handleEnded(){
    if(!playlist.length) return;
    const idx = playlist.findIndex(v=>v.id===current?.id);
    const next = playlist[(idx+1) % playlist.length];
    setCurrent(next);
    setTimeout(()=>videoRef.current?.play().catch(()=>{}),0);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8"
      style={{fontFamily:'ui-sans-serif,system-ui',color:'#e5e7eb',background:'#0a0a0a',minHeight:'100vh'}}>
      <h1 className="text-2xl font-semibold">🏟️ NEXA TV — Continuous Workout Channel</h1>

      <div className="mt-6 rounded-2xl overflow-hidden relative"
        style={{border:'1px solid #27272a',background:'#000'}}>
        {current && (
          <video
            ref={videoRef}
            key={current.id}
            src={current.url}
            controls
            playsInline
            autoPlay
            onEnded={handleEnded}
            className="w-full h-[360px]"
          />
        )}
        {/* NEXA Logo overlay */}
        <img src="/brand/nexa-tv.png" onError={(e)=>{(e.currentTarget as any).src='/brand/nexa-tv.svg'}}
          alt="NEXA TV" style={{position:'absolute',top:12,left:12,width:120,opacity:.9,pointerEvents:'none'}} />

        {/* Placeholder holographic ad overlay */}
        <div className="absolute bottom-4 right-4 bg-indigo-600/80 text-white text-sm px-3 py-2 rounded-lg">
          Holographic Ad Slot ✦
        </div>
      </div>

      <div className="text-xs opacity-70 mt-3">
        Playing: {current?.title || '—'} • Videos auto-rotate from <code>/public/videos/manifest.json</code>
      </div>
    </main>
  );
}
