export async function getPopularMovies() {
  // Skickar förfrågan till TMDb och väntar på svaret.
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US",
    {
      headers: {
        // Läser tokenen från miljöfilen och använder den för API-åtkomst.
        Authorization: "Bearer " + process.env.EXPO_PUBLIC_TMDB_TOKEN,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Could not load movies. Please try again.");
  }

  // Läser JSON-texten i svaret och omvandlar den till JavaScript-data.
  const data = await response.json();

  // Lämnar tillbaka filmlistan, som TMDb har placerat under results.
  return data.results;
}
