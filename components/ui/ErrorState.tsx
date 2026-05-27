export default function ErrorState({
  message,
}: {
  message: string;
}) {
  return (
    <section role="alert">
      <h2>Something needs attention</h2>
      <p>{message}</p>
    </section>
  );
}
