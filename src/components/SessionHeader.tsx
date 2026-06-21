import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
      <View style={styles.cardContainer}>
        <View style={styles.steppersRow}>
          <Stepper 
            label="Energía (1-5)" 
            value={energia ?? 3} // default visual si es null
            onChange={onEnergiaChange} 
            step={1} 
            min={1}
            max={5}
          />
          <Stepper 
            label="Sueño (hs)" 
            value={suenio ?? 7.5} // default visual si es null
            onChange={onSuenioChange} 
            step={0.10} 
            min={0} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    backgroundColor: colors.background,
  },
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  steppersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
