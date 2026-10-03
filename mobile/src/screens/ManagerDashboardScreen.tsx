import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function ManagerDashboardScreen() {
  const stats = [
    { label: "Total Contacts", value: 128 },
    { label: "Due", value: 18 },
    { label: "Overdue", value: 9 },
    { label: "Pending", value: 6 },
    { label: "Ready for Good News", value: 14 },
    { label: "3-Month Completion", value: 7 },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Manager Dashboard</Text>

      <View style={styles.grid}>
        {stats.map((item) => (
          <View key={item.label} style={styles.card}>
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Team Highlights</Text>
        <Text style={styles.listItem}>• 2 contacts are ready for Good News this week.</Text>
        <Text style={styles.listItem}>• 1 travel details package is waiting for manager approval.</Text>
        <Text style={styles.listItem}>• 3 members have completed the 3-month fellowship milestone.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1d2433",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  value: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2f6fed",
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#52607b",
    fontWeight: "600",
  },
  panel: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 16,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d2433",
    marginBottom: 10,
  },
  listItem: {
    color: "#38486d",
    fontSize: 14,
    lineHeight: 24,
  },
});
