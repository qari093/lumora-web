"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FypFullscreenSource } from "@/src/core/fyp/fullscreenSourceFeed";
import { LUMORA_LANES, createTraceSignal, normalizeLane, shouldOfferStoryContinuation, summarizeTrace, type LumoraLane, type TraceSignal } from "@/src/core/fyp/lumoraTrace";
import styles from "./styles.module.css";
import FypShellCleaner from "./FypShellCleaner";

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

function readTrace(): TraceSignal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("lumora.trace.v1");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(-120) : [];
  } catch {
    return [];
  }
}

function writeTrace(signals: TraceSignal[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("lumora.trace.v1", JSON.stringify(signals.slice(-120)));
  } catch {
    return;
  }
}

export default function FypAutoplayFeed({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [selectedLane, setSelectedLane] = useState<LumoraLane>("wonder");
  const [traceSignals, setTraceSignals] = useState<TraceSignal[]>([]);
  const [sparkedIds, setSparkedIds] = useState<Set<string>>(() => new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [deepDiveId, setDeepDiveId] = useState("");
  const [chromeVisible, setChromeVisible] = useState(false);
  const videoRefs = useRef(new Map<string, HTMLVideoElement>());
  const startedAtRef = useRef(new Map<string, number>());
  const sessionIdRef = useRef(`fyp_session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const gestureStartRef = useRef<{ x: number; y: number; at: number } | null>(null);
  const chromeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enhancedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        traceLane: normalizeLane(item.lane)
      })),
    [items]
  );

  const visibleItems = useMemo(() => {
    const matching = enhancedItems.filter((item) => item.traceLane === selectedLane);
    return matching.length >= 3 ? matching : enhancedItems;
  }, [enhancedItems, selectedLane]);

  const itemIds = useMemo(() => visibleItems.map((item) => item.id), [visibleItems]);
  const activeItem = useMemo(() => visibleItems.find((item) => item.id === activeId) || visibleItems[0], [visibleItems, activeId]);
  const traceSummary = useMemo(() => {
    const summary = summarizeTrace(traceSignals);
    const curiosity = Number(summary.curiosityScore);
    return {
      ...summary,
      curiosityScore: Number.isFinite(curiosity) ? curiosity : 0,
      dominantLane: summary.dominantLane || selectedLane
    };
  }, [traceSignals, selectedLane]);
  const storyContinuation = useMemo(
    () => shouldOfferStoryContinuation(traceSignals, activeItem?.traceLane || selectedLane),
    [traceSignals, activeItem, selectedLane]
  );

  const postFypTrackEvent = useCallback((payload: {
    cardId: string;
    event: "impression" | "view" | "watch_progress" | "spark" | "save" | "deep_dive" | "complete" | "skip" | "share";
    watchedMs?: number;
    lane?: string;
    value?: number;
  }) => {
    try {
      void fetch("/api/fyp/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...payload,
          sessionId: sessionIdRef.current,
          userId: "anonymous-user"
        }),
        keepalive: true
      });
    } catch {
      return;
    }
  }, []);

  const revealChrome = useCallback(() => {
    setChromeVisible(true);

    if (chromeTimerRef.current) {
      clearTimeout(chromeTimerRef.current);
    }

    chromeTimerRef.current = setTimeout(() => {
      setChromeVisible(false);
    }, 3000);
  }, []);

  const moveToRelativeCard = useCallback((direction: 1 | -1) => {
    const currentIndex = itemIds.indexOf(activeId);
    const nextIndex = Math.max(0, Math.min(itemIds.length - 1, currentIndex + direction));
    const nextId = itemIds[nextIndex];

    if (!nextId || nextId === activeId) return;

    setActiveId(nextId);

    const target = document.querySelector<HTMLElement>(`[data-fyp-video-id="${nextId}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [activeId, itemIds]);

  const openContextPanel = useCallback((itemId: string) => {
    const item = visibleItems.find((candidate) => candidate.id === itemId);
    if (!item) return;

    setDeepDiveId(item.id);
    postFypTrackEvent({
      cardId: item.id,
      event: "deep_dive",
      watchedMs: Date.now() - (startedAtRef.current.get(item.id) || Date.now()),
      lane: item.traceLane,
      value: 0.8
    });
  }, [visibleItems, postFypTrackEvent]);

  const handleTraceGestureStart = useCallback((event: React.PointerEvent<HTMLElement>) => {
    gestureStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      at: Date.now()
    };
  }, []);

  const handleTraceGestureEnd = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const start = gestureStartRef.current;
    gestureStartRef.current = null;

    revealChrome();

    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const elapsed = Date.now() - start.at;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (elapsed > 900 || Math.max(absX, absY) < 46) return;

    if (absX > absY) {
      moveToRelativeCard(dx < 0 ? 1 : -1);
      return;
    }

    if (dy < 0) {
      const item = visibleItems.find((candidate) => candidate.id === activeId);
      if (item) {
        setDeepDiveId(item.id);
        postFypTrackEvent({
          cardId: item.id,
          event: "deep_dive",
          watchedMs: Date.now() - (startedAtRef.current.get(item.id) || Date.now()),
          lane: item.traceLane,
          value: 0.8
        });
      }
      return;
    }

    openContextPanel(activeId);
  }, [activeId, moveToRelativeCard, openContextPanel, visibleItems, postFypTrackEvent, revealChrome]);


  const appendTrace = useCallback((signal: TraceSignal) => {
    setTraceSignals((current) => {
      const next = [...current, signal].slice(-120);
      writeTrace(next);
      return next;
    });

    postFypTrackEvent({
      cardId: signal.videoId,
      event: signal.saved ? "save" : signal.sparked ? "spark" : signal.deepDive ? "deep_dive" : signal.completed ? "complete" : "watch_progress",
      watchedMs: signal.watchedMs,
      lane: signal.lane,
      value: signal.completed ? 1 : signal.saved || signal.sparked || signal.deepDive ? 0.85 : 0.5
    });
  }, [postFypTrackEvent]);

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

  const toggleSpark = useCallback((item: FypFullscreenSource & { traceLane: LumoraLane }) => {
    setSparkedIds((current) => {
      const next = new Set(current);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });

    appendTrace(createTraceSignal({
      videoId: item.id,
      lane: item.traceLane,
      watchedMs: Date.now() - (startedAtRef.current.get(item.id) || Date.now()),
      sparked: true
    }));
  }, [appendTrace]);

  const saveToSparkBoard = useCallback((item: FypFullscreenSource & { traceLane: LumoraLane }) => {
    setSavedIds((current) => new Set(current).add(item.id));
    appendTrace(createTraceSignal({
      videoId: item.id,
      lane: item.traceLane,
      watchedMs: Date.now() - (startedAtRef.current.get(item.id) || Date.now()),
      saved: true
    }));
  }, [appendTrace]);

  const openDeepDive = useCallback((item: FypFullscreenSource & { traceLane: LumoraLane }) => {
    setDeepDiveId(item.id);
    appendTrace(createTraceSignal({
      videoId: item.id,
      lane: item.traceLane,
      watchedMs: Date.now() - (startedAtRef.current.get(item.id) || Date.now()),
      deepDive: true
    }));
  }, [appendTrace]);

  useEffect(() => {
    setTraceSignals(readTrace());
  }, []);

  useEffect(() => {
    if (!visibleItems.some((item) => item.id === activeId)) {
      setActiveId(visibleItems[0]?.id ?? "");
    }
  }, [visibleItems, activeId]);

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
      { threshold: [0.55, 0.65, 0.75, 0.9] }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [itemIds]);

  useEffect(() => {
    for (const [id, video] of videoRefs.current.entries()) {
      if (id === activeId) {
        if (!startedAtRef.current.has(id)) {
          startedAtRef.current.set(id, Date.now());
          const item = visibleItems.find((candidate) => candidate.id === id);
          postFypTrackEvent({
            cardId: id,
            event: "impression",
            watchedMs: 0,
            lane: item?.traceLane,
            value: 0.25
          });
        }
        safePlay(video);
        postFypTrackEvent({
          cardId: id,
          event: "view",
          watchedMs: 0,
          lane: visibleItems.find((candidate) => candidate.id === id)?.traceLane,
          value: 0.5
        });
      } else {
        pauseVideo(video);
      }
    }

    const activeIndex = itemIds.indexOf(activeId);
    itemIds.slice(activeIndex + 1, activeIndex + 3).forEach((id) => {
      const video = videoRefs.current.get(id);
      if (video) video.load();
    });

    return () => {
      const item = visibleItems.find((candidate) => candidate.id === activeId);
      const started = startedAtRef.current.get(activeId);
      if (item && started) {
        const watchedMs = Date.now() - started;
        if (watchedMs > 2500) {
          appendTrace(createTraceSignal({
            videoId: item.id,
            lane: item.traceLane,
            watchedMs,
            completed: watchedMs > 7000
          }));
        }
      }
    };
  }, [activeId, itemIds, visibleItems, appendTrace, postFypTrackEvent]);

  return (
    <main className={`${styles.shell} ${styles.fullScreenFypRoot}`} data-fyp-runtime="fullscreen-native-autoplay" data-depthfeed-runtime="lumora-depthfeed-trace" data-depthfeed-emotional-lanes="Wonder Learn Laugh Build Explore">
      <FypShellCleaner />
      <div className={styles.tiktokFrame}>
        <header className={styles.depthTop}>
          <button
            type="button"
            className={styles.activeLaneChip}
            onClick={revealChrome}
            aria-label={`Current lane: ${selectedLane}`}
          >
            {LUMORA_LANES.find((lane) => lane.key === selectedLane)?.label ?? "Flow"}
          </button>
          <nav className={styles.laneSwitch} data-visible={chromeVisible} aria-label="Lumora emotional lanes">
            {LUMORA_LANES.map((lane) => (
              <button
                key={lane.key}
                type="button"
                data-lumora-lane={lane.key}
                data-active={selectedLane === lane.key}
                onClick={() => {
                  setSelectedLane(lane.key);
                  revealChrome();
                }}
                title={lane.intent}
              >
                {lane.label}
              </button>
            ))}
          </nav>
          <div className={styles.tracePromise} aria-hidden="true">Trace Current</div>
        </header>

        <section className={styles.fullscreenFeed} aria-label="Lumora DepthFeed fullscreen native autoplay feed">
          {visibleItems.map((item) => {
            const active = item.id === activeId;
            const sparkActive = sparkedIds.has(item.id);
            const savedActive = savedIds.has(item.id);

            return (
              <article
                key={item.id}
                onPointerDown={handleTraceGestureStart}
                onPointerUp={handleTraceGestureEnd}
                data-fyp-fullscreen-card="true"
                data-fyp-video-id={item.id}
                data-lumora-depth-card="true"
                data-lumora-lane-card={item.traceLane}
                data-chrome-visible={chromeVisible}
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
                  onClick={(event) => {
                    const video = event.currentTarget;
                    revealChrome();
                    if (video.paused) safePlay(video);
                    else video.pause();
                  }}
                  onDoubleClick={() => toggleSpark(item)}
                />

                <div className={styles.videoShade} />

                <aside className={styles.retentionRing} aria-label="Lumora retention ring lite">
                  <div className={styles.ringProgress} data-active={active}>
                    <span>{active ? "LIVE" : "NEXT"}</span>
                  </div>
                  <button type="button" aria-label="Spark" data-active={sparkActive} onClick={() => toggleSpark(item)}>
                    💎<small>{sparkActive ? "Sparked" : item.likes}</small>
                  </button>
                  <button type="button" aria-label="Deep Dive" onClick={() => openDeepDive(item)}>
                    ◌<small>Deep</small>
                  </button>
                  <button type="button" aria-label="Save to SparkBoard" data-active={savedActive} onClick={() => saveToSparkBoard(item)}>
                    ▣<small>{savedActive ? "Saved" : "Board"}</small>
                  </button>
                  <button type="button" aria-label="Share">
                    ↗️<small>{item.shares}</small>
                  </button>
                </aside>

                <section className={styles.creatorStrip} aria-label="Creator and tags">
                  <strong>@{item.handle.replace(/^@/, "")}</strong>
                  <span>#{item.traceLane} #lumora</span>
                </section>

                {deepDiveId === item.id ? (
                  <section className={styles.deepDivePanel} aria-label="Deep Dive">
                    <strong>Deep Dive</strong>
                    <span>Follow this trace through related sources, story context, and creator intent.</span>
                    <button type="button" onClick={() => setDeepDiveId("")}>Close</button>
                  </section>
                ) : null}
              </article>
            );
          })}
        </section>

        <section className={styles.traceDock} aria-label="Lumora Trace summary">
          <div>
            <span>Curiosity</span>
            <strong>{Number.isFinite(Number(traceSummary.curiosityScore)) ? traceSummary.curiosityScore : 0}</strong>
          </div>
          <div>
            <span>Active Pulse</span>
            <strong>{Math.max(18, visibleItems.length * 3)}</strong>
          </div>
          <div>
            <span>Dominant Trace</span>
            <strong>{traceSummary.dominantLane}</strong>
          </div>
          {storyContinuation ? <button type="button">Continue this journey?</button> : <button type="button">Build my Trace</button>}
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
