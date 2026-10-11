import { Image, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { getMovieDetails } from "../../services/tmdb";

// Visar detaljskärmen. Här kommer jag att visa information om en specifik film.
export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  // Värdet får vara ett filmobjekt eller null.
  const initialMovie =
    /** @type {{ id: number, title: string, overview: string, poster_path: string | null } | null} */ (
      null
    );

  const [movie, setMovie] = useState(initialMovie); // Ingen film hämtad från början.
  const [loading, setLoading] = useState(true); // Vi väntar på filmens information.
  const [error, setError] = useState(""); // Tom text betyder inget fel.

  // Hämtar filmens detaljer när skärmen öppnas eller filmens id ändras.
  useEffect(() => {
    async function loadMovie() {
      setLoading(true);
      setError("");
      setMovie(null);

      try {
        // Kontrollerar att länken skickat med ett id som text.
        if (typeof id !== "string") {
          throw new Error("Missing movie ID.");
        }

        const fetchedMovie = await getMovieDetails(id);
        setMovie(fetchedMovie); // Sparar filmens information i state.
      } catch {
        setError("Could not load movie details. Please try again.");
      } finally {
        setLoading(false); // Avslutar laddningen även om något gick fel.
      }
    }

    loadMovie(); // Startar hämtningen.
  }, [id]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Movie details</Text>
      <Text>Movie ID: {id}</Text>
      {loading && <Text>Loading movie...</Text>}
      {error !== "" && <Text>{error}</Text>}

      {/* Visar filminformationen när en film har hämtats. */}
      {movie !== null && (
        <View>
          <Text>{movie.title}</Text>
          {/* Visar affischen om filmen har en bildsökväg. */}
          {movie.poster_path !== null && (
            <Image
              source={{
                uri: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
              }}
              style={{ width: 200, height: 300 }}
              resizeMode="contain"
            />
          )}
          <Text>{movie.overview}</Text>
        </View>
      )}
    </View>
  );
}
