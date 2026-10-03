import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Contact } from "../data/mockData";

type ContactsScreenProps = {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (id: string) => void;
};

const statusColors: Record<string, string> = {
  active: "#1ba97c",
  due: "#f0a13a",
  overdue: "#e85b5b",
  pending: "#6a7a92",
};

export function ContactsScreen({
  contacts,
  selectedContact,
  onSelectContact,
}: ContactsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Contacts</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactList}>
        {contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            onPress={() => onSelectContact(contact.id)}
            style={[
              styles.contactChip,
              selectedContact?.id === contact.id && styles.selectedChip,
            ]}
          >
            <Text style={styles.contactChipText}>{contact.name}</Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusColors[contact.status] ?? "#1ba97c" },
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedContact ? (
        <View style={styles.detailCard}>
          <Text style={styles.detailName}>{selectedContact.name}</Text>
          <Text style={styles.detailMeta}>{selectedContact.stage}</Text>
          <Text style={styles.detailMeta}>Follow-up: {selectedContact.followUpLevel}</Text>
          <Text style={styles.detailMeta}>Last contact: {selectedContact.lastContactDays} days</Text>

          <View style={styles.metaRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{selectedContact.phone}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{selectedContact.email}</Text>
          </View>

          <Text style={styles.sectionSubTitle}>Family Members</Text>
          {selectedContact.familyMembers.map((member) => (
            <Text key={`${selectedContact.id}-${member.name}`} style={styles.listItem}>
              • {member.name} ({member.relationship})
            </Text>
          ))}

          <Text style={styles.sectionSubTitle}>Travel Details</Text>
          <Text style={styles.listItem}>
            {selectedContact.travelDetails.departureLocation} → {selectedContact.travelDetails.arrivalLocation}
          </Text>
          <Text style={styles.listItem}>Date: {selectedContact.travelDetails.date}</Text>
        </View>
      ) : null}
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
    marginBottom: 12,
  },
  contactList: {
    marginBottom: 16,
  },
  contactChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedChip: {
    backgroundColor: "#dfe9ff",
  },
  contactChipText: {
    color: "#2b3341",
    fontWeight: "600",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  detailCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  detailName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1d2433",
  },
  detailMeta: {
    fontSize: 14,
    color: "#4f5d75",
    marginTop: 6,
  },
  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    width: 70,
    color: "#3b465d",
    fontWeight: "600",
  },
  value: {
    flex: 1,
    color: "#243146",
  },
  sectionSubTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "700",
    color: "#1d2433",
  },
  listItem: {
    color: "#364563",
    lineHeight: 22,
  },
});
