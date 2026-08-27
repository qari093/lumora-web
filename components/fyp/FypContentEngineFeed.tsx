"use client";

import React from "react";
import { useEffect, useState } from "react";
import FypFullPlayer from "./FypFullPlayer";
export type ContentEngineFeedItem = {
  videoId: string;
  src: string;
  thumbnailUrl: string;
  durationMs: number;
  categoryTags: string[];
  resonanceIndex: number;
};
export default function FypContentEngineFeed() {
  const [items, setItems] = useState<ContentEngineFeedItem[]>([]);
  const [feedStatus, setFeedStatus] = useState<"loading" | "ready" | "fallback">("loading");
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/content-engine/feed", { cache: "no-store" });
        const json = await res.json();
        if (!mounted) return;
        if (json?.ok && Array.isArray(json.items) && json.items.length > 0) {
          setItems(json.items);
          setFeedStatus("ready");
        } else {
          setFeedStatus("fallback");
        }
      } catch {
        if (mounted) setFeedStatus("fallback");
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);
  const playerItems = items.map((item) => ({
    id: item.videoId,
    playbackUrl: item.src,
    thumbnailUrl: item.thumbnailUrl,
  }));

  return <FypFullPlayer externalItems={playerItems} />;
}
