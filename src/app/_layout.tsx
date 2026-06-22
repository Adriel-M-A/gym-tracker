import { useEffect, useState } from "react";
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
import { useWorkoutStore } from "../store/workoutStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Anton_400Regular,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  const [hydrated, setHydrated] = useState(() => useWorkoutStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useWorkoutStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if ((loaded || error) && hydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, hydrated]);

  if ((!loaded && !error) || !hydrated) {
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
