import CineverseLiveClient from "@/components/cineverse/CineverseLiveClient";

export default function CineversePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>CineVerse</h1>
      <CineverseLiveClient />
    </main>
  );
}
