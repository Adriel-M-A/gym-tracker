import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SetData } from '../types/workout';
import { colors } from '../constants/theme';

interface SetRowProps {
  set: SetData;
  isSelected: boolean;
  onSelect: () => void;
}

export function SetRow({ set, isSelected, onSelect }: SetRowProps) {
  const isCompletada = set.peso !== null && set.repeticiones !== null;

  const sugeridoReps = set.reps_sugeridas_min === set.reps_sugeridas_max
    ? `${set.reps_sugeridas_min}`
    : `${set.reps_sugeridas_min}/${set.reps_sugeridas_max}`;
  const sugeridoTexto = `${set.peso_sugerido} kg × ${sugeridoReps}`;

  const handleRowPress = () => {
    onSelect();
  };

  const renderIndicatorCol = () => {
    const numberStyle = isCompletada 
      ? styles.numberCircleCompleted 
      : isSelected ? styles.numberCircleSelected : styles.numberCirclePending;
      
    const textNumberStyle = isCompletada
      ? styles.numberTextCompleted
      : isSelected ? styles.numberTextSelected : styles.numberTextPending;
    
    return (
      <View style={styles.indicatorContainer}>
        <View style={[styles.numberCircle, numberStyle]}>
          <Text style={[styles.numberText, textNumberStyle]}>{set.numero_serie}</Text>
        </View>
        {isCompletada && (
          <View style={styles.completedBadge}>
            <MaterialIcons name="check-circle" size={14} color={colors.textPrimary} />
          </View>
        )}
      </View>
    );
  };

  const sugeridoStyle = [
    isCompletada ? styles.textSugeridoCompleted : (isSelected ? styles.textSugeridoActive : styles.textSugeridoPending),
    set.serie_controlada === 1 && { textDecorationLine: 'underline' as const }
  ];

  if (isCompletada) {
    return (
      <Pressable 
        onPress={handleRowPress} 
        style={[styles.container, styles.containerCompleted]}
        accessibilityRole="button"
        accessibilityLabel={`Serie ${set.numero_serie} completada`}
      >
        <View style={styles.colIndicator}>{renderIndicatorCol()}</View>
        
        <View style={styles.colSugerido}>
          <View style={[styles.sugeridoInner, styles.opacity50]}>
            <Text style={sugeridoStyle}>
              {sugeridoTexto}
            </Text>
            {set.esfuerzo_sugerido > 0 && set.serie_controlada === 0 && (
              <View style={styles.effortBadge}>
                <Text style={styles.effortBadgeText}>{set.esfuerzo_sugerido}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.colRealizado}>
          <View style={styles.realizadoInner}>
            <Text style={styles.textRealizado}>
              {set.peso} KG × {set.repeticiones}
            </Text>
            {set.esfuerzo > 0 && (
              <View style={[styles.effortBadge, styles.effortBadgeReal]}>
                <Text style={styles.effortBadgeTextReal}>{set.esfuerzo}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  if (isSelected) {
    return (
      <Pressable 
        onPress={handleRowPress} 
        style={[styles.container, styles.containerSelected]}
        accessibilityRole="button"
        accessibilityLabel={`Serie ${set.numero_serie} seleccionada`}
      >
        <View style={styles.colIndicator}>{renderIndicatorCol()}</View>
        
        <View style={styles.colSugerido}>
          <View style={styles.sugeridoInner}>
            <Text style={sugeridoStyle}>
              {sugeridoTexto}
            </Text>
            {set.esfuerzo_sugerido > 0 && set.serie_controlada === 0 && (
              <View style={styles.effortBadge}>
                <Text style={styles.effortBadgeText}>{set.esfuerzo_sugerido}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.colRealizado}>
          <View style={styles.realizadoInner}>
            <Text style={styles.textRealizadoActive}>
              {set.peso !== null ? set.peso : set.peso_sugerido} KG × {set.repeticiones !== null ? set.repeticiones : set.reps_sugeridas_min}
            </Text>
            {set.esfuerzo > 0 && (
              <View style={[styles.effortBadge, styles.effortBadgeReal]}>
                <Text style={styles.effortBadgeTextReal}>{set.esfuerzo}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  // Pendiente
  return (
    <Pressable 
      onPress={handleRowPress} 
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={`Serie ${set.numero_serie} pendiente`}
    >
      <View style={styles.colIndicator}>{renderIndicatorCol()}</View>
      
      <View style={styles.colSugerido}>
        <View style={styles.sugeridoInner}>
          <Text style={sugeridoStyle}>
            {sugeridoTexto}
          </Text>
          {set.esfuerzo_sugerido > 0 && set.serie_controlada === 0 && (
            <View style={styles.effortBadge}>
              <Text style={styles.effortBadgeText}>{set.esfuerzo_sugerido}</Text>
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
  colIndicator: {
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
  indicatorContainer: {
    position: 'relative',
    padding: 8,
  },
  numberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberCircleCompleted: {
    borderColor: colors.textPrimary,
    backgroundColor: '#ffffff',
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
  numberTextCompleted: {
    color: colors.textPrimary,
  },
  numberTextSelected: {
    color: colors.textPrimary,
  },
  numberTextPending: {
    color: colors.textSecondary,
  },
  completedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#ffffff',
    borderRadius: 7,
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


