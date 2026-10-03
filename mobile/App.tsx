import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

const pipelineStages = [
  "Fresh Contacts",
  "Follow Up FU1",
  "Follow Up FU2",
  "Follow Up FU3",
  "Follow Up FU4",
  "Follow Up FU5",
  "Content Sharing",
  "Ready for Good News",
  "Travel Details",
  "Attended Good News",
  "Completed 3 Months in Fellowship",
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Pipeline Tracker</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.text}>
            Mobile-first tracking for your discipleship and fellowship pipeline.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pipeline Stages</Text>
          {pipelineStages.map((stage, index) => (
            <TouchableOpacity key={index} style={styles.stageItem}>
              <Text style={styles.stageText}>
                {index + 1}. {stage}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Due Status</Text>
          <Text style={styles.text}>7 days: Due</Text>
          <Text style={styles.text}>14 days: Overdue</Text>
          <Text style={styles.text}>30+ days: Pending</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Key Workflow</Text>
          <Text style={styles.text}>Contact → Follow-up → Content Sharing → Ready for Good News → Travel → Attendance → 3 Month Fellowship</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    margin: 20,
    color: "#1c2333",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#202633",
  },
  text: {
    fontSize: 15,
    color: "#424c5d",
    lineHeight: 22,
  },
  stageItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#edf1f7",
  },
  stageText: {
    fontSize: 15,
    color: "#202633",
  },
});
