// Visar information om Movie Jar och anger att filmdatan kommer från TMDb.

import { ScrollView, Text } from "react-native";
import { Image } from "expo-image";

export default function About() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Movie Jar</Text>
      <Text>Save movies. Shake the jar. Pick your next watch.</Text>

      <Image
        source={require("../../assets/tmdb-logo.svg")}
        style={{ width: 180, height: 40, marginTop: 20 }}
        contentFit="contain"
      />

      {/* Text som krävs när TMDb:s API används. */}
      <Text>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </Text>
    </ScrollView>
  );
}
