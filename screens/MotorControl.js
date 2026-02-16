import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOW, SPACING } from "../constants/theme";
import { getMotorState, setMotorState } from "../services/api";

export default function MotorControl() {
  const [motorState, setMotorState] = useState("OFF");
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const fetchMotorState = async () => {
    try {
      const data = await getMotorState();
      setMotorState(data.motorState || "OFF");
      setError("");
    } catch (err) {
      setError("Unable to load motor state.");
    }
  };

  const sendMotorCommand = async (action) => {
    setIsBusy(true);
    try {
      await setMotorState(action);
      await fetchMotorState();
    } catch (err) {
      setError("Unable to update motor state.");
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    fetchMotorState();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Motor Control</Text>
      <Text style={styles.subheader}>Start or stop irrigation instantly.</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.sectionCard}>
        <Text style={styles.status}>Current State: {motorState}</Text>

        <TouchableOpacity
          style={[styles.button, styles.onButton, isBusy && styles.buttonDisabled]}
          onPress={() => sendMotorCommand("ON")}
          disabled={isBusy}
        >
          <Text style={styles.buttonText}>Turn Motor ON</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.offButton, isBusy && styles.buttonDisabled]}
          onPress={() => sendMotorCommand("OFF")}
          disabled={isBusy}
        >
          <Text style={styles.buttonText}>Turn Motor OFF</Text>
        </TouchableOpacity>
      </View>
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
  errorText: {
    color: COLORS.danger,
    marginBottom: SPACING.sm
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOW.sm
  },
  status: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md
  },
  button: {
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
    alignItems: "center"
  },
  onButton: {
    backgroundColor: COLORS.secondary
  },
  offButton: {
    backgroundColor: COLORS.danger
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700"
  },
  buttonDisabled: {
    opacity: 0.6
  }
});
