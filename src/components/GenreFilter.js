// Visar genreknappar som används i katalogen och i My jar.

import { Pressable, StyleSheet, View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { getMovieGenres } from "../../services/tmdb";

/** @param {{ selectedGenre: number, onSelect: (genreId: number) => void }} props */
export default function GenreFilter({ selectedGenre, onSelect }) {
  /** @type {{ id: number, name: string }[]} */
  const initialGenres = [];

  const [genres, setGenres] = useState(initialGenres);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hämtar genrernas namn och id från TMDb när filtret startar.
  useEffect(() => {
    async function loadGenres() {
      try {
        const fetchedGenres = await getMovieGenres();
        setGenres(fetchedGenres);
      } catch {
        setError("Could not load genres. Please restart the app.");
      } finally {
        setLoading(false);
      }
    }

    loadGenres();
  }, []);

  return (
    <View style={{ width: "100%", marginVertical: 10 }}>
      {loading && <Text>Loading genres...</Text>}
      {error !== "" && <Text>{error}</Text>}

      {/* Meddelar skärmen vilken genre som valts. 0 betyder All genres. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 50 }}
      >
        <Pressable
          onPress={() => onSelect(0)}
          style={[
            styles.genreButton,
            selectedGenre === 0 && styles.selectedButton,
          ]}
        >
          <Text
            style={[
              styles.genreText,
              selectedGenre === 0 && styles.selectedText,
            ]}
          >
            All genres
          </Text>
        </Pressable>

        {genres.map((genre) => (
          <Pressable
            key={genre.id}
            onPress={() => onSelect(genre.id)}
            style={[
              styles.genreButton,
              selectedGenre === genre.id && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.genreText,
                selectedGenre === genre.id && styles.selectedText,
              ]}
            >
              {genre.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  genreButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: "#6b3fa0",
  },
  genreText: {
    color: "#6b3fa0",
    fontSize: 14,
  },
  selectedText: {
    color: "#ffffff",
  },
});
