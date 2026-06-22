import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts, Anton_400Regular } from "@expo-google-fonts/anton";
import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import { colors } from "../constants/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Anton_400Regular,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: "Lexend_500Medium",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          title: "Entrenamiento",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="fitness-center" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(import)"
        options={{
          title: "Importar",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="import-export" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
