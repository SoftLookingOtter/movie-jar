// Visar filmkatalogen med sökning, genrefilter och länkar till filmdetaljer.

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
} from "react-native";
import { getPopularMovies, searchMovies } from "../../services/tmdb";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import GenreFilter from "../components/GenreFilter";
import { filterMoviesByGenre } from "../utils/filterMoviesByGenre";
import { SafeAreaView } from "react-native-safe-area-context";

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
    if (loading) {
      return;
    }

    Keyboard.dismiss(); // Stänger tangentbordet när användaren söker.
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Movie Jar</Text>
      <Text>Save movies. Shake the jar. Pick your next watch.</Text>

      <View style={styles.navigation}>
        <Link href="/jar" asChild>
          <Pressable style={styles.navigationButton}>
            <Text style={styles.navigationText}>My jar</Text>
          </Pressable>
        </Link>

        <Link href="/about" asChild>
          <Pressable style={styles.navigationButton}>
            <Text style={styles.navigationText}>About</Text>
          </Pressable>
        </Link>
      </View>

      <TextInput
        placeholder="Search movies"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        style={styles.searchInput}
      />

      <Pressable
        onPress={handleSearch}
        disabled={loading}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.navigationButton,
          styles.searchButton,
          { opacity: loading || pressed ? 0.6 : 1 },
        ]}
      >
        <Text style={styles.navigationText}>Search</Text>
      </Pressable>

      <GenreFilter selectedGenre={selectedGenre} onSelect={setSelectedGenre} />

      {loading && <Text>Loading movies...</Text>}
      {error !== "" && <Text>{error}</Text>}

      {/* Visar inga träffar först när hämtningen är klar och inget fel uppstått. */}
      {!loading && error === "" && filteredMovies.length === 0 && (
        <Text>No movies match. Try another search or select All genres.</Text>
      )}

      {!loading && error === "" && (
        <Text style={styles.movieCount}>
          {filteredMovies.length}{" "}
          {filteredMovies.length === 1 ? "movie" : "movies"}
        </Text>
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
            asChild
          >
            <Pressable style={styles.movieCard}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.movieHint}>View details →</Text>
            </Pressable>
          </Link>
        )}
        style={{ width: "100%", flex: 1, marginTop: 12 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0e6ff",
    alignItems: "center",
    padding: 20,
  },
  navigation: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 16,
  },
  navigationButton: {
    backgroundColor: "#6b3fa0",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  navigationText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  movieCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
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
  searchInput: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d5c3eb",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#2f1b46",
    marginBottom: 10,
  },
  movieCount: {
    alignSelf: "flex-start",
    fontSize: 14,
    color: "#655575",
  },
  searchButton: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
