import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export function Button({ 
  label, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  icon
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <View style={styles.content}>
        {icon && (
          <MaterialIcons 
            name={icon} 
            size={18} 
            color={isPrimary ? '#ffffff' : colors.textPrimary} 
            style={styles.icon}
          />
        )}
        <Text 
          style={[
            styles.text, 
            isPrimary ? styles.textPrimary : styles.textSecondary
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: colors.textPrimary,
  },
});

