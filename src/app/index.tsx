import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
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
      
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Header de la Sesión en el ScrollView */}
        <View style={styles.titleSection}>
          <Text style={styles.titleMain}>Sesión {session.sesion}</Text>
        </View>

        <SessionHeader
          energia={session.energia}
          suenio={session.suenio}
          onEnergiaChange={handleEnergiaChange}
          onSuenioChange={handleSuenioChange}
        />

        <View style={styles.exerciseList}>
          {session.ejercicios.map((ej, index) => (
            <ExerciseCard
              key={ej.nombre}
              exercise={ej}
              onSetUpdate={(sIndex, peso, reps, esf, completada) =>
                handleSetUpdate(index, sIndex, peso, reps, esf, completada)
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.navBar, { paddingBottom: insets.bottom || 16 }]}>
        <Pressable style={[styles.navButton, styles.navButtonActive]}>
          <MaterialIcons name="fitness-center" size={24} color={colors.textPrimary} />
          <Text style={styles.navTextActive}>Workout</Text>
        </Pressable>
        <Pressable style={styles.navButton}>
          <MaterialIcons name="swap-horiz" size={24} color={colors.textSecondary} />
          <Text style={styles.navText}>Importar/Exportar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 100, // Espacio para el navBar
  },
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  titleLabel: {
    fontFamily: "Lexend_700Bold",
    fontSize: 10,
    textTransform: "uppercase",
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  titleMain: {
    fontFamily: "Anton_400Regular",
    fontSize: 32,
    color: colors.textPrimary,
  },
  exerciseList: {
    marginTop: 8,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  navButtonActive: {
    borderTopWidth: 2,
    borderTopColor: colors.textPrimary,
    marginTop: -8, // Ajuste para el borde superior que sube
    paddingTop: 12,
  },
  navText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 10,
    textTransform: "uppercase",
    color: colors.textSecondary,
    marginTop: 4,
  },
  navTextActive: {
    fontFamily: "Lexend_700Bold",
    fontSize: 10,
    textTransform: "uppercase",
    color: colors.textPrimary,
    marginTop: 4,
  },
});

