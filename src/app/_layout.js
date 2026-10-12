// Ger skärmarna tillgång till Redux-store i store.js, där burkens filmlista finns.
// // Använder jarStorage.js för att läsa och spara burken på telefonen (lokal lagring genom AsyncStorage).

import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useEffect, useState } from "react";
import { loadJar, saveJar } from "../../services/jarStorage";
import { restoreJar } from "../store/jarSlice";
import { Text } from "react-native";

export default function RootLayout() {
  const [jarLoaded, setJarLoaded] = useState(false); // Är den sparade burken inläst?
  const [storageError, setStorageError] = useState(""); // Feltext vid läsning eller sparande.

  // Läser den sparade filmlistan när appen startar.
  useEffect(() => {
    async function loadSavedJar() {
      try {
        const savedMovies = await loadJar(); // Läser den sparade filmlistan från telefonen.
        store.dispatch(restoreJar(savedMovies)); // Skickar listan till Redux.
        setJarLoaded(true);
      } catch {
        setStorageError("Could not load your jar. Please restart the app.");
      }
    }

    loadSavedJar(); // Kör funktionen ovan när appen startar (men kör inte igen vid senare renderingar)
  }, []);

  // Lyssnar på Redux och sparar burkens aktuella lista på telefonen.
  useEffect(() => {
    if (!jarLoaded) {
      return; // Väntar med sparandet tills den gamla listan har lästs.
    }

    const unsubscribe = store.subscribe(() => {
      const movies = store.getState().jar.movies;

      saveJar(movies).catch(() => {
        setStorageError(
          "Could not save your jar. Your latest changes may not be kept.",
        );
      });
    });

    return unsubscribe; // React använder denna funktion för att avsluta lyssningen.
  }, [jarLoaded]);

  // Visar fel vid läsning eller sparande.
  if (storageError !== "") {
    return <Text style={{ marginTop: 60 }}>{storageError}</Text>;
  }

  // Visar laddningstext tills den sparade burken är inläst.
  if (!jarLoaded) {
    return <Text style={{ marginTop: 60 }}>Loading your jar...</Text>;
  }

  // Provider ger skärmarna nedan tillgång till vår Redux-store.
  return (
    <Provider store={store}>
      <Stack>
        {/* Rubriken högst upp på varje skärm. */}
        <Stack.Screen name="index" options={{ title: "Browse movies" }} />
        <Stack.Screen name="jar" options={{ title: "My jar" }} />
        <Stack.Screen name="movie" options={{ title: "Movie details" }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
      </Stack>
    </Provider>
  );
}
