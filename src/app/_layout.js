// 1. RootLayout läser sparade filmer från telefonen med jarStorage.js
// och lägger dem i Redux med restoreJar från jarSlice.js.
// 2. Sedan visar den skärmarna index.js, jar.js, movie.js och about.js
// och ger dem tillgång till burken i store.js.

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

  // 1. Läser den sparade filmlistan när appen startar och lägger den i Redux.
  useEffect(() => {
    async function loadSavedJar() {
      try {
        const savedMovies = await loadJar(); // Läser den sparade filmlistan från telefonen från jarStorage.js.
        store.dispatch(restoreJar(savedMovies)); // Skickar listan till Redux via jarSlice.js.
        setJarLoaded(true);
      } catch {
        setStorageError("Could not load your jar. Please restart the app.");
      }
    }

    loadSavedJar(); // Kör funktionen ovan när appen startar (men kör inte igen vid senare renderingar, dvs körs inte vid ändringar av komponentens props eller state).
  }, []);

  // Startar lyssningen på Redux när den sparade burken är inläst.
  useEffect(() => {
    if (!jarLoaded) {
      return; // Väntar med sparandet tills den gamla listan har lästs.
    }

    const unsubscribe = store.subscribe(() => {
      //
      const movies = store.getState().jar.movies;

      // Sparar den aktuella filmlistan på telefonen via jarStorage.js.
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

  // 2. Provider ger skärmarna nedan tillgång till vår Redux-store.
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
