import { Stack } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function MainLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator size="large" /></View>;
  }

  if (!user) return <Redirect href="/(meta)/login" />;

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="dashboard" options={{ title: "Dashboard", headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="security" options={{ title: "Security" }} />
    </Stack>
  );
}
