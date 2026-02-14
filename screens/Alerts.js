import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import { COLORS, RADIUS, SHADOW, SPACING } from "../constants/theme";
import { getAlerts } from "../services/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getAlerts();
      setAlerts(data.alerts || []);
    } catch (err) {
      setError("Unable to load alerts. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detection Alerts</Text>
      <Text style={styles.subheader}>Recent activity from your device</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.ghostButton} onPress={loadAlerts}>
          <Text style={styles.ghostButtonText}>
            {isLoading ? "Loading..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>🐒 Monkey Detected</Text>
            <Text>Time: {item.time}</Text>
            <Text>Confidence: {Math.round(item.confidence * 100)}%</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No alerts yet.</Text>
        }
        refreshing={isLoading}
        onRefresh={loadAlerts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.background
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text
  },
  subheader: {
    marginTop: 4,
    marginBottom: SPACING.md,
    color: COLORS.textMuted
  },
  listContent: {
    paddingBottom: SPACING.lg
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md
  },
  ghostButton: {
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center"
  },
  ghostButtonText: {
    color: COLORS.text
  },
  errorText: {
    color: COLORS.danger,
    marginBottom: SPACING.sm
  },
  alertCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
    ...SHADOW.sm
  },
  alertTitle: {
    fontWeight: "700",
    color: COLORS.danger,
    marginBottom: 4
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textMuted,
    marginTop: SPACING.lg
  }
});
