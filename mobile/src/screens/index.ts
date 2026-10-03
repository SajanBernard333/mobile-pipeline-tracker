import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { reportBreakdown } from "../data/mockData";

export function ReportsScreen() {
  const maxValue = Math.max(...reportBreakdown.map((item) => item.value));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Monthly Reports</Text>

      {reportBreakdown.map((item) => (
        <View key={item.label} style={styles.row}>
          <Text style={styles.label}>{item.label}</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${(item.value / maxValue) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d2433",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    width: 70,
    color: "#38486d",
    fontWeight: "600",
  },
  barTrack: {
    flex: 1,
    height: 12,
    borderRadius: 10,
    backgroundColor: "#dfe9ff",
    overflow: "hidden",
    marginHorizontal: 10,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#2f6fed",
    borderRadius: 10,
  },
  value: {
    width: 30,
    textAlign: "right",
    color: "#243146",
    fontWeight: "700",
  },
});
