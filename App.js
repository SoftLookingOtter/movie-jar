import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getPopularMovies, searchMovies } from "./services/tmdb";
import { useState, useEffect } from "react"; // useState hanterar komponentens state. useEffect kör kod efter rendering, till exempel API-anropet i detta fall.

export default function App() {
  // Beskriver filmlistan för typkontrollen: varje film har ett id och en titel.
  /** @type {{ id: number, title: string }[]} */
  const initialMovies = [];
  const [movies, setMovies] = useState(initialMovies); // Tom filmlista. setMovies uppdaterar listan.
  const [loading, setLoading] = useState(true); // true betyder att vi väntar på filmer.
  const [error, setError] = useState(""); // Felmeddelande. Tom text betyder inget fel.
  const [searchQuery, setSearchQuery] = useState(""); // Sparar texten i sökfältet.

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

  async function handleSearch() {
    const query = searchQuery.trim(); // Tar bort mellanslag i början och slutet.

    setLoading(true); // Visar att en hämtning pågår.
    setError(""); // Tar bort ett tidigare felmeddelande.

    try {
      let fetchedMovies;

      if (query === "") {
        // Tomt sökfält: visa populära filmer igen.
        fetchedMovies = await getPopularMovies();
      } else {
        // Annars: sök efter texten som användaren skrivit.
        fetchedMovies = await searchMovies(query);
      }

      setMovies(fetchedMovies); // Uppdaterar filmlistan.
    } catch {
      setMovies([]); // Tömmer listan om hämtningen misslyckas.
      setError("Could not load movies. Please try again.");
    } finally {
      setLoading(false); // Avslutar laddningen.
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Jar</Text>
      <Text>Save movies. Shake the jar. Pick your next watch.</Text>

      {/* Sökfält som sparar den inskrivna texten i searchQuery. */}
      <TextInput
        placeholder="Search movies"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, width: "90%" }}
      />

      {/* Startar sökningen när användaren trycker på knappen. */}
      <Button title="Search" onPress={handleSearch} disabled={loading} />

      {loading && <Text>Loading movies...</Text>}
      {/* Visar felmeddelandet om error som är sparat i state inte är en tom text. */}
      {error !== "" && <Text>{error}</Text>}
      {/* Visar ett meddelande när hämtningen lyckats men filmlistan är tom. */}
      {!loading && error === "" && movies.length === 0 && (
        <Text>No movies found. Try another search.</Text>
      )}
      {/* Visar antalet filmer när laddningen är klar och inget fel finns. */}
      {!loading && error === "" && <Text>Movies loaded: {movies.length}</Text>}
      {/* Visar filmernas titlar i en rullbar lista. */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        style={{ width: "100%", maxHeight: 300 }}
      />
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
