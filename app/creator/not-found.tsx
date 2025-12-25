export default function NotFound() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, Segoe UI, Arial" }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, margin: "8px 0" }}>
        Creator — Not Found
      </h1>
      <p style={{ opacity: 0.72, margin: "6px 0 14px" }}>
        This should not normally appear. If it does, a global notFound boundary is overriding routing.
      </p>
      <p>
        <a href="/creator" style={{ textDecoration: "underline" }}>
          Reload /creator
        </a>
      </p>
      <p style={{ opacity: 0.72, marginTop: 10 }}>
        <a href="/create" style={{ textDecoration: "underline" }}>
          Go to /create
        </a>
      </p>
    </main>
  );
}
