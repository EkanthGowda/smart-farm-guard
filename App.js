import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Dashboard from "./screens/Dashboard";
import Alerts from "./screens/Alerts";
import Controls from "./screens/Controls";
import Settings from "./screens/Settings";
import MotorControl from "./screens/MotorControl";
import { COLORS } from "./constants/theme";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarIcon: ({ color, size }) => {
            let iconName = "grid-outline";

            if (route.name === "Dashboard") {
              iconName = "grid-outline";
            } else if (route.name === "Alerts") {
              iconName = "warning-outline";
            } else if (route.name === "Sounds") {
              iconName = "musical-notes-outline";
            } else if (route.name === "Settings") {
              iconName = "settings-outline";
            } else if (route.name === "Motor") {
              iconName = "power-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            backgroundColor: COLORS.card,
            borderTopColor: COLORS.border
          }
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Alerts" component={Alerts} />
        <Tab.Screen name="Sounds" component={Controls} />
        <Tab.Screen name="Settings" component={Settings} />
        <Tab.Screen name="Motor" component={MotorControl} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
