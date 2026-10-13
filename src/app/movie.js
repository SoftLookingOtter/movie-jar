// Visar detaljer om en film och låter användaren ändra burken.
// Samma skärm används även för filmer som slumpats fram.

import { Image, Text, View, Button, ScrollView } from "react-native";
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
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      {loading && <Text>Loading movie...</Text>}
      {error !== "" && <Text>{error}</Text>}

      {movie !== null && (
        <View>
          <Text>{movie.title}</Text>

          {/* Shake again visas när filmen har öppnats genom en slumpning. */}
          {fromShake === "true" && (
            <Button
              title="Shake again"
              onPress={handleShakeAgain}
              disabled={filteredMovies.length === 0}
            />
          )}

          {fromShake === "true" && filteredMovies.length === 0 && (
            <Text>
              No saved movies match this genre. Go back to My jar to add a movie
              or select All genres.
            </Text>
          )}

          {/* Skickar ett kommando till Redux för att lägga till eller ta bort filmen. */}
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
