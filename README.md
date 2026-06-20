# gym-tracker

App móvil de uso personal para registrar y hacer el seguimiento de mis sesiones de entrenamiento. Construida con React Native y Expo SDK 56.

## Propósito

Esta aplicación está diseñada a medida para agilizar mi proceso en el gimnasio. En lugar de copiar, pegar y editar rutinas en un editor de texto convencional, la app leerá mis datos de entrenamiento generados a partir de mi base de datos personal (SQLite) y mostrará tarjetas interactivas por cada ejercicio y serie. Al finalizar la rutina, la app me permitirá exportar los datos realizados para guardarlos directamente en mi base de datos, manteniendo un historial preciso y centralizado.

## Requisitos

- Node.js >= 20.19.4
- pnpm
- Expo Go SDK 56 instalado en el celular (APK para Android: https://expo.dev/go?sdkVersion=56&platform=android&device=true)

## Comandos

### Iniciar el servidor de desarrollo
pnpm start

### Iniciar directamente en Android
pnpm android

### Limpiar caché de Metro (usar cuando cambios estructurales no se reflejan en Expo Go)
pnpm start -c

## Testing

La app se testea exclusivamente con Expo Go durante el desarrollo. Al finalizar, se compilará el APK de producción para instalarlo en mi celular Android.
