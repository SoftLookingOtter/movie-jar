import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";

// Ger alla skärmar tillgång till vår Redux-store.
export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Browse movies" }} />
      </Stack>
    </Provider>
  );
}
