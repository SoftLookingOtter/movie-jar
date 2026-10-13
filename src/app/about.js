// Visar information om Movie Jar och anger att filmdatan kommer från TMDb.

import { ScrollView, Text } from "react-native";
import { Image } from "expo-image";

export default function About() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f0e6ff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#2f1b46",
          marginBottom: 12,
        }}
      >
        Movie Jar
      </Text>

      <Text style={{ fontSize: 16, lineHeight: 24, color: "#443550" }}>
        Browse movies, save your favorites, and shake your jar to choose what to
        watch.
      </Text>

      <Image
        source={require("../../assets/tmdb-logo.svg")}
        style={{ width: 180, height: 40, marginTop: 20 }}
        contentFit="contain"
      />

      {/* Text som krävs när TMDb:s API används. */}
      <Text
        style={{
          fontSize: 14,
          lineHeight: 22,
          color: "#655575",
          marginTop: 12,
        }}
      >
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </Text>
    </ScrollView>
  );
}
