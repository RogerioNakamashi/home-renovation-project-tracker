/**
 * Design System Export
 * Central export for all design system tokens and utilities
 */

export { designTokens, componentTokens } from './tokens';

// Re-export commonly used tokens for convenience
export const colors = {
  primary: '#00a862',
  secondary: '#0075ff',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  neutral: {
    light: '#fafafa',
    medium: '#737373',
    dark: '#171717',
  },
} as const;

