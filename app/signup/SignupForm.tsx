"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type RegisterResponse = {
  ok?: boolean;
  error?: string;
};

export default function SignupForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim().toLowerCase(),
      password: String(data.get("password") || ""),
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => ({}))) as RegisterResponse;

      if (!response.ok || !body.ok) {
        setError(
          body.error === "account_already_exists"
            ? "An account already exists for this email."
            : "Registration could not be completed.",
        );
        return;
      }

      const result = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (!result?.ok) {
        router.replace("/login");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Registration could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} disabled={submitting} style={{ padding: 12, borderRadius: 8 }} />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required disabled={submitting} style={{ padding: 12, borderRadius: 8 }} />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Password</span>
        <input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} disabled={submitting} style={{ padding: 12, borderRadius: 8 }} />
      </label>

      <p style={{ margin: 0 }}>Use at least 12 characters with uppercase, lowercase, and a number.</p>

      {error ? <p role="alert" style={{ color: "crimson", margin: 0 }}>{error}</p> : null}

      <button type="submit" disabled={submitting} style={{ padding: 12 }}>
        {submitting ? "Creating account…" : "Create account"}
      </button>

      <a href="/login">Already have an account?</a>
    </form>
  );
}
