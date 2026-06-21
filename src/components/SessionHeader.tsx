import React from 'react';
import { View, StyleSheet } from 'react-native';
import Stepper from './Stepper';
import { colors } from '../constants/theme';

interface SessionHeaderProps {
  energia: number | null;
  suenio: number | null;
  onEnergiaChange: (v: number) => void;
  onSuenioChange: (v: number) => void;
}

export default function SessionHeader({ 
  energia, 
  suenio, 
  onEnergiaChange, 
  onSuenioChange 
}: SessionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.steppersRow}>
        <View style={styles.cardContainer}>
          <Stepper 
            label="Energía" 
            value={energia ?? 3} 
            onChange={onEnergiaChange} 
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
            onChange={onSuenioChange} 
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
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

