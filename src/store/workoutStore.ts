import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSession, EffortLevel } from '../types/workout';

interface WorkoutState {
  session: WorkoutSession | null;
  setEnergia: (energia: number) => void;
  setSuenio: (suenio: number) => void;
  updateSet: (
    ejercicioIndex: number,
    serieIndex: number,
    peso: number | null,
    reps: number | null,
    esfuerzo: EffortLevel
  ) => void;
  importSession: (newSession: WorkoutSession) => void;
  resetSession: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      session: null,
      setEnergia: (energia: number) =>
        set((state) => {
          if (!state.session) return {};
          return { session: { ...state.session, energia } };
        }),
      setSuenio: (suenio: number) =>
        set((state) => {
          if (!state.session) return {};
          return { session: { ...state.session, suenio } };
        }),
      updateSet: (ejercicioIndex, serieIndex, peso, reps, esfuerzo) =>
        set((state) => {
          if (!state.session) return {};
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
      importSession: (newSession: WorkoutSession) =>
        set({ session: newSession }),
      resetSession: () =>
        set((state) => {
          if (!state.session) return {};
          const cleanEjercicios = state.session.ejercicios.map((ej) => {
            const cleanSeries = ej.series.map((s) => ({
              ...s,
              peso: null,
              repeticiones: null,
              esfuerzo: 0 as EffortLevel,
            }));
            return { ...ej, series: cleanSeries };
          });
          return {
            session: {
              ...state.session,
              energia: null,
              suenio: null,
              ejercicios: cleanEjercicios,
            },
          };
        }),
    }),
    {
      name: 'workout-session-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
