import { Button, FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeMovie, selectJarMovies } from "../store/jarSlice";
import { router } from "expo-router";

// Visar användarens filmburk.
export default function MyJar() {
  const movies = useSelector(selectJarMovies); // Läser filmerna i burken.
  const dispatch = useDispatch();

  // Slumpar en film ur burken och öppnar dess detaljer.
  function handleShake() {
    if (movies.length === 0) {
      return; // Avslutar om burken är tom.
    }

    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex]; // Hämtar filmen på den slumpade platsen.

    router.push({
      pathname: "/movie",
      params: { id: randomMovie.id.toString() },
    });
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>My jar</Text>
      {/* Slumpar en film när användaren trycker. */}
      <Button
        title="Shake the jar"
        onPress={handleShake}
        disabled={movies.length === 0}
      />
      {/* Visar filmerna som sparats i burken. */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <Text>{item.title}</Text>
            {/* Tar bort denna film från burken. */}
            <Button
              title="Remove from jar"
              onPress={() => dispatch(removeMovie(item.id))}
            />
          </View>
        )}
        ListEmptyComponent={<Text>Your jar is empty.</Text>}
      />
    </View>
  );
}
