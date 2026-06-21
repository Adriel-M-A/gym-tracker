import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ExerciseCard from "../components/ExerciseCard";
import SessionHeader from "../components/SessionHeader";
import { colors } from "../constants/theme";
import { EffortLevel, WorkoutSession } from "../types/workout";

// Datos de prueba: Día 1 — Pecho y Tríceps
const initialMockData: WorkoutSession = {
  sesion: 1,
  energia: null,
  suenio: null,
  ejercicios: [
    {
      nombre: "Press plano con barra",
      descanso: "2 min",
      series: [
        {
          serie: 1,
          peso_sugerido: 45,
          reps_min: 12,
          reps_max: 12,
          serie_controlada: true,
          esfuerzo_sugerido: null,
          nota: null,
          peso_real: null,
          reps_reales: null,
          esfuerzo_real: 0,
          completada: false,
        },
        {
          serie: 2,
          peso_sugerido: 52.5,
          reps_min: 10,
          reps_max: 10,
          serie_controlada: false,
          esfuerzo_sugerido: 1,
          nota: null,
          peso_real: null,
          reps_reales: null,
          esfuerzo_real: 0,
          completada: false,
        },
        {
          serie: 3,
          peso_sugerido: 57.5,
          reps_min: 8,
          reps_max: 8,
          serie_controlada: false,
          esfuerzo_sugerido: 3,
          nota: "Mantener carga. Enfocar en control excéntrico.",
          peso_real: null,
          reps_reales: null,
          esfuerzo_real: 0,
          completada: false,
        },
        {
          serie: 4,
          peso_sugerido: 60,
          reps_min: 6,
          reps_max: 6,
          serie_controlada: false,
          esfuerzo_sugerido: 3,
          nota: "Mantener carga. Enfocar en control excéntrico.",
          peso_real: null,
          reps_reales: null,
          esfuerzo_real: 0,
          completada: false,
        },
      ],
    },
    {
      nombre: "Press inclinado con mancuernas",
      descanso: "2 min",
      series: [
        {
          serie: 1,
          peso_sugerido: 14,
          reps_min: 12,
          reps_max: 12,
          serie_controlada: true,
          esfuerzo_sugerido: null,
          nota: null,
          peso_real: null,
          reps_reales: null,
          esfuerzo_real: 0,
          completada: false,
        },
        {
          serie: 2,
          peso_sugerido: 16,
          reps_min: 10,
          reps_max: 10,
          serie_controlada: false,
          esfuerzo_sugerido: null,
          nota: null,
          peso_real: null,
          reps_reales: null,
          esfuerzo_real: 0,
          completada: false,
        },
        {
          serie: 3,
          peso_sugerido: 18,
          reps_min: 8,
          reps_max: 8,
          serie_controlada: false,
          esfuerzo_sugerido: null,
          nota: null,
          peso_real: null,
          reps_reales: null,
          esfuerzo_real: 0,
          completada: false,
        },
        {
          serie: 4,
          peso_sugerido: 16,
          reps_min: 8,
          reps_max: 8,
          serie_controlada: false,
          esfuerzo_sugerido: 3,
          nota: "Mantener carga. Enfocar en control excéntrico.",
          peso_real: null,
          reps_reales: null,
          esfuerzo_real: 0,
          completada: false,
        },
      ],
    },
  ],
};

export default function WorkoutScreen() {
  const [session, setSession] = useState<WorkoutSession>(initialMockData);
  const insets = useSafeAreaInsets();

  const handleEnergiaChange = (v: number) =>
    setSession((s) => ({ ...s, energia: v }));
  const handleSuenioChange = (v: number) =>
    setSession((s) => ({ ...s, suenio: v }));

  const handleSetUpdate = (
    ejercicioIndex: number,
    serieIndex: number,
    peso: number | null,
    reps: number | null,
    esfuerzo: EffortLevel,
    completada: boolean,
  ) => {
    setSession((prev) => {
      const newEjercicios = prev.ejercicios.map((ej, ei) => {
        if (ei !== ejercicioIndex) return ej;
        const newSeries = ej.series.map((s, si) => {
          if (si !== serieIndex) return s;
          return {
            ...s,
            peso_real: peso,
            reps_reales: reps,
            esfuerzo_real: esfuerzo,
            completada,
          };
        });
        return { ...ej, series: newSeries };
      });
      return { ...prev, ejercicios: newEjercicios };
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sesión {session.sesion}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <SessionHeader
          energia={session.energia}
          suenio={session.suenio}
          onEnergiaChange={handleEnergiaChange}
          onSuenioChange={handleSuenioChange}
        />

        {session.ejercicios.map((ej, index) => (
          <ExerciseCard
            key={ej.nombre}
            exercise={ej}
            onSetUpdate={(sIndex, peso, reps, esf, completada) =>
              handleSetUpdate(index, sIndex, peso, reps, esf, completada)
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 56,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
});
