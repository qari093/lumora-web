export default function CreateRecordPage() {
  return (
    <main data-create-ui="1" data-create-record-ui="1" style={{ padding: 24, fontFamily: "system-ui, Segoe UI, Arial" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, margin: "8px 0" }}>Create · Record</h1>
      <p style={{ opacity: 0.72, margin: "6px 0 14px" }}>
        Record flow stub. Next: client camera/mic capture + upload to Stream + publish safety checks.
      </p>

      <section style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        <div style={{ padding: 14, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14 }}>
          <h2 style={{ fontSize: 16, margin: "0 0 6px" }}>Step 1 — Permissions</h2>
          <p style={{ margin: 0, opacity: 0.72 }}>Request camera + microphone access.</p>
        </div>
        <div style={{ padding: 14, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14 }}>
          <h2 style={{ fontSize: 16, margin: "0 0 6px" }}>Step 2 — Capture</h2>
          <p style={{ margin: 0, opacity: 0.72 }}>Local preview, record controls, max duration guard.</p>
        </div>
        <div style={{ padding: 14, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14 }}>
          <h2 style={{ fontSize: 16, margin: "0 0 6px" }}>Step 3 — Upload + Publish</h2>
          <p style={{ margin: 0, opacity: 0.72 }}>Upload recording, attach metadata, publish.</p>
        </div>

        <p style={{ margin: "10px 0 0" }}>
          <a href="/create" style={{ textDecoration: "underline" }}>Back to Create</a>{" "}
          · <a href="/create/upload" style={{ textDecoration: "underline" }}>Upload</a>
        </p>
      </section>
    
      <section data-create-sub-cta="1" style={{ marginTop: 18, display: "grid", gap: 10, maxWidth: 720 }}>
        <div style={{ padding: 14, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14 }}>
          <strong style={{ letterSpacing: 0.2 }}>Next</strong>
          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a data-create-cta="upload" href="/create/upload" style={{ textDecoration: "underline" }}>Upload</a>
            <a data-create-cta="record" href="/create/record" style={{ textDecoration: "underline" }}>Record</a>
            <a data-create-cta="publish" href="/create/publish" style={{ textDecoration: "underline" }}>Publish</a>
          </div>
          <p style={{ margin: "10px 0 0", opacity: 0.72 }}>
            You are on <code style={{ opacity: 0.9 }}>/create/record</code>.
          </p>
        </div>
      </section>

    </main>
  );
}
