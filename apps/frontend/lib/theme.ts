"use client";

import { createTheme } from "@mui/material/styles";
import { designTokens } from "@/design-system";

/**
 * Material UI Theme
 * Based on the Design System tokens from Handoff.ai
 */
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: designTokens.colors.primary[500],
      light: designTokens.colors.primary[300],
      dark: designTokens.colors.primary[700],
      contrastText: designTokens.colors.text.inverse,
    },
    secondary: {
      main: designTokens.colors.secondary[500],
      light: designTokens.colors.secondary[300],
      dark: designTokens.colors.secondary[700],
      contrastText: designTokens.colors.text.inverse,
    },
    error: {
      main: designTokens.colors.error[500],
      light: designTokens.colors.error[100],
      dark: designTokens.colors.error[700],
    },
    warning: {
      main: designTokens.colors.warning[500],
      light: designTokens.colors.warning[100],
      dark: designTokens.colors.warning[700],
    },
    info: {
      main: designTokens.colors.info[500],
      light: designTokens.colors.info[100],
      dark: designTokens.colors.info[700],
    },
    success: {
      main: designTokens.colors.success[500],
      light: designTokens.colors.success[100],
      dark: designTokens.colors.success[700],
    },
    grey: {
      50: designTokens.colors.neutral[50],
      100: designTokens.colors.neutral[100],
      200: designTokens.colors.neutral[200],
      300: designTokens.colors.neutral[300],
      400: designTokens.colors.neutral[400],
      500: designTokens.colors.neutral[500],
      600: designTokens.colors.neutral[600],
      700: designTokens.colors.neutral[700],
      800: designTokens.colors.neutral[800],
      900: designTokens.colors.neutral[900],
    },
    text: {
      primary: designTokens.colors.text.primary,
      secondary: designTokens.colors.text.secondary,
      disabled: designTokens.colors.text.tertiary,
    },
    background: {
      default: designTokens.colors.background.light,
      paper: designTokens.colors.background.white,
    },
    divider: designTokens.colors.neutral[200],
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily.sans.join(", "),
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1,
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.1,
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Matches designTokens.borderRadius.lg
  },
  shadows: [
    "none",
    designTokens.shadows.sm,
    designTokens.shadows.sm,
    designTokens.shadows.md,
    designTokens.shadows.md,
    designTokens.shadows.md,
    designTokens.shadows.lg,
    designTokens.shadows.lg,
    designTokens.shadows.lg,
    designTokens.shadows.lg,
    designTokens.shadows.xl,
    designTokens.shadows.xl,
    designTokens.shadows.xl,
    designTokens.shadows.xl,
    designTokens.shadows.xl,
    designTokens.shadows.xl,
    designTokens.shadows["2xl"],
    designTokens.shadows["2xl"],
    designTokens.shadows["2xl"],
    designTokens.shadows["2xl"],
    designTokens.shadows["2xl"],
    designTokens.shadows["2xl"],
    designTokens.shadows["2xl"],
    designTokens.shadows["2xl"],
    designTokens.shadows["2xl"],
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
          fontWeight: 500,
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: designTokens.colors.primary[600],
          },
        },
        containedSecondary: {
          "&:hover": {
            backgroundColor: designTokens.colors.secondary[600],
          },
        },
        outlined: {
          borderColor: designTokens.colors.neutral[300],
          "&:hover": {
            backgroundColor: designTokens.colors.neutral[100],
            borderColor: designTokens.colors.neutral[400],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.xl,
          boxShadow: designTokens.shadows.md,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.xl,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: designTokens.borderRadius.md,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: designTokens.colors.neutral[400],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: designTokens.colors.primary[500],
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.md,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: designTokens.borderRadius["2xl"],
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: designTokens.shadows.sm,
        },
      },
    },
  },
});

// Dark theme variant
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "dark",
    background: {
      default: designTokens.colors.background.dark,
      paper: designTokens.colors.neutral[900],
    },
    text: {
      primary: designTokens.colors.text.inverse,
      secondary: designTokens.colors.neutral[400],
      disabled: designTokens.colors.neutral[600],
    },
    divider: designTokens.colors.neutral[700],
  },
});
