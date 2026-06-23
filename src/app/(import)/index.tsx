import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useWorkoutStore } from '../../store/workoutStore';
import { Button } from '../../components/Button';
import { colors } from '../../constants/theme';
import { WorkoutSession } from '../../types/workout';

/**
 * Valida la estructura del JSON importado y migra campos de versiones antiguas
 * para mantener la retrocompatibilidad con el esquema de entrenamiento.db
 */
function validateWorkoutSession(data: any): data is WorkoutSession {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.dia_rutina !== 'number' || data.dia_rutina < 1 || data.dia_rutina > 4) return false;
  if (data.nombre_dia !== undefined && typeof data.nombre_dia !== 'string') return false;
  
  if (data.duracion_minutos === undefined) {
    data.duracion_minutos = null;
  } else if (data.duracion_minutos !== null && typeof data.duracion_minutos !== 'number') {
    return false;
  }

  if (data.energia !== undefined && data.energia !== null && typeof data.energia !== 'number') return false;
  if (data.suenio_horas !== undefined && data.suenio_horas !== null && typeof data.suenio_horas !== 'number') return false;
  if (data.peso_corporal !== undefined && data.peso_corporal !== null && typeof data.peso_corporal !== 'number') return false;

  if (!Array.isArray(data.ejercicios)) return false;

  for (const ej of data.ejercicios) {
    if (typeof ej.ejercicio_id !== 'number') return false;
    if (typeof ej.nombre !== 'string') return false;
    if (typeof ej.categoria !== 'string') return false;
    if (typeof ej.descanso_min_seg !== 'number') return false;
    if (typeof ej.descanso_max_seg !== 'number') return false;
    if (!Array.isArray(ej.series)) return false;

    for (const set of ej.series) {
      if (typeof set.numero_serie !== 'number') return false;
      if (set.peso_sugerido !== null && typeof set.peso_sugerido !== 'number') return false;
      if (typeof set.reps_sugeridas_min !== 'number') return false;
      if (typeof set.reps_sugeridas_max !== 'number') return false;
      if (typeof set.esfuerzo_sugerido !== 'number') return false;
      if (set.serie_controlada !== 0 && set.serie_controlada !== 1) return false;

      // Adaptar valores cargados por el usuario
      set.peso = set.peso !== undefined ? set.peso : null;
      set.repeticiones = set.repeticiones !== undefined ? set.repeticiones : null;
      set.esfuerzo = set.esfuerzo !== undefined ? set.esfuerzo : null;
      set.notas = set.notas !== undefined ? set.notas : null;
    }
  }

  return true;
}

export default function ImportScreen() {
  const session = useWorkoutStore(state => state.session);
  const importSession = useWorkoutStore(state => state.importSession);
  const resetSession = useWorkoutStore(state => state.resetSession);
  const resetTimer = useWorkoutStore(state => state.resetTimer);

  const totalEjercicios = session ? session.ejercicios.length : 0;
  const totalSeries = session 
    ? session.ejercicios.reduce((acc, ej) => acc + ej.series.length, 0)
    : 0;
  const seriesCompletadas = session
    ? session.ejercicios.reduce(
        (acc, ej) => acc + ej.series.filter(s => s.peso !== null && s.repeticiones !== null).length,
        0
      )
    : 0;

  const progresoPercent = totalSeries > 0 ? (seriesCompletadas / totalSeries) * 100 : 0;

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const fileUri = result.assets[0].uri;
      
      // Usamos fetch en lugar de FileSystem.readAsStringAsync para evitar 
      // restricciones de permisos y ámbitos de URI en Android
      const response = await fetch(fileUri);
      const fileContent = await response.text();

      let parsed;
      try {
        parsed = JSON.parse(fileContent);
      } catch {
        Alert.alert("Error de archivo", "El archivo seleccionado no es un JSON válido.");
        return;
      }

      if (validateWorkoutSession(parsed)) {
        importSession(parsed);
        resetTimer(); // Reiniciamos el cronómetro al importar nueva sesión
        Alert.alert("¡Éxito!", "Sesión de entrenamiento importada correctamente.");
      } else {
        Alert.alert("Archivo no compatible", "El archivo JSON no tiene un formato de sesión válido.");
      }
    } catch (error) {
      Alert.alert("Fallo al importar", "Ocurrió un error leyendo el archivo seleccionado.");
      console.error(error);
    }
  };

  const handleExport = async () => {
    if (!session) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Compartir no disponible", "La función de compartir no está habilitada en este dispositivo.");
        return;
      }

      // Detener el cronómetro y actualizar la duración si sigue en marcha
      let finalSession = useWorkoutStore.getState().session;
      const { timerIsRunning, timerStartTime, timerElapsedSeconds } = useWorkoutStore.getState();
      
      const today = new Date();
      const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      if (timerIsRunning && timerStartTime !== null && finalSession) {
        const additionalSeconds = Math.floor((Date.now() - timerStartTime) / 1000);
        const totalSeconds = timerElapsedSeconds + additionalSeconds;
        const totalMinutes = Math.max(1, Math.round(totalSeconds / 60));
        
        finalSession = {
          ...finalSession,
          fecha: dateString,
          duracion_minutos: totalMinutes,
        };
      } else if (finalSession) {
        // Si no está corriendo pero hay tiempo acumulado
        const totalMinutes = Math.max(1, Math.round(timerElapsedSeconds / 60));
        finalSession = {
          ...finalSession,
          fecha: dateString,
          // Si el cronómetro no se usó nunca, mantemos el 0 o el valor que ya traiga
          duracion_minutos: timerElapsedSeconds > 0 ? totalMinutes : finalSession.duracion_minutos,
        };
      }

      const fileName = `entrenamiento-dia-${finalSession!.dia_rutina}.json`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      const jsonString = JSON.stringify(finalSession, null, 2);

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: `Exportar Día ${finalSession!.dia_rutina}`,
      });

      // Limpiamos la app (cerramos la sesión actual y reseteamos el cronómetro)
      useWorkoutStore.setState({ session: null });
      resetTimer();

      Alert.alert("¡Exportado!", "El entrenamiento fue exportado y la sesión activa ha sido cerrada.");
    } catch (error) {
      Alert.alert("Error al exportar", "No se pudo preparar el archivo para compartir.");
      console.error(error);
    }
  };

  const handleReset = () => {
    if (!session) return;
    Alert.alert(
      "Confirmar reinicio",
      "¿Estás seguro de que querés restablecer la sesión actual al estado sugerido inicial? Se perderán todos los datos que hayas cargado.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Reiniciar", 
          style: "destructive", 
          onPress: () => {
            resetSession();
            resetTimer(); // También reinicia el cronómetro
            Alert.alert("Sesión reiniciada", "Se restableció el entrenamiento al estado inicial.");
          } 
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "GESTIÓN DE SESIÓN" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {/* Tarjeta de estado de la sesión activa */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>SESIÓN ACTIVA</Text>
          <Text style={styles.cardTitle}>{session ? (session.nombre_dia || `Día ${session.dia_rutina}`) : "Sin Sesión"}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalEjercicios}</Text>
              <Text style={styles.statLabel}>Ejercicios</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{seriesCompletadas}/{totalSeries}</Text>
              <Text style={styles.statLabel}>Series</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{session && session.energia !== null ? `${session.energia}/5` : '—'}</Text>
              <Text style={styles.statLabel}>Energía</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Progreso del Entrenamiento</Text>
              <Text style={styles.progressValue}>{Math.round(progresoPercent)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progresoPercent}%` }]} />
            </View>
          </View>
        </View>

        {/* Acciones */}
        <Text style={styles.sectionTitle}>Acciones</Text>
        
        <View style={styles.actionsContainer}>
          <Button 
            label="Importar desde Archivo" 
            icon="file-download" 
            onPress={handleImport}
            variant="primary"
          />
          <Text style={styles.actionDescription}>
            Cargá un archivo JSON con la planificación de tu entrenamiento. Esto reemplazará la sesión activa.
          </Text>

          <Button 
            label="Exportar y Compartir" 
            icon="share" 
            onPress={handleExport}
            variant="primary"
            disabled={!session}
          />
          <Text style={styles.actionDescription}>
            Guardá el archivo con tus series realizadas y compartilo por WhatsApp u otra aplicación.
          </Text>

          <Button 
            label="Reiniciar Sesión Activa" 
            icon="refresh" 
            onPress={handleReset}
            variant="secondary"
            disabled={!session}
          />
          <Text style={styles.actionDescription}>
            Restablece los datos de la sesión actual al estado sugerido inicial de prueba.
          </Text>
        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    fontSize: 10,
    fontFamily: 'Lexend_600SemiBold',
    color: colors.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 28,
    fontFamily: 'Anton_400Regular',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Lexend_400Regular',
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    height: '100%',
  },
  progressContainer: {
    width: '100%',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Lexend_500Medium',
    color: colors.textPrimary,
  },
  progressValue: {
    fontSize: 12,
    fontFamily: 'Lexend_700Bold',
    color: colors.textPrimary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Lexend_700Bold',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  actionDescription: {
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
    color: colors.textSecondary,
    marginTop: -8,
    marginBottom: 8,
    lineHeight: 16,
  },
});
