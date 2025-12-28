import PersonaBadge from "@/app/_client/persona/PersonaBadge";

export const dynamic = "force-dynamic";

export default function PersonaLivePreview() {
  return (
    <div className="px-4 py-4">
      <a className="text-sm underline opacity-80 hover:opacity-100" href="/persona/select">Open Persona Selector</a>
      <div className="h-3" />
      <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Persona Live Preview</h1>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>
        Avatar variants + reaction badge rendered using /api/persona/variants + /api/persona/reaction-map.
      </p>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {["neutral","happy","sad","angry","surprised","focused","calm"].map((e, i) => (
          <div key={e} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <PersonaBadge personaCode="avatar_001" emotion={e as any} seed={`demo-${i}`} size={72} showReaction />
            <div style={{ fontSize: 12, opacity: 0.75 }}>{e}</div>
          </div>
        ))}
      </div>
    </main>
  </div>
  );
}
