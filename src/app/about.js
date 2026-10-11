import { ScrollView, Text } from "react-native";
import { Image } from "expo-image";

// Visar information om Movie Jar och var filmdatan kommer från.
export default function About() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Movie Jar</Text>
      <Text>Save movies. Shake the jar. Pick your next watch.</Text>
      {/* Visar TMDb:s logotyp utan att beskära eller sträcka den. */}
      <Image
        source={require("../../assets/tmdb-logo.svg")}
        style={{ width: 180, height: 40, marginTop: 20 }}
        contentFit="contain"
      />
      {/* TMDb:s obligatoriska attributionstext. */}
      <Text>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </Text>
    </ScrollView>
  );
}
