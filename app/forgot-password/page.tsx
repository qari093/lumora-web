export default function ForgotPasswordPage() {
  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <h1>Recover your Lumora account</h1>
      <p>Enter your email to request account recovery instructions.</p>
      <form action="/api/auth/forgot-password" method="post">
        <input name="email" type="email" required placeholder="you@example.com" />
        <button type="submit">Send recovery link</button>
      </form>
    </main>
  );
}
