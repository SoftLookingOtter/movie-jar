import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useEffect, useState } from "react";
import { loadJar, saveJar } from "../../services/jarStorage";
import { restoreJar } from "../store/jarSlice";
import { Text } from "react-native";

// Ger alla skärmar tillgång till vår Redux-store.
export default function RootLayout() {
  const [jarLoaded, setJarLoaded] = useState(false); // Har den sparade burken lästs klart?
  const [storageError, setStorageError] = useState(""); // Felmeddelande för lagringen.

  // Läser den sparade burken när appen startar.
  useEffect(() => {
    async function loadSavedJar() {
      try {
        const savedMovies = await loadJar(); // Läser listan från telefonen.
        store.dispatch(restoreJar(savedMovies)); // Lägger listan i Redux.
        setJarLoaded(true); // Läsningen lyckades.
      } catch {
        setStorageError("Could not load your jar. Please restart the app.");
      }
    }

    loadSavedJar(); // Startar läsningen.
  }, []);

  // Sparar burken när Redux får en uppdatering.
  useEffect(() => {
    if (!jarLoaded) {
      return; // Börjar inte spara förrän den gamla burken har lästs.
    }

    const unsubscribe = store.subscribe(() => {
      const movies = store.getState().jar.movies; // Läser burkens aktuella lista.

      saveJar(movies).catch(() => {
        setStorageError(
          "Could not save your jar. Your latest changes may not be kept.",
        );
      });
    });

    return unsubscribe; // Slutar lyssna när effekten städas bort.
  }, [jarLoaded]);

  // Visar ett meddelande om läsningen misslyckades.
  if (storageError !== "") {
    return <Text style={{ marginTop: 60 }}>{storageError}</Text>;
  }

  // Väntar med att visa appens skärmar tills burken har lästs.
  if (!jarLoaded) {
    return <Text style={{ marginTop: 60 }}>Loading your jar...</Text>;
  }

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Browse movies" }} />
      </Stack>
    </Provider>
  );
}
