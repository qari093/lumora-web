import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Login • Lumora</h1>
      <p>Use your Lumora account to continue.</p>
      <LoginForm />
    </main>
  );
}
