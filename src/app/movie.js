// Visar detaljer om en film och låter användaren ändra burken.
// Samma skärm används även för filmer som slumpats fram.

import {
  Image,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { getMovieDetails } from "../../services/tmdb";
import { useDispatch, useSelector } from "react-redux";
import { addMovie, removeMovie, selectJarMovies } from "../store/jarSlice";
import { getRandomMovie } from "../utils/randomMovie";
import { filterMoviesByGenre } from "../utils/filterMoviesByGenre";

export default function MovieDetails() {
  const { id, fromShake, genreId } = useLocalSearchParams(); // Hämtar parametrar från URL:en, t.ex. filmens id, om den kom från en slumpning och valt genreId. UseLocalSearchParams är en hook från expo-router.
  const dispatch = useDispatch(); // UseDispatch är en hook från react-redux som ger tillgång till Redux-dispatchfunktionen.
  const savedMovies = useSelector(selectJarMovies); // UseSelector är en hook från react-redux som hämtar state från Redux, här hämtas burkens filmer.

  // Avgör om knappen ska visa Add to jar eller Remove from jar.
  const isInJar = savedMovies.some(
    (savedMovie) => savedMovie.id.toString() === id,
  ); // Är true om filmen redan finns i burken, annars false.

  // Använder genren från länken. Saknas den väljs All genres (0).
  const selectedGenre = typeof genreId === "string" ? Number(genreId) : 0;
  const filteredMovies = filterMoviesByGenre(savedMovies, selectedGenre); // Här körs funktionen från utils/filterMoviesByGenre.js för att filtrera burkens filmer baserat på den valda genren.

  const initialMovie =
    /** @type {{ id: number, title: string, overview: string, poster_path: string | null } | null} */ (
      null
    );

  const [movie, setMovie] = useState(initialMovie);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Slumpar igen bland sparade filmer som matchar burkens genrefilter.
  function handleShakeAgain() {
    const randomMovie = getRandomMovie(filteredMovies); // Kör funktionen från utils/randomMovie.js för att slumpa fram en film från de filtrerade burkfilmerna.

    if (randomMovie === null) {
      return;
    }

    // Byter ut filmen så att bakåtknappen fortfarande leder till My jar. Router.push hade lagt till en ny post i historiken, medan router.replace byter ut den nuvarande posten.
    router.replace({
      pathname: "/movie",
      params: {
        id: randomMovie.id.toString(),
        fromShake: "true",
        genreId: selectedGenre.toString(),
      },
    });
  }

  // Hämtar detaljer när skärmen öppnas eller filmens id ändras.
  useEffect(() => {
    async function loadMovie() {
      setLoading(true);
      setError("");
      setMovie(null);

      try {
        if (typeof id !== "string") {
          throw new Error("Missing movie ID.");
        }

        const fetchedMovie = await getMovieDetails(id); // Hämtar filmens detaljer från TMDB API.
        setMovie(fetchedMovie);
      } catch {
        setError("Could not load movie details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f0e6ff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {loading && <Text>Loading movie...</Text>}
      {error !== "" && <Text>{error}</Text>}

      {movie !== null && (
        <View>
          <Text style={styles.title}>{movie.title}</Text>

          {/* Shake again visas när filmen har öppnats genom en slumpning. */}
          {fromShake === "true" && (
            <Pressable
              onPress={handleShakeAgain}
              disabled={filteredMovies.length === 0}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.button,
                { opacity: filteredMovies.length === 0 || pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.buttonText}>Shake again</Text>
            </Pressable>
          )}

          {fromShake === "true" && filteredMovies.length === 0 && (
            <Text>
              No saved movies match this genre. Go back to My jar to add a movie
              or select All genres.
            </Text>
          )}

          {/* Skickar ett kommando till Redux för att lägga till eller ta bort filmen. */}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (isInJar) {
                dispatch(removeMovie(movie.id));
              } else {
                dispatch(addMovie(movie));
              }
            }}
            style={({ pressed }) => [
              styles.button,
              isInJar && styles.removeButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={[styles.buttonText, isInJar && styles.removeText]}>
              {isInJar ? "Remove from jar" : "Add to jar"}
            </Text>
          </Pressable>

          {movie.poster_path !== null && (
            <Image
              source={{
                uri: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
              }}
              style={styles.poster}
              resizeMode="contain"
            />
          )}

          <Text style={styles.description}>{movie.overview}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6b3fa0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#fbe9ef",
  },
  removeText: {
    color: "#9c2845",
  },
  poster: {
    width: "55%",
    aspectRatio: 2 / 3,
    alignSelf: "center",
    borderRadius: 12,
    marginVertical: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2f1b46",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#443550",
  },
});
