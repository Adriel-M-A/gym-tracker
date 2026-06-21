// Esfuerzo: 0 = normal sin marca, 1-5 escala numérica
export type EffortLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface SetData {
  serie: number;
  // Campos de la IA (lectura)
  peso_sugerido: number;
  reps_min: number;
  reps_max: number;
  serie_controlada: boolean;  // (-) en la nomenclatura
  esfuerzo_sugerido: EffortLevel | null;
  nota: string | null;
  // Campos del usuario (escritura)
  peso_real: number | null;
  reps_reales: number | null;
  esfuerzo_real: EffortLevel;  // default 0
  completada: boolean;
}

export interface ExerciseData {
  nombre: string;
  descanso: string;
  series: SetData[];
}

export interface WorkoutSession {
  sesion: number;
  energia: number | null;   // 1-5
  suenio: number | null;    // decimal, ej: 7.5
  ejercicios: ExerciseData[];
}
