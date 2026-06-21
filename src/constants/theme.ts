export const colors = {
  background:          '#faf9f9',  // fondo de la pantalla
  card:                '#ffffff',  // fondo de tarjetas y paneles
  border:              '#cfc4c5',  // bordes y separadores secundarios
  borderPrimary:       '#000000',  // bordes principales
  textPrimary:         '#1a1c1c',  // texto principal
  textSecondary:       '#5e5e5e',  // metadatos, etiquetas, notas
  accent:              '#000000',  // negro de selección y acción primaria
  success:             '#000000',  // check completado
  danger:              '#ba1a1a',  // alerta, fallo
  surfaceContainer:    '#eeeeed',  // fondo de paneles de carga
  surfaceContainerLow: '#f4f3f3',  // fondo de serie seleccionada
};

// Color del badge de esfuerzo en tonos acromáticos
export const effortColor: Record<number, string> = {
  0: colors.textSecondary,
  1: '#e3e2e2',
  2: '#dadada',
  3: '#cfc4c5',
  4: '#7e7576',
  5: '#1a1c1c',
};

