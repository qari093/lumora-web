"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FypFullscreenSource } from "@/src/core/fyp/fullscreenSourceFeed";
import styles from "./styles.module.css";

type Props = {
  items: FypFullscreenSource[];
};

function safePlay(video: HTMLVideoElement) {
  video.muted = true;
  video.playsInline = true;
  const promise = video.play();
  if (promise && typeof promise.catch === "function") {
    promise.catch(() => undefined);
  }
}

function pauseVideo(video: HTMLVideoElement) {
  video.pause();
}

export default function FypAutoplayFeed({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const videoRefs = useRef(new Map<string, HTMLVideoElement>());
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  const registerVideo = useCallback((id: string, node: HTMLVideoElement | null) => {
    if (!node) {
      videoRefs.current.delete(id);
      return;
    }

    node.muted = true;
    node.playsInline = true;
    node.preload = "auto";
    videoRefs.current.set(id, node);
  }, []);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-fyp-fullscreen-card]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const winner = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        const nextId = winner?.target.getAttribute("data-fyp-video-id");
        if (nextId) setActiveId(nextId);
      },
      {
        threshold: [0.55, 0.65, 0.75, 0.9]
      }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [itemIds]);

  useEffect(() => {
    for (const [id, video] of videoRefs.current.entries()) {
      if (id === activeId) {
        safePlay(video);
      } else {
        pauseVideo(video);
      }
    }

    const activeIndex = itemIds.indexOf(activeId);
    const preloadIds = itemIds.slice(activeIndex + 1, activeIndex + 3);

    preloadIds.forEach((id) => {
      const video = videoRefs.current.get(id);
      if (video) video.load();
    });
  }, [activeId, itemIds]);

  return (
    <main className={`${styles.shell} ${styles.fullScreenFypRoot}`} data-fyp-runtime="fullscreen-native-autoplay">
      <div className={styles.tiktokFrame}>
        <header className={styles.tiktokTop}>
          <nav className={styles.topTabs} aria-label="FYP discovery tabs">
            <a className={styles.liveMini} href="/" aria-label="Back">‹</a>
            <strong>For You</strong>
            <span className={styles.searchIcon}>⌕</span>
          </nav>
          <div className={styles.topMeta}>{items.length} sources · native muted autoplay</div>
        </header>

        <section className={styles.fullscreenFeed} aria-label="Full-screen native autoplay FYP feed">
          {items.map((item) => {
            const active = item.id === activeId;

            return (
              <article
                key={item.id}
                data-fyp-fullscreen-card="true"
                data-fyp-video-id={item.id}
                className={styles.fullscreenCard}
              >
                <video
                  ref={(node) => registerVideo(item.id, node)}
                  autoPlay
                  className={styles.fullscreenVideo}
                  src={item.videoUrl}
                  poster={item.posterUrl}
                  muted
                  playsInline
                  loop
                  preload="auto"
                  aria-label={item.title}
                />

                <div className={styles.videoShade} />

                <aside className={styles.rightRail} aria-label="Video actions">
                  <button className={styles.avatarRing} aria-label={`Follow ${item.sourceName}`}>
                    <img src={item.posterUrl} alt="" />
                    <span>+</span>
                  </button>
                  <button aria-label="Like">♡<small>{item.likes}</small></button>
                  <button aria-label="Comment">💬<small>{item.comments}</small></button>
                  <button aria-label="Save">▣<small>{item.saves}</small></button>
                  <button aria-label="Share">↗️<small>{item.shares}</small></button>
                  <button className={styles.disc} aria-label="Audio">◉</button>
                </aside>
          <section className={styles.creatorStrip} aria-label="Creator and tags">
            <strong>@{item.handle.replace(/^@/, "")}</strong>
            <span>#{item.lane} #lumora</span>
          </section>
              </article>
            );
          })}
        </section>

        <nav className={styles.tiktokBottom} aria-label="Main navigation">
          <a href="/"><span>⌂</span><strong>Home</strong></a>
          <a href="/fyp"><span>⌕</span><strong>FYP</strong></a>
          <a className={styles.createButton} href="/create" aria-label="Create">+</a>
          <a href="/live"><span>▣</span><strong>Live</strong></a>
          <a href="/profile"><span>○</span><strong>Profile</strong></a>
        </nav>
      </div>
    </main>
  );
}
