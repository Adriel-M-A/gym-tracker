// Esfuerzo: 0 = normal sin marca, 1-5 escala numérica
export type EffortLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface SetData {
  numero_serie: number;
  // Campos de la IA (lectura)
  peso_sugerido: number | null;
  reps_sugeridas_min: number;
  reps_sugeridas_max: number;
  serie_controlada: 0 | 1;  // 1 = controlada (-)
  esfuerzo_sugerido: EffortLevel; // 0 = sin marca
  es_bw?: 0 | 1;             // opcional, 1 = peso corporal (bodyweight)
  notas: string | null;
  // Campos del usuario (escritura)
  peso: number | null;
  repeticiones: number | null;
  esfuerzo: EffortLevel | null;    // default null
}

export interface ExerciseData {
  ejercicio_id: number;
  nombre: string;
  categoria: 'Fuerza (Compuesto)' | 'Fuerza (Aislado)' | 'Core';
  descanso_min_seg: number;
  descanso_max_seg: number;
  series: SetData[];
}

export interface WorkoutSession {
  dia_rutina: number;
  nombre_dia?: string;
  fecha: string | null;
  energia: number | null;   // 1-5
  suenio_horas: number | null;    // decimal, ej: 7.5
  peso_corporal: number | null;
  duracion_minutos: number | null; // minutos de entrenamiento
  ejercicios: ExerciseData[];
}
