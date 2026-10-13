// Visar filmkatalogen med sökning, genrefilter och länkar till filmdetaljer.

import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getPopularMovies, searchMovies } from "../../services/tmdb";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import GenreFilter from "../components/GenreFilter";
import { filterMoviesByGenre } from "../utils/filterMoviesByGenre";

export default function App() {
  /** @type {{ id: number, title: string }[]} */
  const initialMovies = [];
  const [movies, setMovies] = useState(initialMovies);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(0); // 0 betyder All genres.
  const filteredMovies = filterMoviesByGenre(movies, selectedGenre); // Filtrerar den filmlista som redan hämtats från API:et.

  // Hämtar populära filmer när katalogskärmen startar.
  useEffect(() => {
    async function loadMovies() {
      try {
        const fetchedMovies = await getPopularMovies();
        setMovies(fetchedMovies);
      } catch {
        setError("Could not load movies. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []); // Körs bara en gång när komponenten mountas.

  // Söker efter filmer. Tom söktext visar populära filmer igen.
  async function handleSearch() {
    const query = searchQuery.trim();

    setLoading(true);
    setError("");

    try {
      let fetchedMovies;

      if (query === "") {
        fetchedMovies = await getPopularMovies();
      } else {
        fetchedMovies = await searchMovies(query);
      }

      setMovies(fetchedMovies);
    } catch {
      setMovies([]);
      setError("Could not load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Jar</Text>
      <Text>Save movies. Shake the jar. Pick your next watch.</Text>

      <TextInput
        placeholder="Search movies"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, width: "90%" }}
      />

      <Button title="Search" onPress={handleSearch} disabled={loading} />
      <Link href="/jar">My jar</Link>
      <Link href="/about">About</Link>
      <GenreFilter onSelect={setSelectedGenre} />

      {loading && <Text>Loading movies...</Text>}
      {error !== "" && <Text>{error}</Text>}

      {/* Visar inga träffar först när hämtningen är klar och inget fel uppstått. */}
      {!loading && error === "" && filteredMovies.length === 0 && (
        <Text>No movies match. Try another search or select All genres.</Text>
      )}

      {!loading && error === "" && (
        <Text>Movies shown: {filteredMovies.length}</Text>
      )}

      {/* Varje filmtitel öppnar detaljskärmen med den filmens id. */}
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/movie",
              params: { id: item.id.toString() },
            }}
          >
            {item.title}
          </Link>
        )}
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
