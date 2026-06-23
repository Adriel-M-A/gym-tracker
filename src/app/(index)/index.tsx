import { FlatList, View, StyleSheet, Text } from "react-native";
import { Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ExerciseCard } from "../../components/ExerciseCard";
import { SessionHeader } from "../../components/SessionHeader";
import { Button } from "../../components/Button";
import { colors } from "../../constants/theme";
import { useWorkoutStore } from "../../store/workoutStore";

export default function WorkoutScreen() {
  const session = useWorkoutStore(state => state.session);

  const listData = useMemo(() => {
    if (!session) return [];
    
    const data: any[] = [];
    
    session.ejercicios.forEach((ej, index) => {
      data.push({ itemType: 'ejercicio', index, type: 'ejercicios', key: `ej-${ej.nombre}-${index}` });
    });
    
    if (session.core && session.core.length > 0) {
      data.push({ itemType: 'core_separator', key: 'core_separator' });
      session.core.forEach((ej, index) => {
        data.push({ itemType: 'ejercicio', index, type: 'core', key: `core-${ej.nombre}-${index}` });
      });
    }
    
    return data;
  }, [session]);

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
          data={listData}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            if (item.itemType === 'core_separator') {
              return (
                <View style={styles.separatorContainer}>
                  <View style={styles.separatorLine} />
                  <Text style={styles.separatorText}>BLOQUE COMPLEMENTARIO</Text>
                  <View style={styles.separatorLine} />
                </View>
              );
            }
            return (
              <ExerciseCard 
                exerciseIndex={item.index} 
                type={item.type as 'ejercicios' | 'core'} 
              />
            );
          }}
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
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    fontFamily: 'Anton_400Regular',
    color: colors.textSecondary,
    fontSize: 16,
    paddingHorizontal: 16,
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
