export default function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  );
}
