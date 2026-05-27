import { cineverseFypSeedCards } from "@/src/cineverse/fyp/feed";
import { rankCineVerseFypCards } from "@/src/cineverse/fyp/runtime";

export default function CineVerseFyp() {
  const cards = rankCineVerseFypCards(cineverseFypSeedCards);

  return (
    <section aria-label="CineVerse cinematic FYP">
      {cards.map((card) => (
        <article key={card.id}>
          <h2>{card.title}</h2>
          <p>{card.emotionalHook}</p>
        </article>
      ))}
    </section>
  );
}
