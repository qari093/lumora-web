"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError("Invalid email or password.");
        return;
      }

      const callbackUrl =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("callbackUrl")
          : null;

      router.replace(callbackUrl?.startsWith("/") ? callbackUrl : "/");
      router.refresh();
    } catch {
      setError("Sign in could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required disabled={submitting} style={{ padding: 12, borderRadius: 8 }} />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required minLength={12} disabled={submitting} style={{ padding: 12, borderRadius: 8 }} />
      </label>

      {error ? <p role="alert" style={{ color: "crimson", margin: 0 }}>{error}</p> : null}

      <button type="submit" disabled={submitting} style={{ padding: 12 }}>
        {submitting ? "Signing in…" : "Sign in"}
      </button>

      <a href="/forgot-password">Forgot password?</a>
      <a href="/signup">Create an account</a>
    </form>
  );
}
