import SignupForm from "./SignupForm";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Signup • Lumora</h1>
      <p>Create your Lumora identity.</p>
      <SignupForm />
    </main>
  );
}
