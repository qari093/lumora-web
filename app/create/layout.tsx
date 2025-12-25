import type { ReactNode } from "react";

export default function CreateLayout({ children }: { children: ReactNode }) {
  return (
    <div data-create-shell="1" style={{ minHeight: "100vh" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/create" style={{ textDecoration: "none" }}>
            <strong style={{ letterSpacing: 0.2 }}>Create</strong>
          </a>
          <span style={{ opacity: 0.35 }}>•</span>
          <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }} aria-label="Create navigation">
            <a href="/create/upload" style={{ textDecoration: "underline" }}>Upload</a>
            <a href="/create/record" style={{ textDecoration: "underline" }}>Record</a>
            <a href="/create/publish" style={{ textDecoration: "underline" }}>Publish</a>
          </nav>
          <span style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/movies" style={{ textDecoration: "underline" }}>Movies</a>
            <a href="/gmar" style={{ textDecoration: "underline" }}>GMAR</a>
            <a href="/nexa" style={{ textDecoration: "underline" }}>NEXA</a>
          </span>
        </div>
      </header>

      <div>{children}</div>
    </div>
  );
}
