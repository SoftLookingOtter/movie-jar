import { Button, FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeMovie, selectJarMovies } from "../store/jarSlice";

// Visar användarens filmburk.
export default function MyJar() {
  const movies = useSelector(selectJarMovies); // Läser filmerna i burken.
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>My jar</Text>
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
