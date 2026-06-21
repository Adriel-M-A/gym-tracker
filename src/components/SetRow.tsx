import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SetData } from '../types/workout';
import { colors } from '../constants/theme';

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
  const sugeridoTexto = `${set.peso_sugerido} kg × ${sugeridoReps}`;
  const sugeridoSufijo = set.serie_controlada ? ' (–)' : '';

  const handleRowPress = () => {
    if (set.serie_controlada) {
      onQuickComplete();
      return;
    }
    onSelect();
  };

  const renderCheckCol = () => {
    if (set.completada) {
      return (
        <Pressable onPress={onQuickComplete} hitSlop={10} style={styles.checkPressable}>
          <MaterialIcons name="check-circle" size={24} color={colors.textPrimary} />
        </Pressable>
      );
    }

    const numberStyle = isSelected ? styles.numberCircleSelected : styles.numberCirclePending;
    const textNumberStyle = isSelected ? styles.numberTextSelected : styles.numberTextPending;
    
    return (
      <Pressable 
        onPress={set.serie_controlada ? onQuickComplete : onSelect} 
        hitSlop={10} 
        style={styles.checkPressable}
      >
        <View style={[styles.numberCircle, numberStyle]}>
          <Text style={[styles.numberText, textNumberStyle]}>{set.serie}</Text>
        </View>
      </Pressable>
    );
  };

  if (set.completada) {
    return (
      <Pressable onPress={handleRowPress} style={[styles.container, styles.containerCompleted]}>
        <View style={styles.colCheck}>{renderCheckCol()}</View>
        
        <View style={styles.colSugerido}>
          <View style={[styles.sugeridoInner, styles.opacity50]}>
            <Text style={styles.textSugeridoCompleted}>
              {sugeridoTexto}{sugeridoSufijo}
            </Text>
            {set.esfuerzo_sugerido !== null && set.esfuerzo_sugerido > 0 && !set.serie_controlada && (
              <View style={styles.effortBadge}>
                <Text style={styles.effortBadgeText}>RPE {set.esfuerzo_sugerido}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.colRealizado}>
          <View style={styles.realizadoInner}>
            <Text style={styles.textRealizado}>
              {set.peso_real} KG × {set.reps_reales}
            </Text>
            {set.esfuerzo_real > 0 && (
              <View style={[styles.effortBadge, styles.effortBadgeReal]}>
                <Text style={styles.effortBadgeTextReal}>RPE {set.esfuerzo_real}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  if (isSelected) {
    return (
      <Pressable onPress={handleRowPress} style={[styles.container, styles.containerSelected]}>
        <View style={styles.colCheck}>{renderCheckCol()}</View>
        
        <View style={styles.colSugerido}>
          <View style={styles.sugeridoInner}>
            <Text style={styles.textSugeridoActive}>
              {sugeridoTexto}{sugeridoSufijo}
            </Text>
            {set.esfuerzo_sugerido !== null && set.esfuerzo_sugerido > 0 && !set.serie_controlada && (
              <View style={styles.effortBadge}>
                <Text style={styles.effortBadgeText}>RPE {set.esfuerzo_sugerido}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.colRealizado}>
          <View style={styles.realizadoInner}>
            <Text style={styles.textRealizadoActive}>
              {set.peso_real !== null ? set.peso_real : set.peso_sugerido} KG × {set.reps_reales !== null ? set.reps_reales : set.reps_min}
            </Text>
            {set.esfuerzo_real > 0 && (
              <View style={[styles.effortBadge, styles.effortBadgeReal]}>
                <Text style={styles.effortBadgeTextReal}>RPE {set.esfuerzo_real}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  // Pendiente
  return (
    <Pressable onPress={handleRowPress} style={styles.container}>
      <View style={styles.colCheck}>{renderCheckCol()}</View>
      
      <View style={styles.colSugerido}>
        <View style={styles.sugeridoInner}>
          <Text style={styles.textSugeridoPending}>
            {sugeridoTexto}{sugeridoSufijo}
          </Text>
          {set.esfuerzo_sugerido !== null && set.esfuerzo_sugerido > 0 && !set.serie_controlada && (
            <View style={styles.effortBadge}>
              <Text style={styles.effortBadgeText}>RPE {set.esfuerzo_sugerido}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.colRealizado}>
        <View style={styles.realizadoInnerPending}>
          <Text style={styles.textRealizadoPending}>—</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: 8,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#ffffff',
  },
  containerSelected: {
    backgroundColor: colors.surfaceContainerLow,
  },
  containerCompleted: {
    backgroundColor: '#ffffff',
  },
  colCheck: {
    width: 48,
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
    justifyContent: 'center',
  },
  checkPressable: {
    padding: 4,
  },
  numberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberCircleSelected: {
    borderColor: colors.textPrimary,
    backgroundColor: 'transparent',
  },
  numberCirclePending: {
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  numberText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 12,
  },
  numberTextSelected: {
    color: colors.textPrimary,
  },
  numberTextPending: {
    color: colors.textSecondary,
  },
  sugeridoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  opacity50: {
    opacity: 0.5,
  },
  textSugeridoCompleted: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  textSugeridoActive: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  textSugeridoPending: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  realizadoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  realizadoInnerPending: {
    opacity: 0.3,
  },
  textRealizado: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  textRealizadoActive: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  textRealizadoPending: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
    color: colors.textSecondary,
  },
  effortBadge: {
    backgroundColor: '#eeeeed',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  effortBadgeText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 10,
    color: colors.textSecondary,
  },
  effortBadgeReal: {
    backgroundColor: colors.textPrimary,
  },
  effortBadgeTextReal: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 10,
    color: '#ffffff',
  },
});


