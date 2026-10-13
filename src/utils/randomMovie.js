// Väljer en slumpad film ur listan som skickas in.

/** @param {{ id: number, title: string }[]} movies */
export function getRandomMovie(movies) {
  if (movies.length === 0) {
    return null; // Ingen film kan väljas ur en tom lista.
  }

  // Slumpar ett heltal som motsvarar en plats i listan, från 0 till sista platsen.
  const randomIndex = Math.floor(Math.random() * movies.length);
  return movies[randomIndex]; // Lämnar tillbaka filmen på den slumpade platsen.
}
