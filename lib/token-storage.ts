import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_KEY = "auth_access_token";
const REFRESH_KEY = "auth_refresh_token";

const memory: Record<string, string | null> = { [ACCESS_KEY]: null, [REFRESH_KEY]: null };

function isSecureStoreAvailable(): boolean {
  return Platform.OS === "ios" || Platform.OS === "android";
}

export const tokenStorage = {
  loadInitial: async (): Promise<{ access: string | null; refresh: string | null }> => {
    if (!isSecureStoreAvailable()) {
      return { access: memory[ACCESS_KEY], refresh: memory[REFRESH_KEY] };
    }
    const access = await SecureStore.getItemAsync(ACCESS_KEY);
    const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
    memory[ACCESS_KEY] = access;
    memory[REFRESH_KEY] = refresh;
    return { access, refresh };
  },
  getAccessToken: () => memory[ACCESS_KEY],
  getRefreshToken: () => memory[REFRESH_KEY],
  setAccessToken: (token: string | null) => {
    memory[ACCESS_KEY] = token;
    if (!isSecureStoreAvailable()) return;
    if (token === null) void SecureStore.deleteItemAsync(ACCESS_KEY);
    else void SecureStore.setItemAsync(ACCESS_KEY, token);
  },
  setRefreshToken: (token: string | null) => {
    memory[REFRESH_KEY] = token;
    if (!isSecureStoreAvailable()) return;
    if (token === null) void SecureStore.deleteItemAsync(REFRESH_KEY);
    else void SecureStore.setItemAsync(REFRESH_KEY, token);
  },
  clear: () => {
    memory[ACCESS_KEY] = null;
    memory[REFRESH_KEY] = null;
    if (!isSecureStoreAvailable()) return;
    void SecureStore.deleteItemAsync(ACCESS_KEY);
    void SecureStore.deleteItemAsync(REFRESH_KEY);
  },
};
