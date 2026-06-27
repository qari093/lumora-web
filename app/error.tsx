"use client";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#02030a",
        color: "white",
        padding: 24,
        textAlign: "center"
      }}
    >
      <section>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>Lumora encountered an error</h1>
        <p style={{ opacity: 0.72 }}>{error?.message || "Unknown runtime error"}</p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 24,
            padding: "12px 20px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.18)",
            background: "rgba(255,255,255,.08)",
            color: "white"
          }}
        >
          Retry
        </button>
      </section>
    </main>
  );
}
