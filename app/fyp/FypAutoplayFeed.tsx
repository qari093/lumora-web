"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import type { FypFullscreenSourceItem } from "@/src/core/fyp/fullscreenSourceFeed";

type Props = {
  videos: FypFullscreenSourceItem[];
  itemCount: number;
};

export default function FypAutoplayFeed({ videos, itemCount }: Props) {
  const [activeId, setActiveId] = useState(videos[0]?.id ?? "");
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const activeIndex = useMemo(
    () => Math.max(0, videos.findIndex((video) => video.id === activeId)),
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
        threshold: [0.62, 0.76, 0.9],
        rootMargin: "-8% 0px -18% 0px"
      }
    );

    for (const video of videos) {
      const node = cardRefs.current[video.id];
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [videos]);

  useEffect(() => {
    for (const [id, node] of Object.entries(videoRefs.current)) {
      if (!node) continue;

      if (id === activeId) {
        node.muted = true;
        node.playsInline = true;
        const playPromise = node.play();
        if (playPromise) playPromise.catch(() => {});
      } else {
        node.pause();
      }
    }
  }, [activeId]);

  return (
    <main className={`${styles.shell} ${styles.fullScreenFypRoot}`}>
      <div className={styles.tiktokFrame}>
        <header className={styles.tiktokTop}>
          <div className={styles.topTabs}>
            <Link href="/" className={styles.liveMini}>‹</Link>
            <span>Explore</span>
            <span>Hot</span>
            <span>Following</span>
            <span>Shop</span>
            <strong>For You</strong>
            <span className={styles.searchIcon}>⌕</span>
          </div>
          <div className={styles.topMeta}>{itemCount} sources · native muted autoplay</div>
        </header>

        <section className={styles.fullscreenFeed} aria-label="Full-screen native autoplay FYP feed">
          {videos.map((video, index) => {
            const isActive = video.id === activeId;
            const isNear = Math.abs(index - activeIndex) <= 1;

            return (
              <article
                key={video.id}
                ref={(node) => {
                  cardRefs.current[video.id] = node;
                }}
                data-fyp-video-id={video.id}
                className={styles.fullscreenCard}
              >
                <video
                  ref={(node) => {
                    videoRefs.current[video.id] = node;
                  }}
                  className={styles.fullscreenVideo}
                  src={video.videoUrl}
                  poster={video.posterUrl}
                  muted
                  playsInline
                  loop
                  preload={isNear ? "auto" : "metadata"}
                  controls={false}
                />

                <div className={styles.videoShade} />

                <div className={styles.rightRail}>
                  <button className={styles.avatarRing} aria-label={video.sourceName}>
                    <img src={video.posterUrl} alt="" />
                    <span>+</span>
                  </button>
                  <button>♡<small>{video.likes}</small></button>
                  <button>💬<small>{video.comments}</small></button>
                  <button>▣<small>{video.saves}</small></button>
                  <button>↗️<small>{video.shares}</small></button>
                  <button className={styles.disc}>◉</button>
                </div>

                <div className={styles.videoInfo}>
                  <p className={styles.sourceLine}>
                    <strong>{video.sourceName}</strong>
                    <span>{video.handle}</span>
                    <span>{video.safety.replaceAll("_", " ")}</span>
                  </p>
                  <h2>{video.title}</h2>
                  <p className={styles.laneLine}>
                    {video.lane} · {isActive ? "Auto-playing muted" : "Ready"}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <nav className={styles.tiktokBottom} aria-label="FYP mobile navigation">
          <Link href="/">⌂<span>Home</span></Link>
          <Link href="/fyp">⌕<span>FYP</span></Link>
          <Link href="/gmar" className={styles.centerPlus}>+</Link>
          <Link href="/live">▣<span>Live</span></Link>
          <Link href="/profile">○<span>Profile</span></Link>
        </nav>
      </div>
    </main>
  );
}
