import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SetData } from '../types/workout';
import { colors, effortColor } from '../constants/theme';

interface SetRowProps {
  set: SetData;
  isSelected: boolean;
  onSelect: () => void;
  onQuickComplete: () => void;
}

export default function SetRow({ set, isSelected, onSelect, onQuickComplete }: SetRowProps) {
  const sugeridoReps = set.reps_min === set.reps_max
    ? `${set.reps_min}`
    : `${set.reps_min}/${set.reps_max}`;
  const sugeridoTexto = `${set.peso_sugerido} kg x ${sugeridoReps}`;
  const sugeridoSufijo = set.serie_controlada ? ' (–)' : '';

  const handleRowPress = () => {
    if (set.serie_controlada) {
      onQuickComplete();
      return;
    }
    onSelect();
  };

  const renderCheck = () => {
    const handlePress = set.serie_controlada
      ? onQuickComplete
      : (set.completada ? onSelect : onQuickComplete);

    return (
      <Pressable
        onPress={handlePress}
        hitSlop={10}
        style={styles.checkPressable}
      >
        <View style={[styles.checkCircle, set.completada && styles.checkCompleted]}>
          {set.completada && <Text style={styles.checkIcon}>✓</Text>}
        </View>
      </Pressable>
    );
  };

  return (
    <Pressable
      onPress={handleRowPress}
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.containerSelected,
        pressed && !set.serie_controlada && styles.pressed,
      ]}
    >
      {/* Col 1: Check */}
      <View style={styles.colCheck}>
        {renderCheck()}
      </View>
      
      {/* Col 2: Sugerido */}
      <View style={styles.colSugerido}>
        <View style={styles.sugeridoInner}>
          <Text style={[
            styles.textSugerido,
            isSelected && styles.textSelected,
          ]}>
            {sugeridoTexto}{sugeridoSufijo}
          </Text>
          {set.esfuerzo_sugerido !== null && set.esfuerzo_sugerido > 0 && !set.serie_controlada && (
            <View style={[styles.effortBadge, { backgroundColor: effortColor[set.esfuerzo_sugerido] }]}>
              <Text style={styles.effortBadgeText}>{set.esfuerzo_sugerido}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Col 3: Realizado */}
      <View style={styles.colRealizado}>
        {set.completada ? (
          <View style={styles.realizadoInner}>
            <Text style={styles.textRealizado}>
              {set.peso_real} kg x {set.reps_reales}
            </Text>
            {set.esfuerzo_real > 0 && (
              <View style={[styles.effortBadge, { backgroundColor: effortColor[set.esfuerzo_real] }]}>
                <Text style={styles.effortBadgeText}>{set.esfuerzo_real}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.dash}>—</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: 10,
    paddingRight: 16,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  containerSelected: {
    borderLeftColor: colors.accent,
    backgroundColor: '#eff6ff',
  },
  pressed: {
    backgroundColor: '#f5f8ff',
  },
  colCheck: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colSugerido: {
    flex: 1,
    paddingRight: 8,
  },
  colRealizado: {
    flex: 1,
    alignItems: 'flex-end',
  },
  checkPressable: {
    padding: 4,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  checkCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  checkIcon: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  sugeridoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  textSugerido: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  textSelected: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  textMuted: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  textRealizado: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  realizadoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dash: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  effortBadge: {
    width: 22,
    height: 22,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  effortBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
