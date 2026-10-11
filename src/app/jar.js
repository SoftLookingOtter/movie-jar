import { Button, FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeMovie, selectJarMovies } from "../store/jarSlice";
import { router, Link } from "expo-router";
import { getRandomMovie } from "../utils/randomMovie";
import { useState } from "react";
import GenreFilter from "../components/GenreFilter";
import { filterMoviesByGenre } from "../utils/filterMoviesByGenre";

// Visar användarens filmburk.
export default function MyJar() {
  const movies = useSelector(selectJarMovies); // Läser filmerna i burken.
  const dispatch = useDispatch();
  const [selectedGenre, setSelectedGenre] = useState(0); // All genres är standard.
  const filteredMovies = filterMoviesByGenre(movies, selectedGenre); // Filmer som matchar genren.

  // Slumpar en film ur burken och öppnar dess detaljer.
  function handleShake() {
    const randomMovie = getRandomMovie(filteredMovies);

    if (randomMovie === null) {
      return; // Avslutar om burken är tom.
    }

    router.push({
      pathname: "/movie",
      params: {
        id: randomMovie.id.toString(),
        fromShake: "true",
        genreId: selectedGenre.toString(), // Skickar med burkens valda genre.
      },
    });
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <GenreFilter onSelect={setSelectedGenre} />
      {/* Slumpar en film när användaren trycker. */}
      <Button
        title="Shake the jar"
        onPress={handleShake}
        disabled={filteredMovies.length === 0}
      />
      {/* Visar filmerna som sparats i burken. */}
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            {/* Öppnar detaljerna för den sparade filmen. */}
            <Link
              href={{
                pathname: "/movie",
                params: { id: item.id.toString() },
              }}
            >
              {item.title}
            </Link>
            {/* Tar bort denna film från burken. */}
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
