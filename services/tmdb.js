export async function getPopularMovies() {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US",
    {
      headers: {
        Authorization: "Bearer " + process.env.EXPO_PUBLIC_TMDB_TOKEN,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Could not load movies. Please try again.");
  }

  const data = await response.json();
  return data.results;
}
