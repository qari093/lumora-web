import type { ReactNode } from "react";

type Tile = {
  href: string;
  title: string;
  desc: string;
  badge?: string;
};

function TileCard({ href, title, desc, badge }: Tile): ReactNode {
  return (
    <a className="lumoTile" href={href}>
      <div className="lumoTileTop">
        <div className="lumoTileTitle">{title}</div>
        {badge ? <span className="lumoBadge">{badge}</span> : null}
      </div>
      <div className="lumoTileDesc">{desc}</div>
      <div className="lumoTileCTA">Open →</div>
    </a>
  );
}

export default function HomePage() {
  const tiles: Tile[] = [
    { href: "/fyp", title: "FYP", desc: "Your main feed: discovery + daily loop.", badge: "LIVE" },
    { href: "/gmar", title: "GMAR", desc: "Play the arcade + missions + events.", badge: "PLAY" },
    { href: "/videos", title: "Videos", desc: "Create, generate, and manage videos.", badge: "STUDIO" },
    { href: "/nexa", title: "NEXA", desc: "Your intelligence, health, and focus hub.", badge: "AI" },
    { href: "/movies", title: "Movies", desc: "Browse the Movies portal.", badge: "CINE" },
    { href: "/celebrations", title: "Celebrations", desc: "Moments, rewards, and rituals.", badge: "ZEN" },
    { href: "/share", title: "Share", desc: "Sharing tools and distribution.", badge: "LINK" },
    { href: "/live", title: "Live", desc: "Go Live, rooms, and operator health.", badge: "STREAM" },
  ];

  return (
    <main className="lumoHome">
      {/* STEP133_SPLASH_READY */}
      <span id="STEP133_SPLASH_READY" style={{ display: "none" }}>
        STEP133_SPLASH_READY
      </span>

      {/* STEP135_TOPNAV */}
      <span id="STEP135_TOPNAV" style={{ display: "none" }}>
        STEP135_TOPNAV
      </span>

      {/* STEP135_HOME_PORTALS_GRID */}
      <span id="STEP135_HOME_PORTALS_GRID" style={{ display: "none" }}>
        STEP135_HOME_PORTALS_GRID
      </span>

      <style>{`
        .lumoHome {
          min-height: calc(100vh - 64px);
          padding: 20px 16px 36px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .lumoHero {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 18px 18px 16px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(20,24,40,.55);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .lumoTitle {
          font-size: 26px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .lumoSub {
          margin: 0;
          opacity: .86;
          max-width: 70ch;
        }
        .lumoGrid {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 12px;
        }
        .lumoTile {
          grid-column: span 6;
          border-radius: 16px;
          padding: 14px 14px 12px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(15,18,32,.55);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform .14s ease, border-color .14s ease, background .14s ease;
          will-change: transform;
        }
        .lumoTile:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,.22);
          background: rgba(22,26,44,.72);
        }
        .lumoTileTop {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
        }
        .lumoTileTitle {
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.01em;
        }
        .lumoBadge {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.16);
          opacity: .9;
        }
        .lumoTileDesc {
          opacity: .86;
          font-size: 13px;
          line-height: 1.35;
        }
        .lumoTileCTA {
          margin-top: 2px;
          font-weight: 700;
          font-size: 12px;
          opacity: .9;
        }
        .lumoRow {
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .lumoPill {
          border-radius: 999px;
          padding: 10px 12px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(15,18,32,.45);
          text-decoration: none;
          color: inherit;
          font-size: 12px;
          opacity: .9;
        }
        .lumoPill:hover { opacity: 1; border-color: rgba(255,255,255,.22); }
        @media (max-width: 860px) { .lumoTile { grid-column: span 12; } }
      `}</style>

      <section className="lumoHero">
        <h1 className="lumoTitle">Lumora</h1>
        <p className="lumoSub">
          All portals active: FYP, GMAR, Videos, NEXA, Movies, Celebrations, Share, Live — plus Live operator health.
        </p>
        <div className="lumoRow">
          <a className="lumoPill" href="/live/health">Live Health</a>
          <a className="lumoPill" href="/live/healthz">Live Healthz</a>
          <a className="lumoPill" href="/videos">Open Studio</a>
          <a className="lumoPill" href="/fyp">Open Feed</a>
        </div>
      </section>

      <section className="lumoGrid" aria-label="Portals">
        {tiles.map((t) => (
          <TileCard key={t.href} {...t} />
        ))}
      </section>
    </main>
  );
}
