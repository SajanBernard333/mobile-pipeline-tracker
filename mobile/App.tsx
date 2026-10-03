import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { contacts } from "./src/data/mockData";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { PipelineScreen } from "./src/screens/PipelineScreen";
import { ContactsScreen } from "./src/screens/ContactsScreen";
import { ReportsScreen } from "./src/screens/ReportsScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { LoginScreen } from "./src/screens/LoginScreen";

const tabs = ["Dashboard", "Pipeline", "Contacts", "Reports", "Alerts"] as const;

type TabName = (typeof tabs)[number];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>("Dashboard");
  const [token, setToken] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const saved = await AsyncStorage.getItem("pipeline_tracker_token");
      setToken(saved);
      setBooting(false);
    };

    bootstrap();
  }, []);

  if (booting) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading app...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!token) {
    return <LoginScreen onLoggedIn={(newToken) => setToken(newToken)} />;
  }

  const selectedContact = contacts[0] ?? null;

  const renderScreen = () => {
    switch (activeTab) {
      case "Pipeline":
        return <PipelineScreen />;
      case "Contacts":
        return <ContactsScreen contacts={contacts} selectedContact={selectedContact} onSelectContact={() => undefined} />;
      case "Reports":
        return <ReportsScreen />;
      case "Alerts":
        return <NotificationsScreen />;
      case "Dashboard":
      default:
        return <DashboardScreen contacts={contacts} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Pipeline Tracker</Text>

        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderScreen()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#2f6fed",
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1d2433",
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 14,
  },
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#dfe9ff",
    minWidth: 90,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#2f6fed",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#39507a",
  },
  activeTabText: {
    color: "#ffffff",
  },
});
