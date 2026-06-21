import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SetData, EffortLevel } from '../types/workout';
import Stepper from './Stepper';
import EffortPicker from './EffortPicker';
import Button from './Button';
import { colors } from '../constants/theme';

interface InputPanelProps {
  set: SetData;
  onLoad: (peso: number, reps: number, esfuerzo: EffortLevel) => void;
}

export default function InputPanel({ set, onLoad }: InputPanelProps) {
  const [peso, setPeso] = useState<number>(set.peso_sugerido);
  const [reps, setReps] = useState<number>(set.reps_min);
  const [esfuerzo, setEsfuerzo] = useState<EffortLevel>(0);

  useEffect(() => {
    if (set.completada && set.peso_real !== null && set.reps_reales !== null) {
      setPeso(set.peso_real);
      setReps(set.reps_reales);
      setEsfuerzo(set.esfuerzo_real);
    } else {
      setPeso(set.peso_real !== null ? set.peso_real : set.peso_sugerido);
      setReps(set.reps_reales !== null ? set.reps_reales : set.reps_min);
      setEsfuerzo(set.esfuerzo_real || 0);
    }
  }, [set]);

  return (
    <View style={styles.container}>
      <View style={styles.steppersRow}>
        {/* Peso: pasos de 0.25 */}
        <View style={styles.stepperWrapper}>
          <Stepper 
            label="Peso (kg)" 
            value={peso} 
            onChange={setPeso} 
            step={0.25} 
            min={0} 
            variant="input"
          />
        </View>
        
        {/* Reps: pasos de 1 en 1 */}
        <View style={styles.stepperWrapper}>
          <Stepper 
            label="Reps" 
            value={reps} 
            onChange={setReps} 
            step={1} 
            min={1} 
            variant="input"
          />
        </View>
      </View>

      <EffortPicker value={esfuerzo} onChange={setEsfuerzo} />

      <View style={styles.buttonContainer}>
        <Button 
          label="CARGAR SERIE" 
          icon="check" 
          onPress={() => onLoad(peso, reps, esfuerzo)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.surfaceContainer,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  steppersRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 4,
  },
  stepperWrapper: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
  },
});

