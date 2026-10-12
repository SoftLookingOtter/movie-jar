// Sparar och läser tillbaka filmburken på telefonen med AsyncStorage.
// saveJar sparar burken och loadJar läser tillbaka den.

import AsyncStorage from "@react-native-async-storage/async-storage";

// Sparar burkens filmlista på telefonen.
/** @param {{ id: number, title: string }[]} movies */
export async function saveJar(movies) {
  const json = JSON.stringify(movies); // Gör filmlistan till JSON-text.
  await AsyncStorage.setItem("movie-jar", json); // Sparar texten på telefonen.
}

// Läser tillbaka burkens sparade filmlista.
export async function loadJar() {
  const json = await AsyncStorage.getItem("movie-jar");

  // Om ingen burk har sparats ännu får vi en tom lista.
  if (json === null) {
    return [];
  }

  return JSON.parse(json); // Gör JSON-texten till en JavaScript-lista igen.
}
