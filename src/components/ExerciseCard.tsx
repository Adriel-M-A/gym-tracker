import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
        style={({ pressed }) => [
          styles.header, 
          isExpanded && styles.headerExpanded,
          pressed && styles.headerPressed
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{exercise.nombre}</Text>
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
                key={set.serie}
                set={set}
                isSelected={selectedIndex === index}
                onSelect={() => handleSelect(index)}
                onQuickComplete={() => handleQuickComplete(index)}
              />
            ))}
          </View>

          {/* Panel de carga */}
          {selectedIndex !== null && (
            <InputPanel
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
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
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


