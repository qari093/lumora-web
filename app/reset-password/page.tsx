export default function ResetPasswordPage() {
  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <h1>Reset your Lumora password</h1>
      <p>Use your recovery token to set a new password.</p>
      <form action="/api/auth/reset-password" method="post">
        <input name="token" type="text" required placeholder="Recovery token" />
        <input name="password" type="password" required placeholder="New password" />
        <button type="submit">Reset password</button>
      </form>
    </main>
  );
}
