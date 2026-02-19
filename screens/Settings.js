import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import { COLORS, RADIUS, SHADOW, SPACING } from "../constants/theme";
import { getSettings, updateSettings, getSounds } from "../services/api";

export default function Settings() {
  const [threshold, setThreshold] = useState("0.50");
  const [defaultSound, setDefaultSound] = useState("alert.wav");
  const [sounds, setSounds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      const current = data.settings || {};
      if (typeof current.confidenceThreshold === "number") {
        setThreshold(current.confidenceThreshold.toFixed(2));
      }
      if (typeof current.defaultSound === "string") {
        setDefaultSound(current.defaultSound);
      }
      setError("");
    } catch (err) {
      setError("Unable to load settings.");
    }
  }, []);

  const loadSounds = useCallback(async () => {
    try {
      const data = await getSounds();
      const uploads = Array.isArray(data) ? data : data.uploads || [];
      const deviceSounds = Array.isArray(data) ? [] : data.device || [];
      const merged = [...deviceSounds, ...uploads];
      setSounds(merged);
    } catch (err) {
      // Silent fail for sounds list
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
        defaultSound
      });
      Alert.alert("Saved", "Settings updated successfully.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
    loadSounds();
  }, [loadSettings, loadSounds]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
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
        <Text style={styles.sectionTitle}>Default Alert Sound</Text>
        <Text style={styles.helperText}>Sound to play on monkey detection</Text>
        <View style={styles.soundList}>
          {sounds.map((sound) => {
            const soundName = typeof sound === "string" ? sound : sound.name || sound;
            return (
              <TouchableOpacity
                key={soundName}
                style={[
                  styles.soundOption,
                  soundName === defaultSound && styles.soundOptionActive
                ]}
                onPress={() => setDefaultSound(soundName)}
              >
                <Text
                  style={[
                    styles.soundOptionText,
                    soundName === defaultSound && styles.soundOptionTextActive
                  ]}
                >
                  {soundName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  container: {
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
  },
  soundList: {
    marginTop: SPACING.sm
  },
  soundOption: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
    backgroundColor: "#FAFAFA"
  },
  soundOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  soundOptionText: {
    color: COLORS.text,
    fontSize: 14
  },
  soundOptionTextActive: {
    color: "#FFF",
    fontWeight: "700"
  }
});
