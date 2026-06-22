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

interface WorkoutState {
  session: WorkoutSession;
  setEnergia: (energia: number) => void;
  setSuenio: (suenio: number) => void;
  updateSet: (
    ejercicioIndex: number,
    serieIndex: number,
    peso: number | null,
    reps: number | null,
    esfuerzo: EffortLevel,
    completada: boolean
  ) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  session: initialMockData,
  setEnergia: (energia: number) =>
    set((state) => ({ session: { ...state.session, energia } })),
  setSuenio: (suenio: number) =>
    set((state) => ({ session: { ...state.session, suenio } })),
  updateSet: (ejercicioIndex, serieIndex, peso, reps, esfuerzo, completada) =>
    set((state) => {
      const newEjercicios = state.session.ejercicios.map((ej, ei) => {
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
      return { session: { ...state.session, ejercicios: newEjercicios } };
    }),
}));
