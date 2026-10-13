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
      // lista med den här filmens genre-id:n från TMDb filmlista.
      return movie.genre_ids.includes(genreId); // kontrollerar om den valda genren finns bland filmens genre-id:n. True om matchar, annars false.
    }

    if (movie.genres) {
      // lista med den här filmens genre-id:n från TMDb filmdetaljer.
      return movie.genres.some((genre) => genre.id === genreId); // kontrollerar om den valda genren finns bland filmens genre-id:n från detaljvyn. True om matchar, annars false.
    }

    return false; // Filmer utan genreinformation matchar inte filtret.
  });
}
