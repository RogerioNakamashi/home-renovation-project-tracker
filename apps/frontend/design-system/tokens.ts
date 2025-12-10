export const designTokens = {
  colors: {
    // Primary Colors - Azul/Verde inspirado no Handoff
    primary: {
      50: "#e6f7f0",
      100: "#b3e6d1",
      200: "#80d5b2",
      300: "#4dc493",
      400: "#1ab374",
      500: "#00a862", // Primary brand color
      600: "#008750",
      700: "#00663e",
      800: "#00452c",
      900: "#00241a",
    },
    // Secondary Colors - Azul complementar
    secondary: {
      50: "#e6f2ff",
      100: "#b3d9ff",
      200: "#80c0ff",
      300: "#4da7ff",
      400: "#1a8eff",
      500: "#0075ff", // Secondary brand color
      600: "#005dd9",
      700: "#0045b3",
      800: "#002d8d",
      900: "#001567",
    },
    // Neutral Colors
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
    // Semantic Colors
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
    },
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
    },
    info: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
    },
    // Background Colors
    background: {
      white: "#ffffff",
      light: "#fafafa",
      dark: "#0a0a0a",
    },
    // Text Colors
    text: {
      primary: "#171717",
      secondary: "#525252",
      tertiary: "#a3a3a3",
      inverse: "#ffffff",
      dark: "#0a0a0a",
    },
  },
  typography: {
    fontFamily: {
      sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      mono: ["var(--font-geist-mono)", "monospace"],
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
      sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
      base: ["1rem", { lineHeight: "1.5rem" }], // 16px
      lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
      xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
      "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
      "5xl": ["3rem", { lineHeight: "1" }], // 48px
      "6xl": ["3.75rem", { lineHeight: "1" }], // 60px
    },
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
  },
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
  transitions: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
} as const;

// Component-specific tokens
export const componentTokens = {
  button: {
    primary: {
      bg: designTokens.colors.primary[500],
      hover: designTokens.colors.primary[600],
      text: designTokens.colors.text.inverse,
      padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
      borderRadius: designTokens.borderRadius.lg,
    },
    secondary: {
      bg: "transparent",
      border: `1px solid ${designTokens.colors.neutral[300]}`,
      hover: designTokens.colors.neutral[100],
      text: designTokens.colors.text.primary,
      padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
      borderRadius: designTokens.borderRadius.lg,
    },
  },
  card: {
    bg: designTokens.colors.background.white,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.xl,
    shadow: designTokens.shadows.md,
  },
  input: {
    border: `1px solid ${designTokens.colors.neutral[300]}`,
    borderRadius: designTokens.borderRadius.md,
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    focus: {
      border: `2px solid ${designTokens.colors.primary[500]}`,
      outline: "none",
    },
  },
} as const;
