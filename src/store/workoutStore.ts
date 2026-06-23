import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSession, EffortLevel } from '../types/workout';

interface WorkoutState {
  session: WorkoutSession | null;
  timerStartTime: number | null;
  timerElapsedSeconds: number;
  timerIsRunning: boolean;
  setEnergia: (energia: number) => void;
  setSuenioHoras: (suenio_horas: number) => void;
  updateSet: (
    ejercicioIndex: number,
    serieIndex: number,
    peso: number | null,
    reps: number | null,
    esfuerzo: EffortLevel | null
  ) => void;
  importSession: (newSession: WorkoutSession) => void;
  resetSession: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      session: null,
      timerStartTime: null,
      timerElapsedSeconds: 0,
      timerIsRunning: false,
      setEnergia: (energia: number) =>
        set((state) => {
          if (!state.session) return {};
          return { session: { ...state.session, energia } };
        }),
      setSuenioHoras: (suenio_horas: number) =>
        set((state) => {
          if (!state.session) return {};
          return { session: { ...state.session, suenio_horas } };
        }),
      updateSet: (ejercicioIndex, serieIndex, peso, reps, esfuerzo) =>
        set((state) => {
          if (!state.session) return {};
          const newArray = state.session.ejercicios.map((ej, ei) => {
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

          return { session: { ...state.session, ejercicios: newArray } };
        }),
      importSession: (newSession: WorkoutSession) =>
        set({ session: newSession }),
      resetSession: () =>
        set((state) => {
          if (!state.session) return {};
          
          const cleanArray = (arr: any[]) => arr.map((ej) => {
            const cleanSeries = ej.series.map((s: any) => ({
              ...s,
              peso: null,
              repeticiones: null,
              esfuerzo: null,
            }));
            return { ...ej, series: cleanSeries };
          });

          return {
            session: {
              ...state.session,
              energia: null,
              suenio_horas: null,
              duracion_minutos: 0,
              ejercicios: cleanArray(state.session.ejercicios),
            },
          };
        }),
      startTimer: () =>
        set((state) => {
          if (state.timerIsRunning) return {};
          return {
            timerIsRunning: true,
            timerStartTime: Date.now(),
          };
        }),
      pauseTimer: () =>
        set((state) => {
          if (!state.timerIsRunning || state.timerStartTime === null) return {};
          const session = state.session;
          const additionalSeconds = Math.floor((Date.now() - state.timerStartTime) / 1000);
          const totalSeconds = state.timerElapsedSeconds + additionalSeconds;
          const totalMinutes = Math.max(1, Math.round(totalSeconds / 60));

          const newSession = session
            ? { ...session, duracion_minutos: totalMinutes }
            : null;

          return {
            timerIsRunning: false,
            timerStartTime: null,
            timerElapsedSeconds: totalSeconds,
            session: newSession,
          };
        }),
      resetTimer: () =>
        set({
          timerStartTime: null,
          timerElapsedSeconds: 0,
          timerIsRunning: false,
        }),
    }),
    {
      name: 'workout-session-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
