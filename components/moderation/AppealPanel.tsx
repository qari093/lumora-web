"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type AppealRecord = {
  id: string;
  reportId: string;
  reason: string;
  status: string;
  decisionReason?: string | null;
  remedy?: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string | null;
};

export default function AppealPanel() {
  const [reportId, setReportId] = useState("");
  const [reason, setReason] = useState("");
  const [appeals, setAppeals] = useState<AppealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadAppeals = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/moderation/appeal", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        setMessage(
          response.status === 401 || response.status === 403
            ? "Sign in with your verified account to view appeals."
            : "Appeal history is temporarily unavailable."
        );
        setAppeals([]);
        return;
      }

      setAppeals(Array.isArray(data.appeals) ? data.appeals : []);
    } catch {
      setMessage("Appeal history is temporarily unavailable.");
      setAppeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAppeals();
  }, [loadAppeals]);

  async function submitAppeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedReportId = reportId.trim();
    const normalizedReason = reason.trim();

    if (!normalizedReportId || !normalizedReason) {
      setMessage("Enter the rejected video reference and your appeal reason.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/moderation/appeal", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          reportId: normalizedReportId,
          reason: normalizedReason,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.ok) {
        setReportId("");
        setReason("");
        setMessage("Appeal submitted for human review.");
        await loadAppeals();
        return;
      }

      const error = data?.error;

      if (error === "APPEAL_TARGET_NOT_FOUND") {
        setMessage("That moderation reference was not found.");
      } else if (error === "APPEAL_TARGET_FORBIDDEN") {
        setMessage("You can only appeal moderation actions on your own content.");
      } else if (error === "APPEAL_TARGET_NOT_APPEALABLE") {
        setMessage("Only rejected content is currently eligible for appeal.");
      } else if (response.status === 401 || response.status === 403) {
        setMessage("Sign in with your verified account to submit an appeal.");
      } else {
        setMessage("The appeal could not be submitted.");
      }
    } catch {
      setMessage("The appeal could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="moderation-appeals-heading">
      <h2 id="moderation-appeals-heading">Appeals</h2>

      <p>
        If one of your videos was rejected by moderation, you can request
        human review using its moderation reference.
      </p>

      <form onSubmit={submitAppeal}>
        <label>
          Rejected video reference
          <input
            name="reportId"
            value={reportId}
            onChange={(event) => setReportId(event.target.value)}
            autoComplete="off"
            required
          />
        </label>

        <label>
          Why should this decision be reviewed?
          <textarea
            name="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            required
            rows={4}
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit appeal"}
        </button>
      </form>

      {message ? <p role="status">{message}</p> : null}

      <h3>Your appeal history</h3>

      {loading ? (
        <p>Loading appeals…</p>
      ) : appeals.length === 0 ? (
        <p>No appeals yet.</p>
      ) : (
        <ul>
          {appeals.map((appeal) => (
            <li key={appeal.id}>
              <strong>{appeal.status}</strong>
              {" — "}
              <span>{appeal.reportId}</span>
              <p>{appeal.reason}</p>

              {appeal.decisionReason ? (
                <p>
                  Decision explanation: {appeal.decisionReason}
                </p>
              ) : null}

              {appeal.remedy ? (
                <p>
                  Remedy: {appeal.remedy}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
