import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const notificationSamples = [
  {
    id: "1",
    type: "contact_due",
    title: "Follow-up Due",
    message: "Moses Agyeman is due for follow-up contact.",
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: "2",
    type: "contact_overdue",
    title: "Follow-up Overdue",
    message: "Sarah Mensah is now overdue for contact.",
    timestamp: "1 day ago",
    isRead: false,
  },
  {
    id: "3",
    type: "travel_details_ready",
    title: "Travel Details Ready",
    message: "Travel details for Patrick Nkrumah are ready for manager review.",
    timestamp: "3 days ago",
    isRead: true,
  },
  {
    id: "4",
    type: "ready_for_good_news",
    title: "Good News Reminder",
    message: "Reminder: Esther Boateng is scheduled for Good News in 3 days.",
    timestamp: "1 week ago",
    isRead: true,
  },
];

const typeColors: Record<string, string> = {
  contact_due: "#f59e0b",
  contact_overdue: "#ef4444",
  contact_pending: "#dc2626",
  ready_for_good_news: "#3b82f6",
  travel_details_ready: "#14b8a6",
  good_news_attended: "#10b981",
  three_month_completion: "#06b6d4",
  task_reminder: "#8b5cf6",
};

export function NotificationsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Notifications</Text>

      {notificationSamples.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          style={[
            styles.notificationCard,
            notification.isRead && styles.readNotification,
          ]}
        >
          <View
            style={[
              styles.typeIndicator,
              { backgroundColor: typeColors[notification.type] ?? "#6b7280" },
            ]}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.message}>{notification.message}</Text>
            <Text style={styles.timestamp}>{notification.timestamp}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
  },
  readNotification: {
    opacity: 0.6,
  },
  typeIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d2433",
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: "#52607b",
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: "#8a94b0",
    marginTop: 6,
  },
});
