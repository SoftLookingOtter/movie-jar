// Visar sparade filmer i My jar och låter användaren ta bort eller slumpa filmer.

import { Button, FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeMovie, selectJarMovies } from "../store/jarSlice";
import { router, Link } from "expo-router";
import { getRandomMovie } from "../utils/randomMovie";
import { useState } from "react";
import GenreFilter from "../components/GenreFilter";
import { filterMoviesByGenre } from "../utils/filterMoviesByGenre";

export default function MyJar() {
  const movies = useSelector(selectJarMovies); // Läser burkens lista från Redux.
  const dispatch = useDispatch();
  const [selectedGenre, setSelectedGenre] = useState(0); // 0 betyder All genres.
  const filteredMovies = filterMoviesByGenre(movies, selectedGenre);

  // Slumpar en film som matchar genrefiltret och öppnar dess detaljer.
  function handleShake() {
    const randomMovie = getRandomMovie(filteredMovies);

    if (randomMovie === null) {
      return;
    }

    router.push({
      pathname: "/movie",
      params: {
        id: randomMovie.id.toString(),
        fromShake: "true", // Gör att detaljskärmen visar Shake again.
        genreId: selectedGenre.toString(), // Behåller filtret på detaljskärmen.
      },
    });
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <GenreFilter onSelect={setSelectedGenre} />

      <Button
        title="Shake the jar"
        onPress={handleShake}
        disabled={filteredMovies.length === 0}
      />

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <Link
              href={{
                pathname: "/movie",
                params: { id: item.id.toString() },
              }}
            >
              {item.title}
            </Link>

            <Button
              title="Remove from jar"
              onPress={() => dispatch(removeMovie(item.id))}
            />
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
