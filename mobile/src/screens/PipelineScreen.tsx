import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Contact } from "../data/mockData";

type DashboardScreenProps = {
  contacts: Contact[];
};

export function DashboardScreen({ contacts }: DashboardScreenProps) {
  const total = contacts.length;
  const due = contacts.filter((contact) => contact.status === "due").length;
  const overdue = contacts.filter((contact) => contact.status === "overdue").length;
  const pending = contacts.filter((contact) => contact.status === "pending").length;
  const goodNewsReady = contacts.filter((contact) => contact.readyForGoodNews).length;
  const completed = contacts.filter((contact) => contact.completedThreeMonths).length;

  const stats = [
    { label: "Total", value: String(total) },
    { label: "Due", value: String(due) },
    { label: "Overdue", value: String(overdue) },
    { label: "Pending", value: String(pending) },
    { label: "Ready", value: String(goodNewsReady) },
    { label: "Completed", value: String(completed) },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.grid}>
          {stats.map((item) => (
            <View key={item.label} style={styles.card}>
              <Text style={styles.cardValue}>{item.value}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today’s Summary</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Follow-up progress is healthy.</Text>
          <Text style={styles.summaryText}>2 contacts are ready for Good News.</Text>
          <Text style={styles.summaryText}>Manager alerts have been generated for overdue records.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d2433",
    marginBottom: 12,
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
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2f6fed",
  },
  cardLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#52607b",
    fontWeight: "600",
  },
  summaryBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryText: {
    fontSize: 15,
    color: "#364563",
    lineHeight: 24,
  },
});
