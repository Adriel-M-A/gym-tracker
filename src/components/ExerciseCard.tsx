import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { EffortLevel } from '../types/workout';
import { colors } from '../constants/theme';
import { SetRow } from './SetRow';
import { InputPanel } from './InputPanel';
import { useWorkoutStore } from '../store/workoutStore';

interface ExerciseCardProps {
  exerciseIndex: number;
}

export function ExerciseCard({ exerciseIndex }: ExerciseCardProps) {
  const exercise = useWorkoutStore(state => state.session!.ejercicios[exerciseIndex]);
  const updateSet = useWorkoutStore(state => state.updateSet);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  const handleToggleExpand = () => {
    if (!isExpanded) {
      setSelectedIndex(null);
    }
    setIsExpanded(!isExpanded);
  };



  const handleLoad = (peso: number, reps: number, esfuerzo: EffortLevel) => {
    if (selectedIndex !== null) {
      updateSet(exerciseIndex, selectedIndex, peso, reps, esfuerzo);
      setSelectedIndex(null);
    }
  };

  const completadas = exercise.series.filter(s => s.peso !== null && s.repeticiones !== null).length;
  const total = exercise.series.length;
  const isFinished = completadas === total && total > 0;

  return (
    <View style={[styles.card, isFinished && styles.cardFinished]}>
      {/* Header con expand/collapse */}
      <Pressable
        onPress={handleToggleExpand}
        style={({ pressed }) => [
          styles.header, 
          isExpanded && styles.headerExpanded,
          pressed && styles.headerPressed,
          isFinished && styles.headerFinished
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isFinished && styles.titleFinished]}>{exercise.nombre}</Text>
            {isFinished && (
              <MaterialIcons name="check-circle" size={18} color={colors.textSecondary} />
            )}
          </View>
          <View style={styles.headerMeta}>
            <View style={styles.metaItem}>
              <MaterialIcons name="sync" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>Progreso: {completadas}/{total}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="timer" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>Descanso: {exercise.descanso}</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <MaterialIcons 
            name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color={colors.textSecondary} 
          />
        </View>
      </Pressable>

      {/* Contenido expandible */}
      {isExpanded && (
        <View style={styles.content}>
          {/* Encabezado de la tabla de series */}
          <View style={styles.tableHeader}>
            <View style={styles.colCheckPlaceholder} />
            <Text style={styles.tableHeaderLabel}>SUGERIDO</Text>
            <Text style={[styles.tableHeaderLabel, styles.tableHeaderLabelRight]}>REALIZADO</Text>
          </View>

          {/* Filas de series */}
          <View style={styles.seriesContainer}>
            {exercise.series.map((set, index) => (
              <SetRow
                key={set.numero_serie}
                set={set}
                isSelected={selectedIndex === index}
                onSelect={() => handleSelect(index)}
              />
            ))}
          </View>

          {/* Panel de carga */}
          {selectedIndex !== null && (
            <InputPanel
              key={exercise.series[selectedIndex].numero_serie}
              set={exercise.series[selectedIndex]}
              onLoad={handleLoad}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  cardFinished: {
    backgroundColor: colors.surfaceContainerLow,
    opacity: 0.85,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 0 0 rgba(0,0,0,0)',
  },
  headerFinished: {
    backgroundColor: 'transparent',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  titleFinished: {
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  headerExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerPressed: {
    backgroundColor: '#faf9f9',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  content: {
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    height: 32,
    backgroundColor: '#faf9f9',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  colCheckPlaceholder: {
    width: 48,
  },
  tableHeaderLabel: {
    flex: 1,
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 9,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableHeaderLabelRight: {
    textAlign: 'right',
  },
  seriesContainer: {
    backgroundColor: '#ffffff',
  },
});


