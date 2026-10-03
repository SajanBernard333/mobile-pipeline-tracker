import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const STORAGE_KEY = "pipeline_tracker_token";

export async function saveToken(token: string) {
  await AsyncStorage.setItem(STORAGE_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(STORAGE_KEY);
}

export async function clearToken() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`http://localhost:4000${path}`, {
    ...options,
    headers,
    body: options.body ? options.body : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: { id: string; email: string; role: string } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getReports: (organizationId: string) =>
    apiRequest<{ summary: any }>(`/api/reports/summary?organizationId=${organizationId}`),

  getNotifications: (userId: string) =>
    apiRequest<{ notifications: any[] }>(`/api/notifications/${userId}`),
};

export function handleRequestError(error: unknown) {
  Alert.alert("Error", error instanceof Error ? error.message : "Something went wrong");
}
