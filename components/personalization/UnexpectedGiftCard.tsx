import { createUnexpectedGift } from "@/lib/personalization/unexpectedGift";

export default function UnexpectedGiftCard() {
  const gift = createUnexpectedGift({ preferredLane: "Silent Wonder", replayDepth: 2 });

  return (
    <section className="lumora-portal-card p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-pink-200/80">Personalization</p>
      <h2 className="mt-4 text-3xl font-black">{gift.message}</h2>
      <p className="mt-4 text-white/65">{gift.lane} · Confidence {Math.round(gift.confidence * 100)}%</p>
    </section>
  );
}
