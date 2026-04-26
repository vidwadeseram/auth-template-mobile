import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../../../lib/auth-context";
import { Colors } from "../../../constants/Colors";
import { useColorScheme } from "react-native";

export default function ProfileScreen() {
  const { user } = useAuth();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const fields = [
    { label: "First Name", value: user?.first_name },
    { label: "Last Name", value: user?.last_name },
    { label: "Email", value: user?.email },
    { label: "Role", value: user?.role || "user" },
    { label: "Email Verified", value: user?.email_verified ? "Yes" : "No" },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {fields.map((f) => (
        <View key={f.label} style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.muted }]}>{f.label}</Text>
          <Text style={[styles.value, { color: colors.text }]}>{f.value || "—"}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1 },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: "500" },
});
