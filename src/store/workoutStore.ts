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
  setSuenio: (suenio: number) => void;
  updateSet: (
    type: 'ejercicios' | 'core',
    ejercicioIndex: number,
    serieIndex: number,
    peso: number | null,
    reps: number | null,
    esfuerzo: EffortLevel
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
      setSuenio: (suenio: number) =>
        set((state) => {
          if (!state.session) return {};
          return { session: { ...state.session, suenio } };
        }),
      updateSet: (type, ejercicioIndex, serieIndex, peso, reps, esfuerzo) =>
        set((state) => {
          if (!state.session) return {};
          const targetArray = type === 'core' ? state.session.core || [] : state.session.ejercicios;
          const newArray = targetArray.map((ej, ei) => {
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

          if (type === 'core') {
            return { session: { ...state.session, core: newArray } };
          } else {
            return { session: { ...state.session, ejercicios: newArray } };
          }
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
              esfuerzo: 0 as EffortLevel,
            }));
            return { ...ej, series: cleanSeries };
          });

          return {
            session: {
              ...state.session,
              energia: null,
              suenio: null,
              duracion_minutos: 0,
              ejercicios: cleanArray(state.session.ejercicios),
              core: state.session.core ? cleanArray(state.session.core) : undefined,
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
