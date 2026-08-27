'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

type ResetPasswordResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedToken = token.trim();

    if (!normalizedToken) {
      setIsError(true);
      setMessage('Enter your recovery token.');
      return;
    }

    if (password.length < 10) {
      setIsError(true);
      setMessage('Your new password must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    setIsError(false);
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: normalizedToken,
          password,
        }),
      });

      let payload: ResetPasswordResponse = {};

      try {
        payload = (await response.json()) as ResetPasswordResponse;
      } catch {
        payload = {};
      }

      if (!response.ok || payload.ok === false) {
        setIsError(true);

        switch (payload.error) {
          case 'reset_token_required':
            setMessage('Enter your recovery token.');
            break;
          case 'password_required':
            setMessage('Enter a new password.');
            break;
          case 'password_too_short':
            setMessage('Your new password must be at least 10 characters.');
            break;
          case 'invalid_reset_token':
          case 'reset_token_invalid':
            setMessage('This recovery token is invalid or has expired. Request a new recovery link.');
            break;
          default:
            setMessage(
              payload.message ||
                'We could not reset your password. Check the recovery token and try again.',
            );
        }

        return;
      }

      setIsError(false);
      setMessage(payload.message || 'Password reset successfully. You can now sign in.');
      setPassword('');
    } catch {
      setIsError(true);
      setMessage('Password reset is temporarily unavailable. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: 24 }}>
      <h1>Reset your Lumora password</h1>

      <p>Use your recovery token to set a new password.</p>

      <form onSubmit={handleSubmit} noValidate>
        <input
          name="token"
          type="text"
          autoComplete="off"
          required
          placeholder="Recovery token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          disabled={submitting}
        />

        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          placeholder="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={submitting}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>

      {message ? (
        <p role={isError ? 'alert' : 'status'} aria-live="polite">
          {message}
        </p>
      ) : null}

      <p>
        Don&apos;t have a recovery token?{' '}
        <Link href="/forgot-password">Request a new recovery link</Link>
      </p>
    </main>
  );
}
