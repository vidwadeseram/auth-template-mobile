import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { AuthForm } from "../../components/AuthForm";
import { LinkButton } from "../../components/LinkButton";
import { Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "react-native";

export default function ResetPasswordScreen() {
  const { resetPassword } = useAuth();
  const router = useRouter();
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
      await resetPassword(params.token as string || values.token, values.password);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24, backgroundColor: colors.background }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, textAlign: "center" }}>Password reset!</Text>
        <View style={{ marginTop: 24 }}><LinkButton href="/(meta)/login">Sign in</LinkButton></View>
      </View>
    );
  }

  const fields = [
    ...(params.token ? [] : [{ key: "token", label: "Reset token", placeholder: "Enter token from email" }]),
    { key: "password", label: "New password", placeholder: "••••••••", secure: true } as const,
  ];

  return (
    <AuthForm
      title="New password"
      subtitle="Enter your new password"
      fields={fields}
      buttonTitle="Reset password"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
