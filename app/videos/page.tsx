"use client";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type Video = { id: number; title: string; src: string };

const mockVideos: Video[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `Sample Video ${i + 1}`,
  src: `/videos/test-1.mp4`
}));

export default function VideosPage() {
  const [items, setItems] = useState<Video[]>(mockVideos.slice(0, 10));

  const fetchMore = () => {
    const next = mockVideos.slice(items.length, items.length + 10);
    setItems(prev => [...prev, ...next]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 12 }}>🎥 Lumora Video Feed</h1>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMore}
        hasMore={items.length < mockVideos.length}
        loader={<p>Loading...</p>}
        endMessage={<p>✅ You have seen it all!</p>}
      >
        {items.map(v => (
          <div key={v.id} style={{ marginBottom: 20 }}>
            <video
              src={v.src}
              controls
              style={{ width: "100%", borderRadius: 8, background: "black" }}
            />
            <p>{v.title}</p>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
