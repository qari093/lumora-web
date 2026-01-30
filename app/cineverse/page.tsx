import Image from "next/image";

export default function CineVersePage() {
  return (
    <main style={{ padding: "24px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Image
          src="/brands/cineverse/logo.png"
          alt="CineVerse"
          width={120}
          height={120}
          priority
        />
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>CineVerse</h1>
      </header>

      <section style={{ marginTop: "32px", opacity: 0.85 }}>
        <p>CineVerse feed initializing…</p>
      </section>
    </main>
  );
}
