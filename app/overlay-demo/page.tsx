import React from "react";

export default function OverlayDemoPage() {
  return (
    <>
      {/* Translation UI Controls (feature-flagged) */}
      <main style={styles.page}>
        <header style={styles.header}>
          <h1 style={styles.h1}>Lumora Overlay Demo</h1>
          <p style={styles.p}>
            Demo page for overlay and translation UI experiments.
          </p>
        </header>

        <section style={styles.section}>
          <p style={styles.p}>
            This page is intentionally minimal and build-safe.
          </p>
        </section>

        <footer style={styles.footer}>
          <p style={styles.p}>©️ Lumora</p>
        </footer>
      </main>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "28px 18px 24px",
    background: "#0b0f1a",
    color: "#e5e7eb",
  },
  header: {
    marginBottom: 24,
  },
  section: {
    marginTop: 16,
  },
  footer: {
    marginTop: 32,
    opacity: 0.6,
  },
  h1: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
  },
  p: {
    fontSize: 14,
    lineHeight: 1.6,
  },
};
