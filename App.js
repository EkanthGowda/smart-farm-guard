import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import Dashboard from "./screens/Dashboard";
import Alerts from "./screens/Alerts";
import Controls from "./screens/Controls";
import Settings from "./screens/Settings";
import MotorControl from "./screens/MotorControl";
import { COLORS } from "./constants/theme";
import { registerPushToken } from "./services/api";

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined
  );

  if (Device.osName === "Android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH
    });
  }

  return tokenResponse.data;
}

export default function App() {
  useEffect(() => {
    let isMounted = true;

    const registerPush = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token && isMounted) {
          console.log("[PUSH] Token obtained:", token.substring(0, 20) + "...");
          await registerPushToken(token);
          console.log("[PUSH] Token registered with server");
        }
      } catch (err) {
        console.log("[PUSH] Setup error:", err.message);
      }
    };

    registerPush();

    // Listen for foreground notifications
    const foregroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("[PUSH] Notification tapped:", response.notification);
      }
    );

    // Log when notification is received (foreground)
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("[PUSH] Notification received (foreground):", notification.request.content);
      }
    );

    return () => {
      isMounted = false;
      foregroundSubscription.remove();
      receivedSubscription.remove();
    };
  }, []);

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
