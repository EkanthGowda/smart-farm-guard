import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import InfoCard from "../components/InfoCard";
import { COLORS, RADIUS, SHADOW, SPACING } from "../constants/theme";

export default function Dashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Smart Farm Guard</Text>
          <Text style={styles.subtitle}>Perimeter monitoring</Text>
        </View>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Active Zone</Text>
        <Text style={styles.summaryValue}>North Field</Text>
        <Text style={styles.summaryHint}>Auto deterrent is enabled</Text>
      </View>

      <InfoCard
        title="Device Status"
        value="ONLINE"
        color={COLORS.secondary}
      />

      <InfoCard
        title="Location"
        value="Bangalore"
        color={COLORS.primary}
      />

      <InfoCard
        title="Detections Today"
        value="3"
        color={COLORS.warning}
      />

      <InfoCard
        title="Last Detection"
        value="10:32 AM"
        color={COLORS.danger}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    paddingBottom: SPACING.lg
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.textMuted
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.md
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    marginRight: 6
  },
  statusText: {
    fontSize: 12,
    color: COLORS.text
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.sm
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 6
  },
  summaryHint: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textMuted
  }
});
