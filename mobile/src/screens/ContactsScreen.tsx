import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { pipelineStages } from "../data/mockData";

export function PipelineScreen() {
  return (
    <View style={styles.container}>
      {pipelineStages.map((stage, index) => (
        <View key={stage} style={styles.stageRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>{index + 1}</Text>
          </View>
          <Text style={styles.stageName}>{stage}</Text>
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
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  stepBadge: {
    width: 30,
    height: 30,
    backgroundColor: "#dfe9ff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2f6fed",
  },
  stageName: {
    flex: 1,
    fontSize: 15,
    color: "#2b3341",
    fontWeight: "600",
  },
});
