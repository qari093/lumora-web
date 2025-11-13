"use client";

import { useEffect, useRef } from "react";

type GestureSampleType = "pointer-move" | "pointer-down" | "pointer-up" | "scroll";

interface GestureSample {
  t: number;
  x: number;
  y: number;
  type: GestureSampleType;
}

export interface GestureLoggerProps {
  enabled?: boolean;
  maxBuffer?: number;
  flushIntervalMs?: number;
  onFlush?: (samples: GestureSample[]) => void;
}

const DEFAULT_MAX_BUFFER = 256;
const DEFAULT_FLUSH_INTERVAL = 5_000;

export function GestureLogger(props: GestureLoggerProps = {}) {
  const {
    enabled = true,
    maxBuffer = DEFAULT_MAX_BUFFER,
    flushIntervalMs = DEFAULT_FLUSH_INTERVAL,
    onFlush,
  } = props;

  const bufferRef = useRef<GestureSample[]>([]);
  const enabledRef = useRef<boolean>(enabled);
  const flushRef = useRef<(force?: boolean) => void>(() => {});

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    flushRef.current = (force?: boolean) => {
      const buf = bufferRef.current;
      if (!buf.length) return;
      const copy = buf.slice();
      bufferRef.current = [];
      if (onFlush) {
        onFlush(copy);
      } else if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.debug("[GestureLogger] flush", copy.length, "samples", force ? "(forced)" : "");
      }
    };
  }, [onFlush]);

  useEffect(() => {
    if (!enabledRef.current) return;

    const handlePointer = (ev: PointerEvent, type: GestureSampleType) => {
      if (!enabledRef.current) return;
      const sample: GestureSample = {
        t: Date.now(),
        x: ev.clientX,
        y: ev.clientY,
        type,
      };
      const buf = bufferRef.current;
      buf.push(sample);
      if (buf.length >= maxBuffer) {
        flushRef.current(true);
      }
    };

    const handleMove = (ev: PointerEvent) => handlePointer(ev, "pointer-move");
    const handleDown = (ev: PointerEvent) => handlePointer(ev, "pointer-down");
    const handleUp = (ev: PointerEvent) => handlePointer(ev, "pointer-up");

    const handleScroll = () => {
      if (!enabledRef.current) return;
      const sample: GestureSample = {
        t: Date.now(),
        x: window.scrollX,
        y: window.scrollY,
        type: "scroll",
      };
      const buf = bufferRef.current;
      buf.push(sample);
      if (buf.length >= maxBuffer) {
        flushRef.current(true);
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const intervalId = window.setInterval(() => flushRef.current(false), flushIntervalMs);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("scroll", handleScroll);
      window.clearInterval(intervalId);
    };
  }, [maxBuffer, flushIntervalMs]);

  return null;
}

export default GestureLogger;