export const colors = {
  background:      '#f2f2f7',  // fondo de la pantalla
  card:            '#ffffff',  // fondo de tarjetas y paneles
  border:          '#e5e5ea',  // bordes y separadores
  textPrimary:     '#1c1c1e',  // texto principal
  textSecondary:   '#8e8e93',  // metadatos, etiquetas, notas
  accent:          '#3b82f6',  // azul de selección y acción primaria
  success:         '#34c759',  // check completado, serie controlada
  danger:          '#ff3b30',  // alerta, fallo
};

// Color del badge de esfuerzo según nivel
export const effortColor: Record<number, string> = {
  0: colors.textSecondary,  // normal, sin marca (no se muestra badge)
  1: '#a8c5fa',             // azul claro, esfuerzo mínimo perceptible
  2: '#34c759',             // verde, cómodo
  3: '#ffcc00',             // amarillo, exigente
  4: '#ff9500',             // naranja, consolidando
  5: '#ff3b30',             // rojo, fallo o límite
};
