import PersonaBadge from "../_client/persona/PersonaBadge";

export default function ProfilePage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui,Segoe UI,Arial" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <PersonaBadge size={40} />
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Profile</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Persona badge should reflect your selected persona cookie.
          </div>
        </div>
      </div>

      <p style={{ opacity: 0.75, margin: "8px 0 14px" }}>
        Placeholder page for <code>/profile</code>.
      </p>

      <p style={{ margin: "8px 0" }}>
        <a href="/persona/select" style={{ textDecoration: "underline" }}>
          Choose Persona
        </a>
        {" · "}
        <a href="/persona/live-preview" style={{ textDecoration: "underline" }}>
          Live Preview
        </a>
        {" · "}
        <a href="/live" style={{ textDecoration: "underline" }}>
          Live
        </a>
      </p>
    </main>
  );
}
