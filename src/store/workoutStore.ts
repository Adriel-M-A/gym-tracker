import { create } from 'zustand';
import { WorkoutSession, EffortLevel } from '../types/workout';

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
          numero_serie: 1,
          peso_sugerido: 45,
          reps_sugeridas_min: 12,
          reps_sugeridas_max: 12,
          serie_controlada: 1,
          esfuerzo_sugerido: 0,
          es_bw: 0,
          notas: null,
          peso: null,
          repeticiones: null,
          esfuerzo: 0,
        },
        {
          numero_serie: 2,
          peso_sugerido: 52.5,
          reps_sugeridas_min: 10,
          reps_sugeridas_max: 10,
          serie_controlada: 0,
          esfuerzo_sugerido: 1,
          es_bw: 0,
          notas: null,
          peso: null,
          repeticiones: null,
          esfuerzo: 0,
        },
        {
          numero_serie: 3,
          peso_sugerido: 57.5,
          reps_sugeridas_min: 8,
          reps_sugeridas_max: 8,
          serie_controlada: 0,
          esfuerzo_sugerido: 3,
          es_bw: 0,
          notas: "Mantener carga. Enfocar en control excéntrico.",
          peso: null,
          repeticiones: null,
          esfuerzo: 0,
        },
        {
          numero_serie: 4,
          peso_sugerido: 60,
          reps_sugeridas_min: 6,
          reps_sugeridas_max: 6,
          serie_controlada: 0,
          esfuerzo_sugerido: 3,
          es_bw: 0,
          notas: "Mantener carga. Enfocar en control excéntrico.",
          peso: null,
          repeticiones: null,
          esfuerzo: 0,
        },
      ],
    },
    {
      nombre: "Press inclinado con mancuernas",
      descanso: "2 min",
      series: [
        {
          numero_serie: 1,
          peso_sugerido: 14,
          reps_sugeridas_min: 12,
          reps_sugeridas_max: 12,
          serie_controlada: 1,
          esfuerzo_sugerido: 0,
          es_bw: 0,
          notas: null,
          peso: null,
          repeticiones: null,
          esfuerzo: 0,
        },
        {
          numero_serie: 2,
          peso_sugerido: 16,
          reps_sugeridas_min: 10,
          reps_sugeridas_max: 10,
          serie_controlada: 0,
          esfuerzo_sugerido: 0,
          es_bw: 0,
          notas: null,
          peso: null,
          repeticiones: null,
          esfuerzo: 0,
        },
        {
          numero_serie: 3,
          peso_sugerido: 18,
          reps_sugeridas_min: 8,
          reps_sugeridas_max: 8,
          serie_controlada: 0,
          esfuerzo_sugerido: 0,
          es_bw: 0,
          notas: null,
          peso: null,
          repeticiones: null,
          esfuerzo: 0,
        },
        {
          numero_serie: 4,
          peso_sugerido: 16,
          reps_sugeridas_min: 8,
          reps_sugeridas_max: 8,
          serie_controlada: 0,
          esfuerzo_sugerido: 3,
          es_bw: 0,
          notas: "Mantener carga. Enfocar en control excéntrico.",
          peso: null,
          repeticiones: null,
          esfuerzo: 0,
        },
      ],
    },
  ],
};

interface WorkoutState {
  session: WorkoutSession;
  setEnergia: (energia: number) => void;
  setSuenio: (suenio: number) => void;
  updateSet: (
    ejercicioIndex: number,
    serieIndex: number,
    peso: number | null,
    reps: number | null,
    esfuerzo: EffortLevel
  ) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  session: initialMockData,
  setEnergia: (energia: number) =>
    set((state) => ({ session: { ...state.session, energia } })),
  setSuenio: (suenio: number) =>
    set((state) => ({ session: { ...state.session, suenio } })),
  updateSet: (ejercicioIndex, serieIndex, peso, reps, esfuerzo) =>
    set((state) => {
      const newEjercicios = state.session.ejercicios.map((ej, ei) => {
        if (ei !== ejercicioIndex) return ej;
        const newSeries = ej.series.map((s, si) => {
          if (si !== serieIndex) return s;
          return {
            ...s,
            peso,
            repeticiones: reps,
            esfuerzo,
          };
        });
        return { ...ej, series: newSeries };
      });
      return { session: { ...state.session, ejercicios: newEjercicios } };
    }),
}));
