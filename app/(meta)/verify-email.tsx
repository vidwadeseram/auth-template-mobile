import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { AuthForm } from "../../components/AuthForm";
import { LinkButton } from "../../components/LinkButton";
import { Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "react-native";

export default function VerifyEmailScreen() {
  const { verifyEmail } = useAuth();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  async function handleSubmit(values: Record<string, string>) {
    setLoading(true);
    setError("");
    try {
      await verifyEmail(params.token as string || values.token);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24, backgroundColor: colors.background }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, textAlign: "center" }}>Email verified!</Text>
        <View style={{ marginTop: 24 }}><LinkButton href="/(meta)/login">Sign in</LinkButton></View>
      </View>
    );
  }

  return (
    <AuthForm
      title="Verify email"
      subtitle="Confirm your email address"
      fields={[{ key: "token", label: "Verification token", placeholder: "Enter token from email" }]}
      buttonTitle="Verify email"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
