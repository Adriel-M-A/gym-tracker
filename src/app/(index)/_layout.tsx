import { Stack } from "expo-router/stack";
import { colors } from "../../constants/theme";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.textPrimary, fontFamily: 'Anton_400Regular', fontSize: 32 },
        headerTitleAlign: 'left',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
