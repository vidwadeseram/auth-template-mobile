import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { AuthForm } from "../../components/AuthForm";
import { LinkButton } from "../../components/LinkButton";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values: Record<string, string>) {
    setLoading(true);
    setError("");
    try {
      await register({
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
      });
      router.replace("/(meta)/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Create account"
      subtitle="Enter your details to get started"
      fields={[
        { key: "first_name", label: "First name", placeholder: "John", autoCapitalize: "sentences" },
        { key: "last_name", label: "Last name", placeholder: "Doe", autoCapitalize: "sentences" },
        { key: "email", label: "Email", placeholder: "you@example.com", keyboardType: "email-address" },
        { key: "password", label: "Password", placeholder: "••••••••", secure: true },
      ]}
      buttonTitle="Create account"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      footer={<LinkButton href="/(meta)/login">Already have an account? Sign in</LinkButton>}
    />
  );
}
