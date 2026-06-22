import { FlatList, View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ExerciseCard } from "../../components/ExerciseCard";
import { SessionHeader } from "../../components/SessionHeader";
import { colors } from "../../constants/theme";
import { useWorkoutStore } from "../../store/workoutStore";

export default function WorkoutScreen() {
  const session = useWorkoutStore(state => state.session);

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
});
