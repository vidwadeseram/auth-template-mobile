import { Stack } from "expo-router";

export default function MetaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: "Sign In" }} />
      <Stack.Screen name="register" options={{ title: "Create Account" }} />
      <Stack.Screen name="forgot-password" options={{ title: "Reset Password" }} />
      <Stack.Screen name="reset-password" options={{ title: "New Password" }} />
      <Stack.Screen name="verify-email" options={{ title: "Verify Email" }} />
    </Stack>
  );
}
