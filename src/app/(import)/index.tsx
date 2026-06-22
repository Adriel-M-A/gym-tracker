import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { colors } from "../../constants/theme";

export default function ImportScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Importar" }} />
      <View style={styles.container}>
        <Text style={styles.text}>Funcionalidad en desarrollo...</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: "Lexend_400Regular",
    color: colors.textSecondary,
  }
});
