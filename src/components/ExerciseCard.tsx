import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ExerciseData, EffortLevel } from '../types/workout';
import { colors } from '../constants/theme';
import SetRow from './SetRow';
import InputPanel from './InputPanel';

interface ExerciseCardProps {
  exercise: ExerciseData;
  onSetUpdate: (
    serieIndex: number,
    peso: number | null,
    reps: number | null,
    esfuerzo: EffortLevel,
    completada: boolean
  ) => void;
}

export default function ExerciseCard({ exercise, onSetUpdate }: ExerciseCardProps) {
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

  const handleQuickComplete = (index: number) => {
    const set = exercise.series[index];
    if (set.completada) {
      onSetUpdate(index, null, null, 0, false);
    } else {
      onSetUpdate(index, set.peso_sugerido, set.reps_min, 0, true);
    }
    setSelectedIndex(null);
  };

  const handleLoad = (peso: number, reps: number, esfuerzo: EffortLevel) => {
    if (selectedIndex !== null) {
      onSetUpdate(selectedIndex, peso, reps, esfuerzo, true);
      setSelectedIndex(null);
    }
  };

  const completadas = exercise.series.filter(s => s.completada).length;
  const total = exercise.series.length;

  return (
    <View style={styles.card}>
      {/* Header con expand/collapse */}
      <Pressable
        onPress={handleToggleExpand}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{exercise.nombre}</Text>
          <Text style={styles.subtitle}>descanso: {exercise.descanso}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.progressText}>{completadas}/{total}</Text>
          <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
        </View>
      </Pressable>

      {/* Contenido expandible */}
      {isExpanded && (
        <>
          {/* Cabecera de tabla */}
          <View style={styles.tableHeader}>
            <View style={styles.colCheck} />
            <Text style={[styles.colSugerido, styles.headerLabel]}>Sugerido</Text>
            <Text style={[styles.colRealizado, styles.headerLabel]}>Realizado</Text>
          </View>

          {/* Filas de series */}
          {exercise.series.map((set, index) => (
            <SetRow
              key={set.serie}
              set={set}
              isSelected={selectedIndex === index}
              onSelect={() => handleSelect(index)}
              onQuickComplete={() => handleQuickComplete(index)}
            />
          ))}

          {/* Panel de carga */}
          {selectedIndex !== null && (
            <InputPanel
              set={exercise.series[selectedIndex]}
              onLoad={handleLoad}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerPressed: {
    backgroundColor: '#f8fafc',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  colCheck: { width: 44 },
  colSugerido: { flex: 1 },
  colRealizado: { flex: 1, textAlign: 'right' },
});
