import { FlatList, View, StyleSheet, Text } from "react-native";
import { Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useEffect, useState, useRef } from "react";
import { ExerciseCard } from "../../components/ExerciseCard";
import { SessionHeader } from "../../components/SessionHeader";
import { Button } from "../../components/Button";
import { colors } from "../../constants/theme";
import { useWorkoutStore } from "../../store/workoutStore";

export default function WorkoutScreen() {
  const session = useWorkoutStore(state => state.session);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (session && (typeof (session as any).sesion === 'number' || !session.ejercicios.every((ej: any) => 'categoria' in ej))) {
      // Limpiar sesión con formato antiguo persistida en AsyncStorage para evitar errores
      useWorkoutStore.setState({ session: null });
    }
  }, [session]);

  const listData = useMemo(() => {
    if (!session) return [];
    
    const data: any[] = [];
    let lastCategory = '';
    
    session.ejercicios.forEach((ej, index) => {
      const cat = ej.categoria || 'Entrenamiento';
      if (cat !== lastCategory) {
        data.push({ itemType: 'category_separator', category: cat, key: `sep-${cat}-${index}` });
        lastCategory = cat;
      }
      data.push({ itemType: 'ejercicio', index, key: `ej-${ej.nombre}-${index}` });
    });
    
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
      <Stack.Screen options={{ title: session.nombre_dia || `Día ${session.dia_rutina}` }} />
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index: flatListIndex }) => {
            if (item.itemType === 'category_separator') {
              return (
                <View style={styles.separatorContainer}>
                  <View style={styles.separatorLine} />
                  <Text style={styles.separatorText}>{item.category.toUpperCase()}</Text>
                  <View style={styles.separatorLine} />
                </View>
              );
            }
            return (
              <ExerciseCard 
                exerciseIndex={item.index} 
                isExpanded={expandedIndex === item.index}
                onToggleExpand={() => {
                  const isExpanding = expandedIndex !== item.index;
                  setExpandedIndex(isExpanding ? item.index : null);
                  
                  if (isExpanding) {
                    setTimeout(() => {
                      flatListRef.current?.scrollToIndex({
                        index: flatListIndex,
                        animated: true,
                        viewPosition: 0,
                        viewOffset: 16
                      });
                    }, 150);
                  }
                }}
              />
            );
          }}
          ListHeaderComponent={<SessionHeader />}
          contentContainerStyle={styles.scrollContent}
          contentInsetAdjustmentBehavior="automatic"
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 100));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ 
                index: info.index, 
                animated: true, 
                viewPosition: 0, 
                viewOffset: 16 
              });
            });
          }}
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
