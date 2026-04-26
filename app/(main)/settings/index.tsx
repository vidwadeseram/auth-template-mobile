import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../../lib/auth-context";
import { Colors } from "../../../constants/Colors";
import { useColorScheme } from "react-native";

export default function SettingsScreen() {
  const { user, apiClient } = useAuth();
  const theme: "light" | "dark" = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[theme];
  const [form, setForm] = useState({ first_name: user?.first_name || "", last_name: user?.last_name || "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      await apiClient.patch("/api/v1/auth/me", {
        first_name: form.first_name,
        last_name: form.last_name,
      });
      setSaved(true);
    } catch (err) {
      console.warn("Failed to update profile:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.muted }]}>First Name</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={form.first_name}
          onChangeText={(t) => setForm((f) => ({ ...f, first_name: t }))}
        />
      </View>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.muted }]}>Last Name</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={form.last_name}
          onChangeText={(t) => setForm((f) => ({ ...f, last_name: t }))}
        />
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Saving..." : saved ? "Saved ✓" : "Save changes"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  button: { height: 48, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
