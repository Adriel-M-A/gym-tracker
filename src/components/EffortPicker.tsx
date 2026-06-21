import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, effortColor } from '../constants/theme';
import { EffortLevel } from '../types/workout';

interface EffortPickerProps {
  value: EffortLevel;
  onChange: (level: EffortLevel) => void;
}

const EFFORT_LEVELS: EffortLevel[] = [1, 2, 3, 4, 5];

export default function EffortPicker({ value, onChange }: EffortPickerProps) {
  const handlePress = (level: EffortLevel) => {
    // Si toca el mismo que ya está seleccionado, lo desmarca (vuelve a 0)
    if (value === level) {
      onChange(0);
    } else {
      onChange(level);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Esfuerzo</Text>
      <View style={styles.row}>
        {EFFORT_LEVELS.map((level) => {
          const isSelected = value === level;
          const badgeColor = effortColor[level];
          
          return (
            <Pressable
              key={level}
              onPress={() => handlePress(level)}
              style={({ pressed }) => [
                styles.badge,
                {
                  borderColor: isSelected ? badgeColor : colors.border,
                  backgroundColor: isSelected ? badgeColor : colors.background,
                },
                pressed && styles.pressed
              ]}
            >
              <Text 
                style={[
                  styles.badgeText, 
                  { color: isSelected ? '#fff' : colors.textSecondary }
                ]}
              >
                {level}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
