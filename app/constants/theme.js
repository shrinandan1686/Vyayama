
export const COLORS = {
    // Base Colors
    primary: '#2E6AFF', // Electric Blue
    primaryGradientStart: '#2E6AFF',
    primaryGradientEnd: '#0442D1',

    secondary: '#C6FF00', // Neon Lime (Accent)

    // Backgrounds
    background: '#121212', // Deep Dark - Main app background
    surface: '#1E1E1E', // Slightly Lighter Dark for Cards
    surfaceLight: '#2C2C2C', // Even Lighter for inputs/elements
    modalBackground: '#1C1C1E', // Modal/overlay backgrounds
    cardBackground: '#262626', // Card backgrounds

    // Text
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textMuted: '#666666',

    // Status
    success: '#00E676',
    error: '#FF5252',
    warning: '#FFAB40',

    // Borders & Overlays
    border: '#333333',
    borderLight: 'rgba(255, 255, 255, 0.1)',
    borderDark: 'rgba(255, 255, 255, 0.05)',
    borderFocus: 'rgba(255, 255, 255, 0.08)',

    // Glass/Blur effects
    glassLight: 'rgba(255, 255, 255, 0.1)',
    glassDark: 'rgba(255, 255, 255, 0.05)',

    // Solid colors
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
};

export const SIZES = {
    // Global sizes
    base: 8,
    font: 14,
    radius: 12,
    radiusSmall: 8,
    radiusMedium: 12,
    radiusLarge: 16,
    radiusFull: 999,
    padding: 24,
    paddingSmall: 16,
    paddingMini: 12,

    // Margins
    marginVertical: 12,
    marginSection: 25,
    marginSmall: 10,

    // Font Sizes
    largeTitle: 40,
    h1: 30,
    h2: 22,
    h3: 18,
    h4: 16,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    caption: 12,
    small: 10,

    // App dimensions
    width: '100%',
    height: '100%',
};

export const FONTS = {
    largeTitle: { fontSize: SIZES.largeTitle, fontWeight: '800', color: COLORS.text },
    h1: { fontSize: SIZES.h1, fontWeight: '700', color: COLORS.text },
    h2: { fontSize: SIZES.h2, fontWeight: '700', color: COLORS.text },
    h3: { fontSize: SIZES.h3, fontWeight: '600', color: COLORS.text },
    h4: { fontSize: SIZES.h4, fontWeight: '600', color: COLORS.text },
    body1: { fontSize: SIZES.body1, fontWeight: '400', color: COLORS.text },
    body2: { fontSize: SIZES.body2, fontWeight: '400', color: COLORS.text },
    body3: { fontSize: SIZES.body3, fontWeight: '400', color: COLORS.text },
    body4: { fontSize: SIZES.body4, fontWeight: '400', color: COLORS.text },
    button: { fontSize: SIZES.body3, fontWeight: '600', color: COLORS.white },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
