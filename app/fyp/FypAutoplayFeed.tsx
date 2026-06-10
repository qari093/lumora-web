"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import type { LumoraYoutubeFeedItem } from "@/src/core/fyp/youtubeFeed";

type Props = {
  videos: LumoraYoutubeFeedItem[];
  itemCount: number;
};

function getVideoId(item: LumoraYoutubeFeedItem): string {
  const url = item.youtubeWatchUrl || "";
  const match = url.match(/[?&]v=([^&]+)/);
  return match?.[1] || item.id;
}

function getAutoplayEmbedUrl(item: LumoraYoutubeFeedItem): string {
  const videoId = getVideoId(item);
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    controls: "1",
    rel: "0",
    modestbranding: "1",
    enablejsapi: "1",
    origin: typeof window !== "undefined" ? window.location.origin : "https://lumoraverse.io"
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export default function FypAutoplayFeed({ videos, itemCount }: Props) {
  const [activeId, setActiveId] = useState(videos[0]?.id ?? "");
  const [userTouched, setUserTouched] = useState(false);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const activeIndex = useMemo(
    () => videos.findIndex((video) => video.id === activeId),
    [activeId, videos]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        const id = visible?.target.getAttribute("data-fyp-video-id");
        if (id) setActiveId(id);
      },
      {
        threshold: [0.55, 0.68, 0.8],
        rootMargin: "-12% 0px -22% 0px"
      }
    );

    for (const video of videos) {
      const node = cardRefs.current[video.id];
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [videos]);

  return (
    <main
      className={styles.shell}
      onTouchStart={() => setUserTouched(true)}
      onClick={() => setUserTouched(true)}
    >
      <div className={styles.appFrame}>
        <header className={styles.topBar}>
          <div className={styles.titleRow}>
            <Link href="/" className={styles.backButton} aria-label="Back">‹</Link>
            <div className={styles.brandBlock}>
              <h1 className={styles.brand}>Lumora FYP</h1>
              <p className={styles.sub}>{itemCount} auto-play source cards · muted safe mode</p>
            </div>
            <button className={styles.followButton}>Follow</button>
            <button className={styles.moreButton} aria-label="More">•••</button>
          </div>

          <nav className={styles.tabs} aria-label="FYP sections">
            <span className={styles.tabActive}>For You</span>
            <span>Sources</span>
            <span>Videos</span>
            <span>Saved</span>
          </nav>
        </header>

        <section className={styles.feed} aria-label="Auto-play multi-source FYP feed">
          {videos.map((video, index) => {
            const isActive = video.id === activeId;
            const shouldWarm = Math.abs(index - activeIndex) <= 1;
            const shouldRenderPlayer = isActive || shouldWarm;

            return (
              <article
                key={video.id}
                ref={(node) => {
                  cardRefs.current[video.id] = node;
                }}
                data-fyp-video-id={video.id}
                className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
              >
                <div className={styles.authorRow}>
                  <img className={styles.avatar} src={video.avatarUrl} alt={`${video.channelTitle} avatar`} />

                  <div className={styles.meta}>
                    <div className={styles.nameLine}>
                      <span className={styles.name}>{video.channelTitle}</span>
                      <span className={styles.handle}>{video.channelHandle} · {video.publishedAt}</span>
                    </div>

                    <p className={styles.caption}>{video.title}</p>

                    <div className={styles.playerShell}>
                      {shouldRenderPlayer ? (
                        <iframe
                          className={styles.videoFrame}
                          src={isActive ? getAutoplayEmbedUrl(video) : video.youtubeEmbedUrl}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading={isActive ? "eager" : "lazy"}
                        />
                      ) : (
                        <img className={styles.thumb} src={video.thumbnailUrl} alt={video.title} loading="lazy" />
                      )}

                      {!isActive && (
                        <span className={styles.play}>
                          <span className={styles.playIcon}>▶️</span>
                        </span>
                      )}

                      <span className={styles.duration}>{video.duration}</span>
                    </div>

                    <div className={styles.youtube}>
                      <span className={styles.youtubeBadge}>{isActive ? "●" : "▶️"}</span>
                      <span>{video.sourceLabel}</span>
                      <span className={styles.autoplayState}>
                        {isActive ? "Auto-playing muted" : "Ready"}
                      </span>
                    </div>

                    <div className={styles.actions} aria-label="Video actions">
                      <span className={styles.action}>💬 {video.comments}</span>
                      <span className={styles.action}>↻ {video.reposts}</span>
                      <span className={styles.action}>♡ {video.likes}</span>
                      <a className={styles.action} href={video.youtubeWatchUrl} target="_blank" rel="noopener noreferrer">Open</a>
                      <span className={styles.action}>⇧</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <p className={styles.safeNote}>
          Auto-play is muted and inline for mobile safety. Some external providers may still block instant playback until their real direct adapters are connected.
          {userTouched ? " Touch permission detected." : " Tap once anywhere if iPhone delays playback."}
        </p>

        <button className={styles.fab} aria-label="Create">+</button>

        <nav className={styles.bottomNav} aria-label="Main portal navigation">
          <Link href="/" className={styles.navItem}><span className={styles.navIcon}>⌂</span><span>Home</span></Link>
          <Link href="/fyp" className={styles.navItem}><span className={styles.navIcon}>⌕</span><span>FYP</span></Link>
          <Link href="/gmar" className={styles.navItem}><span className={styles.navIcon}>◈</span><span>GMAR</span></Link>
          <Link href="/live" className={styles.navItem}><span className={styles.navIcon}>🔔</span><span>Live</span></Link>
          <Link href="/profile" className={styles.navItem}><span className={styles.navIcon}>◯</span><span>Profile</span></Link>
        </nav>
      </div>
    </main>
  );
}
