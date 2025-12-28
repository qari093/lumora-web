'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';

type Tile = { label: string; emoji: string; href: string; sub?: string };

export default function OverlayDemoPage() {
  const [open, setOpen] = useState(true);

  const tiles: Tile[] = useMemo(
    () => [
      { label: 'NEXA', emoji: '🧘', href: '/nexa', sub: 'wellness & GX' },
      { label: 'GMAR', emoji: '��', href: '/gmar', sub: 'games hub' },
      { label: 'Videos', emoji: '🎞️', href: '/videos', sub: 'gallery' },
      { label: 'Live', emoji: '📺', href: '/live', sub: 'stream portal' },
      { label: 'For You', emoji: '✨', href: '/fyp', sub: 'feed' },
      { label: 'Movies', emoji: '🎬', href: '/movies/portal', sub: 'portal' },
      { label: 'Share', emoji: '🔗', href: '/share', sub: 'sharing' },
      { label: 'Home', emoji: '🏠', href: '/', sub: 'user shell' },
      // Stubs that still open something real (avoid dead tiles)
      { label: 'Wallet', emoji: '💰', href: '/wallet-demo', sub: 'demo' },
      { label: 'ZenShop', emoji: '🛍️', href: '/shop', sub: 'demo' },
      { label: 'LumaLink', emoji: '💬', href: '/social', sub: 'demo' },
      { label: 'Trending', emoji: '📈', href: '/trending', sub: 'demo' },
    ],
    []
  );

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Lumora Overlay Demo</h1>
        <p style={styles.p}>
          Tap the Home orb to toggle the overlay. Tiles are real links into the user experience.
        </p>
      </header>

      <section style={styles.canvas}>
        <div style={styles.bgCard}>Background content for blur sampling…</div>

        {/* Overlay */}
        <div
          style={{
            ...styles.overlayWrap,
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transform: open ? 'translateY(0)' : 'translateY(8px)',
          }}
          aria-hidden={!open}
        >
          <div style={styles.overlayPanel}>
            <div style={styles.overlayTitle}>Lumora Universe</div>
            <div style={styles.grid}>
              {tiles.map((t) => (
                <Link key={t.href + t.label} href={t.href} style={styles.tile} prefetch={false}>
                  <div style={styles.emoji}>{t.emoji}</div>
                  <div style={styles.tileLabel}>{t.label}</div>
                  {t.sub ? <div style={styles.tileSub}>{t.sub}</div> : null}
                </Link>
              ))}
            </div>
            <div style={styles.hint}>Tap an icon • Press Esc to close</div>
          </div>
        </div>

        {/* Home orb */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
          aria-label="Toggle overlay"
          style={{
            ...styles.orb,
            boxShadow: open
              ? '0 12px 30px rgba(20,40,80,0.25), 0 0 0 3px rgba(40,120,255,0.25)'
              : '0 12px 30px rgba(20,40,80,0.22)',
          }}
        >
          <span style={styles.orbIcon}>⌂</span>
        </button>
      </section>

      <footer style={styles.footer}>
        <Link href="/" style={styles.footerLink}>
          Go to User Home
        </Link>
        <span style={styles.footerSep}>•</span>
        <Link href="/fyp" style={styles.footerLink}>
          For You
        </Link>
        <span style={styles.footerSep}>•</span>
        <Link href="/gmar" style={styles.footerLink}>
          GMAR
        </Link>
        <span style={styles.footerSep}>•</span>
        <Link href="/videos" style={styles.footerLink}>
          Videos
        </Link>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '28px 18px 24px',
    background:
      'radial-gradient(1200px 600px at 50% 15%, rgba(170,220,255,0.55), rgba(255,255,255,0.9) 55%, rgba(255,210,240,0.5))',
    color: '#0b1220',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  header: { maxWidth: 980, margin: '0 auto 18px' },
  h1: { fontSize: 36, margin: 0, letterSpacing: '-0.02em' },
  p: { margin: '8px 0 0', opacity: 0.75, maxWidth: 720 },
  canvas: { maxWidth: 980, margin: '0 auto', position: 'relative' },
  bgCard: {
    height: 540,
    borderRadius: 18,
    background: 'rgba(210,235,255,0.65)',
    border: '1px solid rgba(0,0,0,0.06)',
    padding: 18,
    boxShadow: '0 14px 40px rgba(10,25,60,0.08)',
  },
  overlayWrap: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    transition: 'all 220ms ease',
  },
  overlayPanel: {
    width: 'min(820px, 92%)',
    borderRadius: 22,
    background: 'rgba(255,255,255,0.55)',
    border: '1px solid rgba(0,0,0,0.08)',
    backdropFilter: 'blur(14px)',
    padding: '20px 18px 16px',
    boxShadow: '0 24px 70px rgba(10,25,60,0.22)',
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: '-0.01em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 14,
  },
  tile: {
    textDecoration: 'none',
    color: '#0b1220',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.06)',
    padding: '14px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 10px 24px rgba(10,25,60,0.10)',
    transition: 'transform 120ms ease, box-shadow 120ms ease',
  },
  emoji: { fontSize: 28, lineHeight: 1 },
  tileLabel: { fontSize: 13, fontWeight: 700, letterSpacing: '0.02em' },
  tileSub: { fontSize: 11, opacity: 0.65 },
  hint: { marginTop: 12, fontSize: 12, opacity: 0.6, textAlign: 'center' },
  orb: {
    position: 'absolute',
    left: '50%',
    bottom: -22,
    transform: 'translateX(-50%)',
    width: 64,
    height: 64,
    borderRadius: 999,
    border: '1px solid rgba(0,0,0,0.10)',
    background: 'rgba(255,255,255,0.92)',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
  },
  orbIcon: { fontSize: 20, opacity: 0.8 },
  footer: {
    maxWidth: 980,
    margin: '28px auto 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
    opacity: 0.85,
  },
  footerLink: { color: '#0b1220', textDecoration: 'underline' },
  footerSep: { opacity: 0.45 },
};


// celebrations-tile: /celebrations
