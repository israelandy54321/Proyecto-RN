import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { PointsProvider } from "../context/PointsContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <PointsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </PointsProvider>
    </AuthProvider>
  );
}
