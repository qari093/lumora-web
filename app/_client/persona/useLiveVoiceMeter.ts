"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Stable voice meter:
 * - Returns a number in [0..1] (approx)
 * - Uses AnalyserNode.getFloatTimeDomainData for RMS
 * - Avoids Uint8Array / ArrayBufferLike typing pitfalls
 */
export function useLiveVoiceMeter(enabled: boolean): number {
  const [level, setLevel] = useState(0);

  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Float32Array<ArrayBuffer> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!enabled) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as
          | typeof AudioContext
          | undefined;
        if (!Ctx) return;

        const ctx = new Ctx();
        ctxRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.85;

        source.connect(analyser);
        analyserRef.current = analyser;

        dataRef.current = (new Float32Array(analyser.fftSize) as unknown as Float32Array<ArrayBuffer>);

        const tick = () => {
          if (cancelled) return;

          const a = analyserRef.current;
          const buf = dataRef.current;

          if (!a || !buf) {
            setLevel(0);
          } else {
            a.getFloatTimeDomainData(buf as unknown as Float32Array<ArrayBuffer>);
            let sum = 0;
            for (let i = 0; i < buf.length; i++) {
              const v = buf[i] || 0;
              sum += v * v;
            }
            const rms = Math.sqrt(sum / buf.length); // ~0..1
            const clamped = Math.max(0, Math.min(1, rms * 2.5)); // slightly boosted
            setLevel(clamped);
          }

          rafRef.current = window.requestAnimationFrame(tick);
        };

        rafRef.current = window.requestAnimationFrame(tick);
      } catch {
        setLevel(0);
      }
    }

    function stop() {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (analyserRef.current) analyserRef.current.disconnect();
      analyserRef.current = null;

      if (ctxRef.current) {
        try {
          ctxRef.current.close();
        } catch {}
      }
      ctxRef.current = null;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      streamRef.current = null;

      dataRef.current = null;
      setLevel(0);
    }

    if (enabled) start();
    else stop();

    return () => {
      cancelled = true;
      stop();
    };
  }, [enabled]);

  return level;
}

export default useLiveVoiceMeter;
