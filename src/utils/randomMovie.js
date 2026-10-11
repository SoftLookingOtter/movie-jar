// Väljer en slumpad film ur listan som skickas in.
/** @param {{ id: number, title: string }[]} movies */
export function getRandomMovie(movies) {
  if (movies.length === 0) {
    return null; // Ingen film kan väljas ur en tom lista.
  }

  const randomIndex = Math.floor(Math.random() * movies.length);
  return movies[randomIndex]; // Lämnar tillbaka den valda filmen.
}
