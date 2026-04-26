import { Redirect } from "expo-router";
import { useAuth } from "../lib/auth-context";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) return <Redirect href="/(main)/dashboard" />;
  return <Redirect href="/(meta)/login" />;
}
