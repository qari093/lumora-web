import { buildExperienceCircleEntryLink } from "@/src/lib/creator-system/share-memory/experienceCircleLink";

export default function MemoryPage({ params }: { params: { memoryId: string } }) {
  const link = buildExperienceCircleEntryLink(params.memoryId);

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <h1>A Lumora Memory</h1>
      <p>Shared as a memory, not as a score.</p>
      <a href={link}>Experience a circle</a>
    </main>
  );
}
