import { Image, Text, View, Button, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { getMovieDetails } from "../../services/tmdb";
import { useDispatch, useSelector } from "react-redux";
import { addMovie, removeMovie, selectJarMovies } from "../store/jarSlice";
import { getRandomMovie } from "../utils/randomMovie";
import { filterMoviesByGenre } from "../utils/filterMoviesByGenre";

// Visar detaljskärmen. Här kommer jag att visa information om en specifik film.
export default function MovieDetails() {
  const { id, fromShake, genreId } = useLocalSearchParams();
  const dispatch = useDispatch(); // Hämtar funktionen som skickar kommandon till Redux.
  const savedMovies = useSelector(selectJarMovies); // Läser burkens filmer.

  // Kontrollerar om filmen på denna skärm redan finns i burken.
  const isInJar = savedMovies.some(
    (savedMovie) => savedMovie.id.toString() === id,
  );

  // Gör genrens id från länken till ett nummer. Saknas det används All genres.
  const selectedGenre = typeof genreId === "string" ? Number(genreId) : 0;
  const filteredMovies = filterMoviesByGenre(savedMovies, selectedGenre);

  // Värdet får vara ett filmobjekt eller null.
  const initialMovie =
    /** @type {{ id: number, title: string, overview: string, poster_path: string | null } | null} */ (
      null
    );

  const [movie, setMovie] = useState(initialMovie); // Ingen film hämtad från början.
  const [loading, setLoading] = useState(true); // Vi väntar på filmens information.
  const [error, setError] = useState(""); // Tom text betyder inget fel.

  // Slumpar igen bland burkens filmer som matchar den valda genren.
  function handleShakeAgain() {
    const randomMovie = getRandomMovie(filteredMovies);

    if (randomMovie === null) {
      return; // Avslutar om inga filmer matchar.
    }

    router.replace({
      pathname: "/movie",
      params: {
        id: randomMovie.id.toString(),
        fromShake: "true",
        genreId: selectedGenre.toString(), // Behåller samma genrefilter.
      },
    });
  }

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
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      {loading && <Text>Loading movie...</Text>}
      {error !== "" && <Text>{error}</Text>}

      {/* Visar filminformationen när en film har hämtats. */}
      {movie !== null && (
        <View>
          <Text>{movie.title}</Text>
          {/* Visar slumpknappen när filmen öppnats genom en slumpning. */}
          {fromShake === "true" && (
            <Button
              title="Shake again"
              onPress={handleShakeAgain}
              disabled={filteredMovies.length === 0}
            />
          )}
          {/* Förklarar varför Shake again är inaktiv om inga filmer matchar. */}
          {fromShake === "true" && filteredMovies.length === 0 && (
            <Text>
              No saved movies match this genre. Go back to My jar to add a movie
              or select All genres.
            </Text>
          )}
          {/* Lägger till eller tar bort filmen beroende på om den är sparad. */}
          <Button
            title={isInJar ? "Remove from jar" : "Add to jar"}
            onPress={() => {
              if (isInJar) {
                dispatch(removeMovie(movie.id));
              } else {
                dispatch(addMovie(movie));
              }
            }}
          />
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
    </ScrollView>
  );
}
