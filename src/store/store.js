// Skapar ett gemensamt ställe där appen håller reda på filmerna i burken.
// Här finns burkens data, som appens olika skärmar använder.

import { configureStore } from "@reduxjs/toolkit";
import jarReducer from "./jarSlice";

// Skapar appens gemensamma Redux-store (filmlistan i burken).
export const store = configureStore({
  reducer: {
    jar: jarReducer,
  },
});
