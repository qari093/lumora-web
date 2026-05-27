import { openCanonSeedFilms } from "@/src/cineverse/open-canon/library";

export default function OpenCanonPage() {
  return (
    <main>
      <h1>Open Emotional Canon</h1>
      <ul>
        {openCanonSeedFilms.map((film) => (
          <li key={film.id}>{film.title}</li>
        ))}
      </ul>
    </main>
  );
}
