import { Stack } from "expo-router"; // Hämtar navigationen för våra skärmar.

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Browse movies" }} />
    </Stack>
  );
}
