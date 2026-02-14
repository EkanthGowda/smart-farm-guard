import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert
} from "react-native";
import { COLORS, RADIUS, SHADOW, SPACING } from "../constants/theme";
import { getSettings, updateSettings } from "../services/api";

export default function Settings() {
  const [threshold, setThreshold] = useState("0.50");
  const [autoSound, setAutoSound] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      const current = data.settings || {};
      if (typeof current.confidenceThreshold === "number") {
        setThreshold(current.confidenceThreshold.toFixed(2));
      }
      if (typeof current.autoSound === "boolean") {
        setAutoSound(current.autoSound);
      }
      if (typeof current.pushAlerts === "boolean") {
        setPushAlerts(current.pushAlerts);
      }
      setError("");
    } catch (err) {
      setError("Unable to load settings.");
    }
  }, []);

  const handleSave = async () => {
    const value = Number.parseFloat(threshold);
    if (Number.isNaN(value) || value < 0 || value > 1) {
      Alert.alert("Invalid value", "Enter a number between 0.0 and 1.0.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await updateSettings({
        confidenceThreshold: value,
        autoSound,
        pushAlerts
      });
      Alert.alert("Saved", "Settings updated successfully.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <Text style={styles.subheader}>Adjust detection preferences.</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Confidence Threshold</Text>
        <Text style={styles.helperText}>Value between 0.0 and 1.0</Text>
        <TextInput
          style={styles.input}
          value={threshold}
          onChangeText={setThreshold}
          keyboardType="decimal-pad"
          placeholder="0.50"
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.row}>
          <View>
            <Text style={styles.sectionTitle}>Auto Sound</Text>
            <Text style={styles.helperText}>Play deterrent automatically</Text>
          </View>
          <Switch
            value={autoSound}
            onValueChange={setAutoSound}
            trackColor={{ false: "#BDBDBD", true: COLORS.secondary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.row}>
          <View>
            <Text style={styles.sectionTitle}>Push Alerts</Text>
            <Text style={styles.helperText}>Send alerts to your phone</Text>
          </View>
          <Switch
            value={pushAlerts}
            onValueChange={setPushAlerts}
            trackColor={{ false: "#BDBDBD", true: COLORS.secondary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Text>
      </TouchableOpacity>
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
    marginBottom: SPACING.md,
    ...SHADOW.sm
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textMuted
  },
  input: {
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    color: COLORS.text,
    backgroundColor: "#FAFAFA"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  saveButton: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: "center"
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16
  }
});
