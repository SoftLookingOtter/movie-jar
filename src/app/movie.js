import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

// Visar detaljskärmen. Här kommer jag att visa information om en specifik film.
export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Movie details</Text>
      <Text>Movie ID: {id}</Text>
    </View>
  );
}
