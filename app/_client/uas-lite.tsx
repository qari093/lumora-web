'use client';

import { useEffect, useRef } from 'react';

const UAS_CONFIG = {
  maxCloses: 3,
  windowMs: 60_000,
  quietHours: 24,
  storageKey: 'lumora.uas.quiet.until',
} as const;

type QuietState = {
  quietUntil: number;
};

function getQuietUntil(): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const raw = window.localStorage.getItem(UAS_CONFIG.storageKey);

    if (!raw) {
      return 0;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<QuietState> | number;

      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof parsed.quietUntil === 'number' &&
        Number.isFinite(parsed.quietUntil)
      ) {
        return Math.max(0, parsed.quietUntil);
      }

      if (typeof parsed === 'number' && Number.isFinite(parsed)) {
        return Math.max(0, parsed);
      }
    } catch {
      const legacyValue = Number(raw);

      if (Number.isFinite(legacyValue)) {
        return Math.max(0, legacyValue);
      }
    }

    return 0;
  } catch {
    return 0;
  }
}

function setQuietHours(hours: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const safeHours = Number.isFinite(hours) ? Math.max(0, hours) : 0;
    const quietUntil = Date.now() + safeHours * 60 * 60 * 1000;

    window.localStorage.setItem(
      UAS_CONFIG.storageKey,
      JSON.stringify({ quietUntil } satisfies QuietState),
    );
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }
}

function clearQuietState(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(UAS_CONFIG.storageKey);
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }
}

export default function UasLite() {
  const closesRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const onOpen = () => {
      const quietUntil = getQuietUntil();

      if (quietUntil > Date.now()) {
        window.dispatchEvent(new CustomEvent('lumora:overlay-close'));
      }
    };

    const onClose = () => {
      const currentTime = Date.now();
      const cutoff = currentTime - UAS_CONFIG.windowMs;

      closesRef.current = closesRef.current.filter((timestamp) => timestamp >= cutoff);
      closesRef.current.push(currentTime);

      if (closesRef.current.length >= UAS_CONFIG.maxCloses) {
        setQuietHours(UAS_CONFIG.quietHours);
        closesRef.current = [];

        console.log(`UAS-lite → quiet for ${UAS_CONFIG.quietHours}h`);
      }
    };

    window.addEventListener('lumora:overlay-open', onOpen as EventListener);
    window.addEventListener('lumora:overlay-close', onClose as EventListener);

    const uasApi = {
      status: () => {
        const quietUntil = getQuietUntil();

        return {
          quietUntil,
          remainingMs: Math.max(0, quietUntil - Date.now()),
        };
      },
      clear: () => {
        clearQuietState();
        console.log('UAS-lite: quiet cleared');
      },
      snooze: (hours: number) => {
        setQuietHours(hours);
        console.log(`UAS-lite: snoozed for ${hours}h`);
      },
    };

    (
      window as typeof window & {
        UAS?: typeof uasApi;
      }
    ).UAS = uasApi;

    console.log('%c🟢 UAS-lite ready', 'color:limegreen; font-weight:bold');

    return () => {
      window.removeEventListener('lumora:overlay-open', onOpen as EventListener);
      window.removeEventListener('lumora:overlay-close', onClose as EventListener);

      delete (
        window as typeof window & {
          UAS?: typeof uasApi;
        }
      ).UAS;
    };
  }, []);

  return null;
}
