import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stepper } from './Stepper';
import { colors } from '../constants/theme';
import { useWorkoutStore } from '../store/workoutStore';

export function SessionHeader() {
  const energia = useWorkoutStore(state => state.session.energia);
  const suenio = useWorkoutStore(state => state.session.suenio);
  const setEnergia = useWorkoutStore(state => state.setEnergia);
  const setSuenio = useWorkoutStore(state => state.setSuenio);

  return (
    <View style={styles.container}>
      <View style={styles.steppersRow}>
        <View style={styles.cardContainer}>
          <Stepper 
            label="Energía" 
            value={energia ?? 3} 
            onChange={setEnergia} 
            step={1} 
            min={1}
            max={5}
            variant="header"
          />
        </View>
        
        <View style={styles.cardContainer}>
          <Stepper 
            label="Sueño (hs)" 
            value={suenio ?? 7.5} 
            onChange={setSuenio} 
            step={0.5} 
            min={0} 
            variant="header"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  steppersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    width: '100%',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

