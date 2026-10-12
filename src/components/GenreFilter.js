// Visar genreknappar som används i katalogen och i My jar.

import { Button, View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { getMovieGenres } from "../../services/tmdb";

/** @param {{ onSelect: (genreId: number) => void }} props */
export default function GenreFilter({ onSelect }) {
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
      <ScrollView horizontal style={{ maxHeight: 50 }}>
        <Button title="All genres" onPress={() => onSelect(0)} />

        {genres.map((genre) => (
          <View key={genre.id} style={{ marginLeft: 8 }}>
            <Button title={genre.name} onPress={() => onSelect(genre.id)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
