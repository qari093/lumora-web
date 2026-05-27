export default async function AmbientPortalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main>
      <h1>Ambient Link Portal</h1>
      <p>{id}</p>
    </main>
  );
}
