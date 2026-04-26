import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../../lib/auth-context";
import { Colors } from "../../../constants/Colors";
import { useColorScheme } from "react-native";

export default function SecurityScreen() {
  const theme: "light" | "dark" = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[theme];
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (form.new_password !== form.confirm_password) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);
    // API call would go here
    setTimeout(() => { setLoading(false); setForm({ current_password: "", new_password: "", confirm_password: "" }); }, 500);
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Change Password</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.muted }]}>Current Password</Text>
        <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border }]} secureTextEntry value={form.current_password} onChangeText={(t) => setForm((f) => ({ ...f, current_password: t }))} />
      </View>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.muted }]}>New Password</Text>
        <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border }]} secureTextEntry value={form.new_password} onChangeText={(t) => setForm((f) => ({ ...f, new_password: t }))} />
      </View>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.muted }]}>Confirm New Password</Text>
        <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border }]} secureTextEntry value={form.confirm_password} onChangeText={(t) => setForm((f) => ({ ...f, confirm_password: t }))} />
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Changing..." : "Change password"}</Text>
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
  errorText: { color: "#DC2626", fontSize: 14, marginBottom: 12 },
});
