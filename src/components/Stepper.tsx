import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../constants/theme';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  label?: string;
}

export default function Stepper({ value, onChange, step = 0.25, min, max, label }: StepperProps) {
  const handleDecrement = () => {
    const newValue = value - step;
    if (min !== undefined && newValue < min) return;
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  // Redondear para evitar flotantes raros en JS (ej: 0.10 + 0.20 = 0.3000000000004)
  const displayValue = Number.isInteger(value) ? value.toString() : parseFloat(value.toFixed(2)).toString();

  const isDecrementDisabled = min !== undefined && value <= min;
  const isIncrementDisabled = max !== undefined && value >= max;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.controls}>
        <Pressable 
          onPress={handleDecrement} 
          disabled={isDecrementDisabled}
          style={({ pressed }) => [
            styles.button, 
            pressed && styles.buttonPressed,
            isDecrementDisabled && styles.buttonDisabled
          ]}
        >
          <Text style={[styles.buttonText, isDecrementDisabled && styles.buttonTextDisabled]}>-</Text>
        </Pressable>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{displayValue}</Text>
        </View>
        <Pressable 
          onPress={handleIncrement} 
          disabled={isIncrementDisabled}
          style={({ pressed }) => [
            styles.button, 
            pressed && styles.buttonPressed,
            isIncrementDisabled && styles.buttonDisabled
          ]}
        >
          <Text style={[styles.buttonText, isIncrementDisabled && styles.buttonTextDisabled]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonDisabled: {
    backgroundColor: 'transparent',
  },
  buttonTextDisabled: {
    color: colors.border, // un tono gris claro/medio para denotar deshabilitado
  },
  buttonText: {
    fontSize: 20,
    color: colors.accent,
    fontWeight: '500',
  },
  valueContainer: {
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
