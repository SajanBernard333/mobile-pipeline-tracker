import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

import { api, handleRequestError } from "../services/api";
import { saveToken } from "../utils/storage";

type LoginScreenProps = {
  onLoggedIn: (token: string) => void;
};

export function LoginScreen({ onLoggedIn }: LoginScreenProps) {
  const [email, setEmail] = useState("moses@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const result = await api.login(email, password);
      await saveToken(result.token);
      onLoggedIn(result.token);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Pipeline Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#eef4ff",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1d2433",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4a5b7a",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#dfe9ff",
  },
});
