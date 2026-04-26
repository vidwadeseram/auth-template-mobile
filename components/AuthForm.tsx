import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "react-native";

interface Field {
  key: string;
  label: string;
  placeholder: string;
  secure?: boolean;
  autoCapitalize?: "none" | "sentences";
  keyboardType?: "email-address" | "default";
}

interface AuthFormProps {
  title: string;
  subtitle?: string;
  fields: Field[];
  buttonTitle: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  loading: boolean;
  error?: string;
  footer?: React.ReactNode;
}

export function AuthForm({ title, subtitle, fields, buttonTitle, onSubmit, loading, error, footer }: AuthFormProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, ""]))
  );

  async function handleSubmit() {
    await onSubmit(values);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.card}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>}

        {fields.map((field) => (
          <View key={field.key} style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>{field.label}</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder={field.placeholder}
              placeholderTextColor={colors.muted}
              secureTextEntry={field.secure}
              autoCapitalize={field.autoCapitalize ?? "none"}
              keyboardType={field.keyboardType ?? "default"}
              value={values[field.key]}
              onChangeText={(text) => setValues((v) => ({ ...v, [field.key]: text }))}
            />
          </View>
        ))}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{buttonTitle}</Text>}
        </TouchableOpacity>

        {footer && <View style={styles.footer}>{footer}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  card: { gap: 12 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 8 },
  field: { gap: 4 },
  label: { fontSize: 14, fontWeight: "500" },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  button: { height: 48, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 4 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  errorText: { color: "#DC2626", fontSize: 14, textAlign: "center" },
  footer: { marginTop: 8, alignItems: "center" },
});
