// Step 4.1 — RecorderEngine component placeholder
// components/lumaspace/RecorderEngine.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type RecorderEngineStatus =
  | "idle"
  | "unsupported"
  | "initializing"
  | "recording"
  | "stopping"
  | "error";

export type RecorderEngineMode = "browser" | "mock";

export interface RecorderSnapshot {
  /** Elapsed seconds since recording started (approximate) */
  elapsedSec: number;
  /** Whether we hit the configured max duration */
  hitMaxDuration: boolean;
}

export interface RecorderResult extends RecorderSnapshot {
  /** Optional Blob of audio/video data (mock mode will omit this) */
  blob?: Blob;
  /** Object URL created from the Blob (if any) */
  url?: string;
}

export interface RecorderEngineCallbacks {
  onStart?(snapshot: RecorderSnapshot): void;
  onStop?(result: RecorderResult): void;
  onError?(error: Error): void;
  onStatusChange?(status: RecorderEngineStatus): void;
}

export interface RecorderEngineProps extends RecorderEngineCallbacks {
  /**
   * Mode:
   * - "browser": use MediaRecorder + getUserMedia when available
   * - "mock": no real recording; useful for tests and storybook
   */
  mode?: RecorderEngineMode;
  /** Maximum recording duration in seconds (auto-stop). Default: 300 (5 minutes). */
  maxDurationSec?: number;
  /** Interval at which elapsed time updates, in ms. Default: 500ms. */
  tickIntervalMs?: number;
  /** Automatically start when component mounts (only if supported). */
  autoStart?: boolean;
  /** Render built-in controls (start/stop + status). Default: true. */
  autoRenderControls?: boolean;
  /** Optional label suffix for debugging (e.g., "memory-palace"). */
  debugTag?: string;
  /** Optional className for the outer wrapper. */
  className?: string;
  /**
   * Custom UI renderer. If provided, takes precedence over autoRenderControls.
   * Use this to render your own buttons and consume render props.
   */
  children?:
    | ((
        renderProps: RecorderRenderProps,
      ) => React.ReactNode)
    | undefined;
}

export interface RecorderRenderProps {
  status: RecorderEngineStatus;
  elapsedSec: number;
  isSupported: boolean;
  canStart: boolean;
  canStop: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

type MediaRecorderLike = MediaRecorder & {
  // allow minimal structural typing if polyfilled
};

function getSupport(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & {
    mediaDevices?: MediaDevices;
  };
  return !!(nav.mediaDevices && typeof window.MediaRecorder !== "undefined");
}

/**
 * LumaSpace RecorderEngine
 *
 * - Encapsulates recording lifecycle and exposes a simple render prop API
 * - Supports "browser" mode (MediaRecorder) and "mock" mode (no real recording, for tests)
 * - Never throws from event handlers; surfaces errors via onError + status="error"
 */
export default function RecorderEngine(props: RecorderEngineProps) {
  const {
    mode = "browser",
    maxDurationSec = 300,
    tickIntervalMs = 500,
    autoStart = false,
    autoRenderControls = true,
    debugTag,
    onStart,
    onStop,
    onError,
    onStatusChange,
    className,
    children,
  } = props;

  const [status, setStatusState] = useState<RecorderEngineStatus>(() =>
    mode === "browser" && !getSupport() ? "unsupported" : "idle",
  );
  const [elapsedSec, setElapsedSec] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorderLike | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickTimerRef = useRef<number | null>(null);
  const maxTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  const isSupported = useMemo(
    () => (mode === "browser" ? getSupport() : true),
    [mode],
  );

  const safeSetStatus = useCallback(
    (next: RecorderEngineStatus) => {
      setStatusState(next);
      onStatusChange?.(next);
    },
    [onStatusChange],
  );

  const clearTimers = useCallback(() => {
    if (tickTimerRef.current != null) {
      window.clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
    if (maxTimerRef.current != null) {
      window.clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
  }, []);

  const resetElapsed = useCallback(() => {
    setElapsedSec(0);
    startTimeRef.current = null;
  }, []);

  const cleanupMedia = useCallback(() => {
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch {
        // ignore
      }
    }
    mediaRecorderRef.current = null;

    if (mediaStreamRef.current) {
      for (const track of mediaStreamRef.current.getTracks()) {
        try {
          track.stop();
        } catch {
          // ignore
        }
      }
    }
    mediaStreamRef.current = null;
    chunksRef.current = [];
  }, []);

  const revokeLastUrl = useCallback(() => {
    if (lastUrlRef.current) {
      URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = null;
    }
  }, []);

  const snapshot = useCallback(
    (hitMaxDuration: boolean): RecorderSnapshot => ({
      elapsedSec,
      hitMaxDuration,
    }),
    [elapsedSec],
  );

  const handleError = useCallback(
    (err: unknown) => {
      const error =
        err instanceof Error
          ? err
          : new Error(
              typeof err === "string"
                ? err
                : "RecorderEngine encountered an unknown error",
            );
      setErrorMsg(error.message);
      safeSetStatus("error");
      onError?.(error);
    },
    [onError, safeSetStatus],
  );

  const startTicking = useCallback(() => {
    clearTimers();
    startTimeRef.current = Date.now();
    setElapsedSec(0);

    tickTimerRef.current = window.setInterval(() => {
      if (startTimeRef.current == null) return;
      const elapsedMs = Date.now() - startTimeRef.current;
      setElapsedSec(Math.floor(elapsedMs / 1000));
    }, tickIntervalMs);

    maxTimerRef.current = window.setTimeout(() => {
      // Max duration reached — request stop, but don't await
      void (async () => {
        try {
          await stopInternal(true);
        } catch (err) {
          handleError(err);
        }
      })();
    }, maxDurationSec * 1000);
  }, [clearTimers, maxDurationSec, tickIntervalMs]); // stopInternal defined later but hoisted

  const stopInternal = useCallback(
    async (hitMaxDuration: boolean) => {
      try {
        if (status !== "recording" && status !== "initializing") {
          return;
        }
        safeSetStatus("stopping");
        clearTimers();

        if (mode === "mock") {
          const result: RecorderResult = {
            ...snapshot(hitMaxDuration),
          };
          safeSetStatus("idle");
          resetElapsed();
          onStop?.(result);
          return;
        }

        const recorder = mediaRecorderRef.current;
        if (!recorder) {
          // Nothing to stop, just finalize as empty
          const result: RecorderResult = {
            ...snapshot(hitMaxDuration),
          };
          safeSetStatus("idle");
          resetElapsed();
          onStop?.(result);
          return;
        }

        await new Promise<void>((resolve) => {
          const handleStop = () => {
            recorder.removeEventListener("stop", handleStop);
            resolve();
          };
          recorder.addEventListener("stop", handleStop);
          try {
            if (recorder.state !== "inactive") {
              recorder.stop();
            } else {
              resolve();
            }
          } catch {
            resolve();
          }
        });

        const blob =
          chunksRef.current.length > 0
            ? new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" })
            : undefined;

        revokeLastUrl();
        const url = blob ? URL.createObjectURL(blob) : undefined;
        if (url) {
          lastUrlRef.current = url;
        }

        const result: RecorderResult = {
          ...snapshot(hitMaxDuration),
          blob,
          url,
        };

        cleanupMedia();
        safeSetStatus("idle");
        resetElapsed();
        onStop?.(result);
      } catch (err) {
        cleanupMedia();
        clearTimers();
        resetElapsed();
        handleError(err);
      }
    },
    [
      cleanupMedia,
      clearTimers,
      handleError,
      mode,
      onStop,
      resetElapsed,
      revokeLastUrl,
      safeSetStatus,
      snapshot,
      status,
    ],
  );

  const start = useCallback(async () => {
    setErrorMsg(null);

    if (!isSupported && mode === "browser") {
      safeSetStatus("unsupported");
      handleError(new Error("Recording is not supported in this browser."));
      return;
    }

    if (status === "recording" || status === "initializing") {
      return;
    }

    safeSetStatus("initializing");

    try {
      if (mode === "mock") {
        clearTimers();
        startTicking();
        safeSetStatus("recording");
        onStart?.(snapshot(false));
        return;
      }

      const nav = window.navigator as Navigator & {
        mediaDevices?: MediaDevices;
      };

      const stream = await nav.mediaDevices!.getUserMedia({
        audio: true,
      });
      mediaStreamRef.current = stream;
      chunksRef.current = [];

      const recorder: MediaRecorderLike = new MediaRecorder(stream, {
        mimeType:
          typeof MediaRecorder.isTypeSupported === "function" &&
          MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : "audio/webm",
      });

      recorder.addEventListener("dataavailable", (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener("error", (event: MediaRecorderErrorEvent | Event) => {
        const err =
          "error" in event && event.error instanceof Error
            ? event.error
            : new Error("MediaRecorder error event");
        handleError(err);
      });

      recorder.start();
      mediaRecorderRef.current = recorder;

      clearTimers();
      startTicking();
      safeSetStatus("recording");
      onStart?.(snapshot(false));
    } catch (err) {
      cleanupMedia();
      clearTimers();
      resetElapsed();
      handleError(err);
    }
  }, [
    cleanupMedia,
    clearTimers,
    handleError,
    isSupported,
    mode,
    onStart,
    resetElapsed,
    safeSetStatus,
    snapshot,
    startTicking,
    status,
  ]);

  const stop = useCallback(async () => {
    await stopInternal(false);
  }, [stopInternal]);

  // Auto-start when requested and supported
  useEffect(() => {
    if (!autoStart) return;
    if (!isSupported && mode === "browser") return;
    void start();
    // we intentionally ignore "start" dependencies beyond what's needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, isSupported, mode]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      clearTimers();
      cleanupMedia();
      revokeLastUrl();
    },
    [cleanupMedia, clearTimers, revokeLastUrl],
  );

  const canStart =
    (status === "idle" || status === "error" || status === "unsupported") &&
    (mode === "mock" || isSupported);

  const canStop = status === "recording" || status === "initializing";

  const renderProps: RecorderRenderProps = {
    status,
    elapsedSec,
    isSupported,
    canStart,
    canStop,
    error: errorMsg,
    start,
    stop,
  };

  if (children) {
    return <>{children(renderProps)}</>;
  }

  if (!autoRenderControls) {
    return null;
  }

  const statusLabel = (() => {
    switch (status) {
      case "idle":
        return "Idle";
      case "unsupported":
        return "Unsupported";
      case "initializing":
        return "Initializing…";
      case "recording":
        return "Recording…";
      case "stopping":
        return "Stopping…";
      case "error":
        return "Error";
      default:
        return status;
    }
  })();

  const tagLabel = debugTag ? ` • ${debugTag}` : "";

  return (
    <div
      className={
        className ??
        "rounded-xl border border-border/60 bg-background/60 px-4 py-3 flex items-center justify-between gap-4 text-sm"
      }
      data-recorder-status={status}
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-medium">
            {statusLabel}
            {tagLabel}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Elapsed: {elapsedSec}s • Mode: {mode}
          {!isSupported && mode === "browser" && (
            <span className="ml-1 text-[0.7rem] uppercase tracking-wide text-red-500">
              not supported
            </span>
          )}
          {errorMsg && (
            <span className="ml-2 text-[0.7rem] text-red-500" aria-live="polite">
              {errorMsg}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void start()}
          disabled={!canStart}
          className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start
        </button>
        <button
          type="button"
          onClick={() => void stop()}
          disabled={!canStop}
          className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Stop
        </button>
      </div>
    </div>
  );
}