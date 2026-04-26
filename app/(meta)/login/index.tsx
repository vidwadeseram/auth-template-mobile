import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../../lib/auth-context";
import { AuthForm } from "../../../components/AuthForm";
import { LinkButton } from "../../../components/LinkButton";
import { View } from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values: Record<string, string>) {
    setLoading(true);
    setError("");
    try {
      await login(values.email, values.password);
      router.replace("/(main)/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to your account"
      fields={[
        { key: "email", label: "Email", placeholder: "you@example.com", keyboardType: "email-address" },
        { key: "password", label: "Password", placeholder: "••••••••", secure: true },
      ]}
      buttonTitle="Sign in"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      footer={
        <View style={{ gap: 8 }}>
          <LinkButton href="/(meta)/forgot-password">Forgot password?</LinkButton>
          <LinkButton href="/(meta)/register">Don't have an account? Register</LinkButton>
        </View>
      }
    />
  );
}
