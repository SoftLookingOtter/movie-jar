// Hämtar filmdata från TMDb:s API:
// populära filmer, sökresultat, filmdetaljer och genrer.

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

  // Avbryter med ett fel om API:et svarar att förfrågan misslyckades.
  if (!response.ok) {
    throw new Error("Could not load movies. Please try again.");
  }

  // Läser JSON-texten i svaret och omvandlar den till JavaScript-data.
  const data = await response.json();

  // Lämnar tillbaka filmlistan, som TMDb har placerat under results.
  return data.results;
}

// Söker efter filmer med söktexten som funktionen får.
/** @param {string} query Söktexten som användaren skrivit. */
export async function searchMovies(query) {
  const response = await fetch(
    "https://api.themoviedb.org/3/search/movie?language=en-US&query=" +
      encodeURIComponent(query),
    {
      headers: {
        Authorization: "Bearer " + process.env.EXPO_PUBLIC_TMDB_TOKEN,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Could not search movies. Please try again.");
  }

  // Läser svaret och lämnar tillbaka filmlistan.
  const data = await response.json();
  return data.results;
}

// Hämtar detaljer om en film med hjälp av dess id.
/** @param {string} movieId Filmens id. */
export async function getMovieDetails(movieId) {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/" + movieId + "?language=en-US",
    {
      headers: {
        Authorization: "Bearer " + process.env.EXPO_PUBLIC_TMDB_TOKEN,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Could not load movie details. Please try again.");
  }

  // Läser svaret och lämnar tillbaka filmens information.
  const data = await response.json();
  return data;
}

// Hämtar TMDb:s filmgenrer med engelska namn.
export async function getMovieGenres() {
  const response = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    {
      headers: {
        Authorization: "Bearer " + process.env.EXPO_PUBLIC_TMDB_TOKEN,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Could not load genres. Please try again.");
  }

  const data = await response.json(); // Läser svaret som JavaScript-data.
  return data.genres; // Lämnar tillbaka genrelistan.
}
