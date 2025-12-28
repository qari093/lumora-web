import Link from "next/link";

export const dynamic = "force-dynamic";

const EMOTIONS = ["neutral", "happy", "sad", "angry", "surprised", "focused", "calm"] as const;

function clampCode(raw: string | undefined) {
  const v = raw || "avatar_001";
  if (!/^avatar_\d{3}$/.test(v)) return "avatar_001";
  const n = Number(v.slice(-3));
  if (n < 1) return "avatar_001";
  if (n > 120) return "avatar_120";
  return v;
}

export default async function PersonaLabPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const code = clampCode(typeof searchParams?.code === "string" ? searchParams?.code : undefined);
  const idx = Number(code.slice(-3));
  const prev = `avatar_${String(Math.max(1, idx - 1)).padStart(3, "0")}`;
  const next = `avatar_${String(Math.min(120, idx + 1)).padStart(3, "0")}`;

  return (
    <main style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Lumora Persona Lab — Emotion Variants</h1>
      <p style={{ opacity: 0.85, marginTop: 6 }}>
        Preview variants for a single avatar code (placeholder pack for now).
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14 }}>
        <Link href={`/persona/lab?code=${prev}`} style={{ textDecoration: "underline" }}>
          ← {prev}
        </Link>
        <div style={{ fontWeight: 700 }}>{code}</div>
        <Link href={`/persona/lab?code=${next}`} style={{ textDecoration: "underline" }}>
          {next} →
        </Link>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <Link href="/portals" style={{ textDecoration: "underline" }}>
            /portals
          </Link>
          <Link href="/live" style={{ textDecoration: "underline" }}>
            /live
          </Link>
        </div>
      </div>

      <section
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {EMOTIONS.map((e) => (
          <div
            key={e}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 16,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 700, textTransform: "capitalize" }}>{e}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/persona/avatars/${e}/${code}.svg`}
              alt={`${code} ${e}`}
              width={240}
              height={240}
              style={{ width: "100%", height: "auto", marginTop: 10, borderRadius: 14 }}
            />
          </div>
        ))}
      </section>

      <div style={{ marginTop: 18, opacity: 0.85, fontSize: 13 }}>
        API: <code>/api/persona/variants?code={code}</code>
      </div>
    </main>
  );
}
