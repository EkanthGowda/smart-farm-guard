import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import InfoCard from "../components/InfoCard";
import { COLORS, RADIUS, SHADOW, SPACING } from "../constants/theme";
import { getLatestDetection } from "../services/api";

export default function Dashboard() {
  const [latestDetection, setLatestDetection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLatestDetection = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getLatestDetection();
      setLatestDetection(data || null);
    } catch (err) {
      setError("Unable to fetch latest detection. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatestDetection();
  }, [loadLatestDetection]);

  const detectionType =
    latestDetection?.label ||
    latestDetection?.animal ||
    latestDetection?.type ||
    "Unknown";
  const detectionTime =
    latestDetection?.time ||
    latestDetection?.timestamp ||
    latestDetection?.createdAt ||
    "Unknown";
  const detectionConfidence =
    typeof latestDetection?.confidence === "number"
      ? `${Math.round(latestDetection.confidence * 100)}%`
      : "Unknown";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Latest Detection</Text>
      <Text style={styles.subheader}>Live data from your Raspberry Pi</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.ghostButton} onPress={loadLatestDetection}>
          <Text style={styles.ghostButtonText}>
            {isLoading ? "Loading..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {!latestDetection ? (
        <Text style={styles.emptyText}>No detections from the device yet.</Text>
      ) : (
        <>
          <InfoCard
            title="Detected"
            value={detectionType}
            color={COLORS.primary}
          />
          <InfoCard
            title="Confidence"
            value={detectionConfidence}
            color={COLORS.warning}
          />
          <InfoCard
            title="Time"
            value={detectionTime}
            color={COLORS.secondary}
          />

          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Raw Payload</Text>
            <Text style={styles.detailsText}>
              {JSON.stringify(latestDetection, null, 2)}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    paddingBottom: SPACING.lg
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
  emptyText: {
    textAlign: "center",
    color: COLORS.textMuted,
    marginTop: SPACING.lg
  },
  detailsCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    ...SHADOW.sm
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8
  },
  detailsText: {
    color: COLORS.textMuted,
    fontSize: 12
  }
});
