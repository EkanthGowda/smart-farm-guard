import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const BASE_URL = "https://iot-bbackend.onrender.com";

export default function MotorControl() {
  const [motorState, setMotorState] = useState("OFF");

  const fetchMotorState = async () => {
    const res = await fetch(`${BASE_URL}/app/motor`);
    const data = await res.json();
    setMotorState(data.motorState);
  };

  const sendMotorCommand = async (action) => {
    await fetch(`${BASE_URL}/app/motor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device_id: "farm_001",
        action
      })
    });

    fetchMotorState();
  };

  useEffect(() => {
    fetchMotorState();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Motor Control</Text>

      <Text style={styles.status}>Current State: {motorState}</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "green" }]}
        onPress={() => sendMotorCommand("ON")}
      >
        <Text style={styles.buttonText}>Turn Motor ON</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={() => sendMotorCommand("OFF")}
      >
        <Text style={styles.buttonText}>Turn Motor OFF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5"
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },
  status: {
    fontSize: 18,
    marginBottom: 20
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold"
  }
});
