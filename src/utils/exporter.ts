import { WorkoutSession } from '../types/workout';

export function exportSession(session: WorkoutSession): string {
  // TODO: Implementar lógica real para devolver texto
  return JSON.stringify(session, null, 2);
}
