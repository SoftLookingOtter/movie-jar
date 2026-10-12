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
  const { id, fromShake, genreId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const savedMovies = useSelector(selectJarMovies);

  // Avgör om knappen ska visa Add to jar eller Remove from jar.
  const isInJar = savedMovies.some(
    (savedMovie) => savedMovie.id.toString() === id,
  );

  // Använder genren från länken. Saknas den väljs All genres (0).
  const selectedGenre = typeof genreId === "string" ? Number(genreId) : 0;
  const filteredMovies = filterMoviesByGenre(savedMovies, selectedGenre);

  const initialMovie =
    /** @type {{ id: number, title: string, overview: string, poster_path: string | null } | null} */ (
      null
    );

  const [movie, setMovie] = useState(initialMovie);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Slumpar igen bland sparade filmer som matchar burkens genrefilter.
  function handleShakeAgain() {
    const randomMovie = getRandomMovie(filteredMovies);

    if (randomMovie === null) {
      return;
    }

    // Byter ut filmen så att bakåtknappen fortfarande leder till My jar.
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

        const fetchedMovie = await getMovieDetails(id);
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
