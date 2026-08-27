"use client";

const CREDIT_OPTIONS = [100, 500, 1000, 2500];

export default function BuyCreditsClient() {
  return (
    <section
      data-buy-credits-production-state="temporarily-unavailable"
      className="mx-auto max-w-3xl px-6 py-10"
    >
      <h1 className="text-2xl font-semibold">Buy Credits</h1>

      <p className="mt-3 text-sm opacity-80">
        Credit purchases are temporarily unavailable during private beta while
        the authenticated credits checkout flow is being finalized.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CREDIT_OPTIONS.map((credits) => (
          <button
            key={credits}
            type="button"
            disabled
            aria-disabled="true"
            className="rounded-xl border px-4 py-3 text-left opacity-60"
          >
            {credits} credits
            <span className="mt-1 block text-xs">
              Purchasing temporarily unavailable
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
