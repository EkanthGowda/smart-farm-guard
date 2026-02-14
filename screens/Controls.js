import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { COLORS, RADIUS, SHADOW, SPACING } from "../constants/theme";
import {
  getSettings,
  getSounds,
  sendCommand,
  updateSettings,
  uploadSound
} from "../services/api";

export default function Controls() {
  const [sounds, setSounds] = useState([]);
  const [activeSoundId, setActiveSoundId] = useState(null);
  const [volume, setVolume] = useState(70);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");

  const loadSounds = useCallback(async () => {
    const data = await getSounds();
    const soundList = Array.isArray(data) ? data : data.sounds || [];
    setSounds(soundList);
    setActiveSoundId((current) => (soundList.includes(current) ? current : null));
  }, []);

  const loadSettings = useCallback(async () => {
    const data = await getSettings();
    setVolume(typeof data.settings?.volume === "number" ? data.settings.volume : 70);
  }, []);

  const loadAll = useCallback(async () => {
    setIsSyncing(true);
    setError("");
    try {
      await Promise.all([loadSounds(), loadSettings()]);
    } catch (err) {
      setError("Unable to sync with the server.");
    } finally {
      setIsSyncing(false);
    }
  }, [loadSettings, loadSounds]);

  const handleUpload = async () => {
    setError("");
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];
    const file = {
      uri: asset.uri,
      name: asset.name || "custom-sound",
      type: asset.mimeType || "audio/mpeg"
    };

    setIsBusy(true);
    try {
      const uploadRes = await uploadSound(file);
      const uploadData = await uploadRes.json();
      
      // Tell Pi to download the newly uploaded sound
      if (uploadData.file) {
        await sendCommand({
          action: `UPLOAD_SOUND:${uploadData.file}`
        });
      }

      await loadSounds();
      Alert.alert("Sound uploaded", `${file.name} uploaded and notified to Pi.`);
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setIsBusy(false);
    }
  };

  const handlePlay = async () => {
    const activeSound = sounds.find((sound) => sound === activeSoundId);
    if (!activeSoundId) {
      Alert.alert("Select a sound", "Pick a sound before playing.");
      return;
    }

    setIsBusy(true);
    try {
      await sendCommand({ action: "PLAY_SOUND", soundId: activeSoundId });
      Alert.alert("Play sound", activeSound || "No sound");
    } catch (err) {
      setError("Unable to send play command.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleStop = async () => {
    setIsBusy(true);
    try {
      await sendCommand({ action: "STOP_SOUND" });
      Alert.alert("Sound stopped", "Deterrent sound stopped.");
    } catch (err) {
      setError("Unable to send stop command.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleSelectSound = async (soundId) => {
    const sound = sounds.find((s) => s === soundId);
    setIsBusy(true);
    try {
      // Tell Pi which sound to play
      if (sound) {
        await sendCommand({
          action: `SET_SOUND:${sound}`
        });
      }

      setActiveSoundId(soundId);
    } catch (err) {
      setError("Unable to select sound.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleVolumeChange = async (delta) => {
    const nextVolume = Math.min(100, Math.max(0, volume + delta));
    setVolume(nextVolume);
    setIsBusy(true);
    try {
      await updateSettings({ volume: nextVolume });
      await sendCommand({ action: "SET_VOLUME", volume: nextVolume });
    } catch (err) {
      setError("Unable to update volume.");
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sound Controls</Text>
      <Text style={styles.subheader}>
        Upload, select, and play deterrent audio.
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Active Sound</Text>
        <Text style={styles.sectionValue}>
          {sounds.find((sound) => sound === activeSoundId) ||
            (isSyncing ? "Loading..." : "None selected")}
        </Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.primaryButton, isBusy && styles.buttonDisabled]}
            onPress={handlePlay}
            disabled={isBusy}
          >
            <Text style={styles.primaryButtonText}>Play Sound</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ghostButton, isBusy && styles.buttonDisabled]}
            onPress={handleStop}
            disabled={isBusy}
          >
            <Text style={styles.ghostButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Volume</Text>
          <Text style={styles.volumeValue}>{volume}%</Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.ghostButton, isBusy && styles.buttonDisabled]}
            onPress={() => handleVolumeChange(-5)}
            disabled={isBusy}
          >
            <Text style={styles.ghostButtonText}>-5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, isBusy && styles.buttonDisabled]}
            onPress={() => handleVolumeChange(5)}
            disabled={isBusy}
          >
            <Text style={styles.primaryButtonText}>+5</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Sound Library</Text>
          <TouchableOpacity
            style={[styles.uploadButton, isBusy && styles.buttonDisabled]}
            onPress={handleUpload}
            disabled={isBusy}
          >
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>

        {sounds.map((sound) => (
          <TouchableOpacity
            key={sound}
            style={
              sound === activeSoundId
                ? styles.soundRowActive
                : styles.soundRow
            }
            onPress={() => handleSelectSound(sound)}
            disabled={isBusy}
          >
            <View>
              <Text style={styles.soundName}>{sound}</Text>
              <Text style={styles.soundMeta}>Uploaded</Text>
            </View>
            <Text style={styles.soundSelect}>
              {sound === activeSoundId ? "Selected" : "Select"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
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
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text
  },
  sectionValue: {
    marginTop: 6,
    fontSize: 15,
    color: COLORS.textMuted
  },
  volumeValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text
  },
  actionRow: {
    flexDirection: "row",
    marginTop: SPACING.sm
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#FFF",
    fontWeight: "700"
  },
  ghostButton: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center"
  },
  ghostButtonText: {
    color: COLORS.text
  },
  buttonDisabled: {
    opacity: 0.6
  },
  uploadButton: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.sm
  },
  uploadButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 12
  },
  soundRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  soundRowActive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: "#F0F7F0",
    paddingHorizontal: SPACING.sm,
    marginHorizontal: -SPACING.sm,
    borderRadius: RADIUS.sm
  },
  soundName: {
    fontSize: 15,
    color: COLORS.text
  },
  soundMeta: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.textMuted
  },
  soundSelect: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary
  }
});
