import { Stack } from "expo-router";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
      </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
