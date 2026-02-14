import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Dashboard from "./screens/Dashboard";
import Alerts from "./screens/Alerts";
import Controls from "./screens/Controls";
import Settings from "./screens/Settings";
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
            } else if (route.name === "Controls") {
              iconName = "megaphone-outline";
            } else if (route.name === "Settings") {
              iconName = "settings-outline";
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
        <Tab.Screen name="Controls" component={Controls} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
