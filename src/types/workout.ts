// Esfuerzo: 0 = normal sin marca, 1-5 escala numérica
export type EffortLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface SetData {
  numero_serie: number;
  // Campos de la IA (lectura)
  peso_sugerido: number;
  reps_sugeridas_min: number;
  reps_sugeridas_max: number;
  serie_controlada: 0 | 1;  // 1 = controlada (-)
  esfuerzo_sugerido: EffortLevel; // 0 = sin marca
  es_bw: 0 | 1;             // 1 = peso corporal (bodyweight)
  notas: string | null;
  // Campos del usuario (escritura)
  peso: number | null;
  repeticiones: number | null;
  esfuerzo: EffortLevel;    // default 0
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
  duracion_minutos: number; // minutos de entrenamiento, default 0
  ejercicios: ExerciseData[];
  core?: ExerciseData[];
}
