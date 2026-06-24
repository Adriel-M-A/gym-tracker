import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  label?: string;
  variant?: 'header' | 'input';
  isBase60?: boolean;
}

export function Stepper({ 
  value, 
  onChange, 
  step = 0.25, 
  min, 
  max, 
  label,
  variant = 'header',
  isBase60 = false
}: StepperProps) {
  const handleDecrement = () => {
    let newValue: number;
    if (isBase60) {
      let hours = Math.floor(value);
      let minutes = Math.round((value - hours) * 100);
      minutes -= 10;
      if (minutes < 0) {
        hours -= 1;
        minutes = 50;
      }
      newValue = hours + minutes / 100;
    } else {
      newValue = value - step;
    }

    if (min !== undefined && newValue < min) return;
    onChange(newValue);
  };

  const handleIncrement = () => {
    let newValue: number;
    if (isBase60) {
      let hours = Math.floor(value);
      let minutes = Math.round((value - hours) * 100);
      minutes += 10;
      if (minutes >= 60) {
        hours += 1;
        minutes = 0;
      }
      newValue = hours + minutes / 100;
    } else {
      newValue = value + step;
    }

    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  // Redondear para evitar flotantes en JS y mostrar siempre dos decimales si el paso tiene parte decimal o es base 60
  const displayValue = isBase60 
    ? value.toFixed(2) 
    : (step % 1 !== 0 ? value.toFixed(2) : value.toString());

  const isDecrementDisabled = min !== undefined && value <= min;
  const isIncrementDisabled = max !== undefined && value >= max;

  const isHeader = variant === 'header';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={isHeader ? styles.controlsHeader : styles.controlsInput}>
        <Pressable 
          onPress={handleDecrement} 
          disabled={isDecrementDisabled}
          style={({ pressed }) => [
            isHeader ? styles.buttonHeader : styles.buttonInput, 
            pressed && styles.buttonPressed,
            isDecrementDisabled && styles.buttonDisabled
          ]}
        >
          <MaterialIcons 
            name="remove" 
            size={isHeader ? 16 : 20} 
            color={isDecrementDisabled ? '#cfc4c5' : colors.textPrimary} 
          />
        </Pressable>
        
        <View style={isHeader ? styles.valueContainerHeader : styles.valueContainerInput}>
          <Text style={[styles.valueText, isHeader && styles.valueTextHeader]}>{displayValue}</Text>
        </View>
        
        <Pressable 
          onPress={handleIncrement} 
          disabled={isIncrementDisabled}
          style={({ pressed }) => [
            isHeader ? styles.buttonHeader : styles.buttonInput, 
            pressed && styles.buttonPressed,
            isIncrementDisabled && styles.buttonDisabled
          ]}
        >
          <MaterialIcons 
            name="add" 
            size={isHeader ? 16 : 20} 
            color={isIncrementDisabled ? '#cfc4c5' : colors.textPrimary} 
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontFamily: 'Lexend_600SemiBold',
    color: colors.textSecondary,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  controlsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  controlsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
    width: '100%',
    overflow: 'hidden',
  },
  buttonHeader: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  buttonInput: {
    width: 36,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#f4f3f3',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  valueContainerHeader: {
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainerInput: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 20,
    color: colors.textPrimary,
  },
  valueTextHeader: {
    fontSize: 16,
  },
});

