// Behåller filmer som matchar den valda genren.
/**
 * @param {{ id: number, title: string, genre_ids?: number[], genres?: { id: number }[] }[]} movies
 * @param {number} genreId
 */
export function filterMoviesByGenre(movies, genreId) {
  if (genreId === 0) {
    return movies; // All genres: lämnar tillbaka hela listan.
  }

  return movies.filter((movie) => {
    if (movie.genre_ids) {
      return movie.genre_ids.includes(genreId); // Genrer från katalogen.
    }

    if (movie.genres) {
      return movie.genres.some((genre) => genre.id === genreId); // Genrer från detaljerna.
    }

    return false; // Filmen saknar genreinformation.
  });
}
