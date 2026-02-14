import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, SHADOW } from "../constants/theme";

export default function InfoCard({ title, value, color }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}> 
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    marginVertical: 8,
    borderRadius: RADIUS.md,
    borderLeftWidth: 5,
    ...SHADOW.sm
  },
  title: {
    fontSize: 14,
    color: COLORS.textMuted
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
    color: COLORS.text
  }
});
