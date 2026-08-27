'use client';

import { FormEvent, useState } from 'react';

type ForgotPasswordResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setIsError(true);
      setMessage('Enter your email address.');
      return;
    }

    const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!basicEmailPattern.test(normalizedEmail)) {
      setIsError(true);
      setMessage('Enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setIsError(false);
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      let payload: ForgotPasswordResponse = {};

      try {
        payload = (await response.json()) as ForgotPasswordResponse;
      } catch {
        payload = {};
      }

      if (!response.ok || payload.ok === false) {
        setIsError(true);

        switch (payload.error) {
          case 'valid_email_required':
          case 'email_required':
          case 'invalid_email':
            setMessage('Enter a valid email address.');
            break;

          default:
            setMessage(
              payload.message ||
                'We could not request account recovery. Check your email address and try again.',
            );
        }

        return;
      }

      setIsError(false);
      setMessage(
        payload.message ||
          'If an account matches that email, recovery instructions will be sent.',
      );
    } catch {
      setIsError(true);
      setMessage('Account recovery is temporarily unavailable. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: 24 }}>
      <h1>Recover your Lumora account</h1>

      <p>Enter your email to request account recovery instructions.</p>

      <form onSubmit={handleSubmit} noValidate>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={submitting}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send recovery link'}
        </button>
      </form>

      {message ? (
        <p role={isError ? 'alert' : 'status'} aria-live="polite">
          {message}
        </p>
      ) : null}
    </main>
  );
}
