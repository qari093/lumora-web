import Link from "next/link";

export const dynamic = "force-dynamic";

const REACTIONS = [
  "love","laugh","wow","proud","calm","focus","spark","fire","ice","clap","salute","think","cry","rage","blush","wink","wave","yes","no","maybe","star","zen","aura","glitch","hype","coffee","sleep",
  "joy","chill","shock","grin","sigh","snap","pulse","boom","soft","bold","sparkle","flow","steady",
] as const;

const COLORS = ["01","02","03","04","05","06","07","08","09","10","11","12"] as const;

function clampReaction(raw: string | undefined) {
  const v = raw || "love";
  return (REACTIONS as readonly string[]).includes(v) ? v : "love";
}

export default function EmojiLabPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const reaction = clampReaction(typeof searchParams?.reaction === "string" ? searchParams?.reaction : undefined);

  return (
    <main style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Lumora Persona Emoji Lab</h1>
      <p style={{ opacity: 0.85, marginTop: 6 }}>Persona-derived reactions (480). Choose a reaction and see 12 variants.</p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 700 }}>Reaction:</div>
        {REACTIONS.slice(0, 16).map((r) => (
          <Link key={r} href={`/persona/emoji-lab?reaction=${r}`} style={{ textDecoration: "underline" }}>
            {r}
          </Link>
        ))}
        <span style={{ opacity: 0.65 }}>…</span>
        <Link href="/persona/lab?code=avatar_001" style={{ textDecoration: "underline", marginLeft: "auto" }}>
          Avatar Lab →
        </Link>
      </div>

      <section
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }}
      >
        {COLORS.map((c) => {
          const code = `rx_${reaction}_${c}`;
          return (
            <div
              key={c}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 16,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 700 }}>{code}</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/persona/emojis/${code}.svg`}
                alt={code}
                width={200}
                height={200}
                style={{ width: "100%", height: "auto", marginTop: 10, borderRadius: 14 }}
              />
            </div>
          );
        })}
      </section>

      <div style={{ marginTop: 18, opacity: 0.85, fontSize: 13 }}>
        API: <code>/api/persona/emojis?reaction={reaction}</code>
      </div>
    </main>
  );
}
