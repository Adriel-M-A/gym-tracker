import { FlatList, View, StyleSheet, Text } from "react-native";
import { Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ExerciseCard } from "../../components/ExerciseCard";
import { SessionHeader } from "../../components/SessionHeader";
import { Button } from "../../components/Button";
import { colors } from "../../constants/theme";
import { useWorkoutStore } from "../../store/workoutStore";

export default function WorkoutScreen() {
  const session = useWorkoutStore(state => state.session);

  if (!session) {
    return (
      <>
        <Stack.Screen options={{ title: "Entrenamiento" }} />
        <View style={styles.emptyContainer}>
          <MaterialIcons 
            name="fitness-center" 
            size={64} 
            color={colors.border} 
            style={styles.emptyIcon} 
          />
          <Text style={styles.emptyTitle}>Sin Sesión Activa</Text>
          <Text style={styles.emptyText}>
            Para comenzar tu entrenamiento, primero tenés que importar un plan en formato JSON desde la pestaña de gestión.
          </Text>
          <Button 
            label="Ir a Importar" 
            icon="import-export" 
            onPress={() => router.push("/(import)")} 
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `Sesión ${session.sesion}` }} />
      <View style={styles.container}>
        <FlatList
          data={session.ejercicios}
          keyExtractor={(item) => item.nombre}
          renderItem={({ index }) => (
            <ExerciseCard exerciseIndex={index} />
          )}
          ListHeaderComponent={<SessionHeader />}
          contentContainerStyle={styles.scrollContent}
          contentInsetAdjustmentBehavior="automatic"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
    gap: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: 'Anton_400Regular',
    fontSize: 24,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  emptyText: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
});
