export const COLORS = {
  // === COULEURS PRIMAIRES ===
  primary: "#2e7d32",
  secondary: "#1976d2",
  success: "#4caf50",
  error: "#f44336",
  warning: "#ff9800",

  // === COULEURS NEUTRALES ===
  background: "#fafafa",
  surface: "#ffffff",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",

  // === COULEURS D'ACCENTUATION ===
  lightGreen: "#e8f5e8",
  lightBlue: "#e3f2fd",
  lightRed: "#ffebee",
  lightOrange: "#fff3e0",
  lightPurple: "#f3e5f5",

  // === COULEURS OPÉRATEURS ===
  moovOrange: "#ff6b00",
  airtelRed: "#e60012",
};

export const SIZES = {
  // === SPACING ===
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,

  // === BORDER RADIUS ===
  radius_sm: 4,
  radius_md: 8,
  radius_lg: 12,
  radius_xl: 16,
  radius_2xl: 20,

  // === FONT SIZES ===
  font_xs: 12,
  font_sm: 14,
  font_base: 16,
  font_lg: 18,
  font_xl: 20,
  font_2xl: 24,
  font_3xl: 28,
  font_4xl: 32,
  font_5xl: 36,
};

export const FONTS = {
  h1: {
    fontSize: SIZES.font_3xl,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: SIZES.font_2xl,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  h3: { fontSize: SIZES.font_xl, fontWeight: "600", color: COLORS.textPrimary },
  h4: {
    fontSize: SIZES.font_base,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  body1: {
    fontSize: SIZES.font_base,
    fontWeight: "400",
    color: COLORS.textPrimary,
  },
  body2: {
    fontSize: SIZES.font_sm,
    fontWeight: "400",
    color: COLORS.textSecondary,
  },
  body3: {
    fontSize: SIZES.font_xs,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
