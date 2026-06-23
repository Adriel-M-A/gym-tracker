import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stepper } from './Stepper';
import { colors } from '../constants/theme';
import { useWorkoutStore } from '../store/workoutStore';

export function SessionHeader() {
  const energia = useWorkoutStore(state => state.session?.energia);
  const suenioHoras = useWorkoutStore(state => state.session?.suenio_horas);
  const setEnergia = useWorkoutStore(state => state.setEnergia);
  const setSuenioHoras = useWorkoutStore(state => state.setSuenioHoras);

  // Estado y acciones del cronómetro
  const timerIsRunning = useWorkoutStore(state => state.timerIsRunning);
  const timerStartTime = useWorkoutStore(state => state.timerStartTime);
  const timerElapsedSeconds = useWorkoutStore(state => state.timerElapsedSeconds);
  const startTimer = useWorkoutStore(state => state.startTimer);
  const pauseTimer = useWorkoutStore(state => state.pauseTimer);

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const updateTime = () => {
      if (timerIsRunning && timerStartTime !== null) {
        const diff = Math.floor((Date.now() - timerStartTime) / 1000);
        setSeconds(timerElapsedSeconds + diff);
      } else {
        setSeconds(timerElapsedSeconds);
      }
    };

    updateTime();

    if (timerIsRunning) {
      interval = setInterval(updateTime, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerIsRunning, timerStartTime, timerElapsedSeconds]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const handleTimerPress = () => {
    if (timerIsRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  return (
    <View style={styles.container}>
      {/* Tarjeta del Cronómetro */}
      <View style={styles.timerCard}>
        <View style={styles.timerLeft}>
          <Text style={styles.timerLabel}>TIEMPO DE ENTRENAMIENTO</Text>
          <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
        </View>
        
        <Pressable
          onPress={handleTimerPress}
          style={({ pressed }) => [
            styles.timerButton,
            timerIsRunning ? styles.timerButtonRunning : styles.timerButtonPaused,
            pressed && styles.pressed
          ]}
        >
          <MaterialIcons 
            name={timerIsRunning ? "pause" : "play-arrow"} 
            size={18} 
            color={timerIsRunning ? colors.danger : "#ffffff"} 
          />
          <Text style={[
            styles.timerButtonText,
            timerIsRunning ? styles.timerButtonTextRunning : styles.timerButtonTextPaused
          ]}>
            {timerIsRunning ? "PAUSAR" : "INICIAR"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.steppersRow}>
        <View style={styles.cardContainer}>
          <Stepper 
            label="Energía" 
            value={energia ?? 3} 
            onChange={setEnergia} 
            step={1} 
            min={1}
            max={5}
            variant="header"
          />
        </View>
        
        <View style={styles.cardContainer}>
          <Stepper 
            label="Sueño (hs)" 
            value={suenioHoras ?? 7} 
            onChange={setSuenioHoras} 
            step={0.5} 
            min={0} 
            variant="header"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  timerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerLeft: {
    flex: 1,
  },
  timerLabel: {
    fontSize: 10,
    fontFamily: 'Lexend_600SemiBold',
    color: colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  timerValue: {
    fontSize: 24,
    fontFamily: 'Lexend_700Bold',
    color: colors.textPrimary,
  },
  timerButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  timerButtonRunning: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  timerButtonPaused: {
    backgroundColor: colors.accent,
  },
  timerButtonText: {
    fontSize: 11,
    fontFamily: 'Lexend_700Bold',
    letterSpacing: 1,
  },
  timerButtonTextRunning: {
    color: colors.danger,
  },
  timerButtonTextPaused: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.8,
  },
  steppersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    width: '100%',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
