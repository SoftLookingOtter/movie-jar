import { Button, View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { getMovieGenres } from "../../services/tmdb";

// Ett genrefilter som kan användas på flera skärmar.
/** @param {{ onSelect: (genreId: number) => void }} props */
export default function GenreFilter({ onSelect }) {
  /** @type {{ id: number, name: string }[]} */
  const initialGenres = [];

  const [genres, setGenres] = useState(initialGenres); // Genrelistan börjar tom.
  const [loading, setLoading] = useState(true); // Vi väntar på genrerna.
  const [error, setError] = useState(""); // Inget fel från början.

  // Hämtar genrerna när filterkomponenten öppnas.
  useEffect(() => {
    async function loadGenres() {
      try {
        const fetchedGenres = await getMovieGenres();
        setGenres(fetchedGenres); // Sparar genrelistan i state.
      } catch {
        setError("Could not load genres. Please restart the app.");
      } finally {
        setLoading(false); // Avslutar laddningen även om något gick fel.
      }
    }

    loadGenres(); // Startar hämtningen.
  }, []);

  return (
    <View style={{ width: "100%", marginVertical: 10 }}>
      {loading && <Text>Loading genres...</Text>}
      {error !== "" && <Text>{error}</Text>}

      {/* Gör genrerna scrollbara åt sidan. */}
      <ScrollView horizontal style={{ maxHeight: 50 }}>
        <Button title="All genres" onPress={() => onSelect(0)} />

        {/* Skapar en knapp för varje genre i listan. */}
        {genres.map((genre) => (
          <View key={genre.id} style={{ marginLeft: 8 }}>
            <Button title={genre.name} onPress={() => onSelect(genre.id)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
