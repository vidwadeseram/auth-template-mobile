import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { AuthForm } from "../../components/AuthForm";
import { LinkButton } from "../../components/LinkButton";
import { Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "react-native";

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  async function handleSubmit(values: Record<string, string>) {
    setLoading(true);
    setError("");
    try {
      await forgotPassword(values.email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24, backgroundColor: colors.background }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, textAlign: "center" }}>Check your email</Text>
        <Text style={{ color: colors.muted, textAlign: "center", marginTop: 8 }}>If an account exists, a reset link has been sent.</Text>
        <View style={{ marginTop: 24 }}><LinkButton href="/(meta)/login">Back to login</LinkButton></View>
      </View>
    );
  }

  return (
    <AuthForm
      title="Reset password"
      subtitle="Enter your email to receive a reset link"
      fields={[{ key: "email", label: "Email", placeholder: "you@example.com", keyboardType: "email-address" }]}
      buttonTitle="Send reset link"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      footer={<LinkButton href="/(meta)/login">Back to login</LinkButton>}
    />
  );
}
