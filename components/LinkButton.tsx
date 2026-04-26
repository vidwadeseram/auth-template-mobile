import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface LinkButtonProps {
  href: string;
  children: string;
}

export function LinkButton({ href, children }: LinkButtonProps) {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(href as any)}>
      <Text style={{ color: "#0a7ea4", fontSize: 14, textAlign: "center" }}>{children}</Text>
    </TouchableOpacity>
  );
}
