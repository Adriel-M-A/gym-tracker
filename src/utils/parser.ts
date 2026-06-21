import { WorkoutSession } from '../types/workout';

export function parseWorkout(json: unknown): WorkoutSession {
  // TODO: Implementar validación y parseo real
  return json as WorkoutSession;
}
