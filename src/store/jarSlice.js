// Här finns reglerna(restoreJar, addMovie, removeMovie) för att ändra innehållet i filmburken.

import { createSlice } from "@reduxjs/toolkit";

// Burkens startvärde: en tom filmlista.
/** @type {{ movies: { id: number, title: string }[] }} */
const initialState = {
  movies: [],
};

// Skapar själva burkskivan (jarSlice=Redux-slice för filmburken) med dess kommandon och regler.
const jarSlice = createSlice({
  name: "jar",
  initialState, // Burkens startvärde.
  // Samlar reglerna som Redux använder för att ändra burkens innehåll.
  reducers: {
    // RESTORE: återställer burken med tidigare sparade filmer (från telefonen).
    restoreJar(state, action) {
      // state.movies är burkens lista. action.payload är listan från kommandot.
      // Vid appstart skickar _layout.js hit listan som loadJar() läst från telefonen.
      state.movies = action.payload;
    },

    // ADD: lägger till en ny film i burken om den inte redan finns.
    addMovie(state, action) {
      const alreadyInJar = state.movies.some(
        (savedMovie) => savedMovie.id === action.payload.id,
      );

      if (!alreadyInJar) {
        state.movies.push(action.payload);
      }
    },

    // REMOVE: tar bort en film från burken.
    removeMovie(state, action) {
      state.movies = state.movies.filter(
        (movie) => movie.id !== action.payload,
      );
    },
  },
});

// Gör burkens kommandon tillgängliga för andra filer. Används av komponenter som vill ändra innehållet i filmburken.
export const { restoreJar, addMovie, removeMovie } = jarSlice.actions;

// Exporterar funktionen som Redux byggt av reglerna ovan, som  väljer och kör rätt reducer baserat på inkommande actions. Används av store.js.
export default jarSlice.reducer;

// Hämtar filmlistan från den gemensamma burken.
/** @param {{ jar: typeof initialState }} state */
export function selectJarMovies(state) {
  return state.jar.movies;
}
