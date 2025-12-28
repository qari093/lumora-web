import Link from "next/link";

export function VideoTile(props: {
  href: string;
  title: string;
  desc?: string;
  metaRight?: string;
  seconds?: number;
  tag?: string;
  videoUrl: string;
  posterUrl?: string;
}) {
  const { href, title, desc, metaRight, seconds, tag, videoUrl, posterUrl } = props;
  return (
    <div style={wrap}>
      <Link href={href} style={link}>
        <div style={mediaWrap}>
          {/* Mobile-safe: controls + playsInline; no autoplay requirement */}
          <video
            style={video}
            src={videoUrl}
            poster={posterUrl}
            controls
            playsInline
            preload="metadata"
          />
          <div style={badgeRow}>
            {tag ? <span style={badge}>{tag}</span> : null}
            <span style={meta}>{metaRight ?? (seconds ? `${seconds}s` : "")}</span>
          </div>
        </div>
        <div style={body}>
          <div style={titleStyle}>{title}</div>
          {desc ? <div style={descStyle}>{desc}</div> : null}
        </div>
      </Link>
    </div>
  );
}

const wrap: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 14,
  overflow: "hidden",
  background: "#fff",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const link: React.CSSProperties = { color: "inherit", textDecoration: "none", display: "block" };

const mediaWrap: React.CSSProperties = { position: "relative", background: "#000" };

const video: React.CSSProperties = { width: "100%", height: "auto", display: "block" };

const badgeRow: React.CSSProperties = {
  position: "absolute",
  left: 10,
  right: 10,
  bottom: 10,
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  pointerEvents: "none",
};

const badge: React.CSSProperties = {
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(0,0,0,0.55)",
  color: "#fff",
};

const meta: React.CSSProperties = {
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(0,0,0,0.55)",
  color: "#fff",
};

const body: React.CSSProperties = { padding: 14 };

const titleStyle: React.CSSProperties = { fontWeight: 700, fontSize: 16 };

const descStyle: React.CSSProperties = { marginTop: 6, opacity: 0.8, lineHeight: 1.35 };
