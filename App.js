import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { getPopularMovies } from "./services/tmdb";
import { useState, useEffect } from "react"; // useState hanterar komponentens state. useEffect kör kod efter rendering, till exempel API-anropet i detta fall.

export default function App() {
  const [movies, setMovies] = useState([]); // Tom filmlista. setMovies uppdaterar listan.
  const [loading, setLoading] = useState(true); // true betyder att vi väntar på filmer.
  const [error, setError] = useState(""); // Felmeddelande. Tom text betyder inget fel.

  useEffect(() => {
    async function loadMovies() {
      try {
        // Hämtar filmerna och sparar dem i vårt state.
        const fetchedMovies = await getPopularMovies();
        setMovies(fetchedMovies);
      } catch {
        // Sparar ett felmeddelande om hämtningen misslyckas.
        setError("Could not load movies. Please try again.");
      } finally {
        // Avslutar laddningen oavsett om hämtningen lyckades eller inte.
        setLoading(false);
      }
    }

    loadMovies(); // Startar hämtningen.
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Jar</Text>
      <Text>Save movies. Shake the jar. Pick your next watch.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0e6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
