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
      state.movies.push(action.payload); // Lägger filmen sist i burkens lista.
    },
  },
});

export const { addMovie } = jarSlice.actions;
export default jarSlice.reducer;
