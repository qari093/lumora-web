"use client";

import { useEffect, useState } from "react";

type FeedItem = {
  id?: string;
  kind?: string;
  title?: string;
  adId?: string;
};

export default function FypFeedClient() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/fyp", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;

        if (!data || !Array.isArray(data.feed)) {
          setError("invalid_fyp_feed");
          return;
        }

        setFeed(data.feed);
      })
      .catch(() => {
        if (!mounted) return;
        setError("fyp_fetch_failed");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section data-fyp-feed="live">
      {error ? (
        <div data-fyp-error={error}>FYP unavailable</div>
      ) : null}

      {feed.map((item, i) => (
        <div
          key={i}
          data-fyp-item-kind={item.kind ?? "unknown"}
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.6 }}>
            {item.kind === "sponsored" ? "Sponsored" : "Content"}
          </div>

          {item.adId ? (
            <div data-fyp-ad-id={item.adId}>Ad: {item.adId}</div>
          ) : null}

          <div>{item.title ?? "Untitled item"}</div>
        </div>
      ))}
    </section>
  );
}
