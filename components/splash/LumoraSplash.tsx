'use client';

import * as React from 'react';

type AnyProps = Record<string, any>;

/**
 * Build-safe splash component.
 * - Accepts any props to remain compatible with existing callers (e.g., SplashGate).
 * - Provides reduced-motion respect and a short auto-complete fallback.
 * - Avoids any complex logic that could be corrupted by automated hook-deps patching.
 */
export default function LumoraSplash(props: AnyProps) {
  const onDone =
    typeof props?.onDone === 'function'
      ? (props.onDone as () => void)
      : typeof props?.onComplete === 'function'
      ? (props.onComplete as () => void)
      : null;

  const prefersReduced = React.useMemo(() => {
    if (typeof window === 'undefined') return true;
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return true;
    }
  }, []);

  React.useEffect(() => {
    // If reduced motion, or if no explicit completion handler, finish quickly to avoid blocking app.
    const ms = prefersReduced ? 10 : 700;
    const t = window.setTimeout(() => {
      try {
        onDone?.();
      } catch {
        // ignore
      }
    }, ms);
    return () => window.clearTimeout(t);
  }, [prefersReduced, onDone]);

  // Keep render minimal; SplashGate (or layout) controls visibility/overlay styling elsewhere.
  return (
    <div
      aria-label="Lumora Splash"
      role="img"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          opacity: prefersReduced ? 0.85 : 0.95,
          transform: prefersReduced ? 'none' : 'translateZ(0)',
        }}
      />
    </div>
  );
}
