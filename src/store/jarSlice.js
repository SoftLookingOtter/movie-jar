import { createSlice } from "@reduxjs/toolkit";

// Burken börjar med en tom filmlista.
/** @type {{ movies: { id: number, title: string }[] }} */
const initialState = {
  movies: [],
};

// Definierar burkens state och hur det får ändras.
const jarSlice = createSlice({
  name: "jar",
  initialState,
  reducers: {
    addMovie(state, action) {
      const alreadyInJar = state.movies.some(
        (savedMovie) => savedMovie.id === action.payload.id,
      );

      if (!alreadyInJar) {
        state.movies.push(action.payload);
      }
    },
    removeMovie(state, action) {
      // Behåller alla filmer utom den med id:t som skickats med.
      state.movies = state.movies.filter(
        (movie) => movie.id !== action.payload,
      );
    },
  },
});

export const { addMovie, removeMovie } = jarSlice.actions;
export default jarSlice.reducer;

// Plockar ut filmburkens lista från appens gemensamma state.
/** @param {{ jar: typeof initialState }} state */
export function selectJarMovies(state) {
  return state.jar.movies;
}
