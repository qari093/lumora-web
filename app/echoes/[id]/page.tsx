export default async function SavedMomentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main>
      <h1>Saved Moment</h1>
      <p>{id}</p>
    </main>
  );
}
