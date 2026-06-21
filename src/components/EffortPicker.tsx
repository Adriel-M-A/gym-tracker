import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../constants/theme';
import { EffortLevel } from '../types/workout';

interface EffortPickerProps {
  value: EffortLevel;
  onChange: (level: EffortLevel) => void;
}

const EFFORT_LEVELS: EffortLevel[] = [1, 2, 3, 4, 5];

export default function EffortPicker({ value, onChange }: EffortPickerProps) {
  const handlePress = (level: EffortLevel) => {
    if (value === level) {
      onChange(0); // deseleccionar
    } else {
      onChange(level);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Esfuerzo Percibido (RPE)</Text>
      <View style={styles.row}>
        {EFFORT_LEVELS.map((level) => {
          const isSelected = value === level;
          
          return (
            <Pressable
              key={level}
              onPress={() => handlePress(level)}
              style={({ pressed }) => [
                styles.badge,
                isSelected ? styles.badgeSelected : styles.badgeInactive,
                pressed && styles.pressed
              ]}
            >
              <Text 
                style={[
                  styles.badgeText, 
                  isSelected ? styles.textSelected : styles.textInactive
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
    marginVertical: 16,
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
  row: {
    flexDirection: 'row',
    gap: 4,
    width: '100%',
  },
  badge: {
    flex: 1,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInactive: {
    borderColor: colors.border,
    backgroundColor: '#ffffff',
  },
  badgeSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.8,
  },
  badgeText: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
  },
  textInactive: {
    color: colors.textSecondary,
  },
  textSelected: {
    color: '#ffffff',
  },
});

