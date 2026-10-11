import { configureStore } from "@reduxjs/toolkit";
import jarReducer from "./jarSlice";

// Skapar appens gemensamma Redux-store.
export const store = configureStore({
  reducer: {
    jar: jarReducer,
  },
});
