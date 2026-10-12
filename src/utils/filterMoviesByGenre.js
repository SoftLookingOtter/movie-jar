// Behåller filmer som matchar den valda genren.

/**
 * @param {{ id: number, title: string, genre_ids?: number[], genres?: { id: number }[] }[]} movies
 * @param {number} genreId
 */
export function filterMoviesByGenre(movies, genreId) {
  if (genreId === 0) {
    return movies; // All genres: lämnar tillbaka hela listan.
  }

  // TMDb använder olika genrefält för filmlistor och filmdetaljer.
  return movies.filter((movie) => {
    if (movie.genre_ids) {
      return movie.genre_ids.includes(genreId); // Filmer från katalogen.
    }

    if (movie.genres) {
      return movie.genres.some((genre) => genre.id === genreId); // Filmer från detaljvyn.
    }

    return false; // Filmer utan genreinformation matchar inte filtret.
  });
}
