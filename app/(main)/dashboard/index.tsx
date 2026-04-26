import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../../../lib/auth-context";
import { Colors } from "../../../constants/Colors";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>Welcome back,</Text>
        <Text style={[styles.name, { color: colors.text }]}>{user?.first_name || "User"}</Text>
      </View>

      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardLabel, { color: colors.muted }]}>Status</Text>
          <Text style={[styles.cardValue, { color: colors.success }]}>Active</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardLabel, { color: colors.muted }]}>Email</Text>
          <Text style={[styles.cardValue, { color: user?.email_verified ? colors.success : "#D97706" }]}>
            {user?.email_verified ? "Verified" : "Pending"}
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardLabel, { color: colors.muted }]}>Role</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>{user?.role || "user"}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/(main)/profile")}>
          <Text style={styles.actionBtnText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/(main)/settings")}>
          <Text style={styles.actionBtnText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/(main)/security")}>
          <Text style={styles.actionBtnText}>Security</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.border, borderWidth: 1, backgroundColor: "transparent" }]} onPress={logout}>
          <Text style={[styles.actionBtnText, { color: colors.error }]}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 16 },
  name: { fontSize: 28, fontWeight: "bold" },
  cards: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 32 },
  card: { flex: 1, minWidth: "45%", padding: 16, borderRadius: 12, borderWidth: 1 },
  cardLabel: { fontSize: 12, marginBottom: 4 },
  cardValue: { fontSize: 18, fontWeight: "600" },
  actions: { gap: 10 },
  actionBtn: { height: 48, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  actionBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
