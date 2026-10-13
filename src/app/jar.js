// Visar sparade filmer i My jar och låter användaren ta bort eller slumpa filmer.

import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeMovie, selectJarMovies } from "../store/jarSlice";
import { router, Link } from "expo-router";
import { getRandomMovie } from "../utils/randomMovie";
import { useState } from "react";
import GenreFilter from "../components/GenreFilter";
import { filterMoviesByGenre } from "../utils/filterMoviesByGenre";

export default function MyJar() {
  const movies = useSelector(selectJarMovies); // Läser burkens lista från jarSlice i Redux.
  const dispatch = useDispatch(); // UseDispatch är en hook från react-redux som ger tillgång till Redux-dispatchfunktionen.
  const [selectedGenre, setSelectedGenre] = useState(0); // 0 betyder All genres.
  const filteredMovies = filterMoviesByGenre(movies, selectedGenre);

  // Slumpar en film som matchar genrefiltret och öppnar dess detaljer.
  function handleShake() {
    const randomMovie = getRandomMovie(filteredMovies);

    if (randomMovie === null) {
      return;
    }

    router.push({
      // push lägger till en ny post i historiken, till skillnad från router.replace som byter ut den nuvarande posten.
      pathname: "/movie",
      params: {
        id: randomMovie.id.toString(),
        fromShake: "true", // Gör att detaljskärmen visar Shake again.
        genreId: selectedGenre.toString(), // Behåller filtret på detaljskärmen.
      },
    });
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f0e6ff" }}>
      <GenreFilter selectedGenre={selectedGenre} onSelect={setSelectedGenre} />

      <Pressable
        onPress={handleShake}
        disabled={filteredMovies.length === 0}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.shakeButton,
          { opacity: filteredMovies.length === 0 || pressed ? 0.6 : 1 },
        ]}
      >
        <Text style={styles.shakeText}>Shake the jar</Text>
      </Pressable>

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <Link
              href={{
                pathname: "/movie",
                params: { id: item.id.toString() },
              }}
              asChild
            >
              <Pressable style={{ paddingBottom: 12 }}>
                <Text style={styles.movieTitle}>{item.title}</Text>
                <Text style={styles.movieHint}>View details →</Text>
              </Pressable>
            </Link>

            <Pressable
              onPress={() => dispatch(removeMovie(item.id))}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.removeButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.removeText}>Remove from jar</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text>
            {movies.length === 0
              ? "Your jar is empty."
              : "No saved movies match this genre. Select All genres."}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  movieCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  movieTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2f1b46",
  },
  movieHint: {
    color: "#6b3fa0",
    marginTop: 6,
  },
  removeButton: {
    backgroundColor: "#fbe9ef",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  removeText: {
    color: "#9c2845",
    fontSize: 16,
    fontWeight: "bold",
  },
  shakeButton: {
    backgroundColor: "#6b3fa0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  shakeText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
