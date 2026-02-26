import { Stack } from "expo-router";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProgressProvider } from "@/context/ProgressContext";

export default function RootLayout() {
  return (
    <AuthProvider>
    <ProgressProvider>
      <ThemeProvider>
        
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
      </Stack>
      </ThemeProvider>
      </ProgressProvider>

    </AuthProvider> 

  );
}
