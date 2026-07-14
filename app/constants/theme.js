
export const COLORS = {
    // Base Colors - Vyayama Premium Design System (Vibrant Neon Blue / Deep Purple / Pitch Black)
    primary: '#00F0FF', // Vibrant Neon Blue
    primaryGradientStart: '#4D008C', // Deep Purple
    primaryGradientEnd: '#00F0FF', // Vibrant Neon Blue

    secondary: '#4D008C', // Deep Purple (Accent)

    // Backgrounds
    background: '#050508', // Pitch Black - Main app background
    surface: '#121218', // Slightly Lighter Dark for Cards
    surfaceLight: '#1E1E28', // Even Lighter for inputs/elements
    modalBackground: '#101014', // Modal/overlay backgrounds
    cardBackground: '#16161E', // Card backgrounds

    // Text
    text: '#FFFFFF',
    textSecondary: '#A9A9B8',
    textMuted: '#65656F',

    // Status
    success: '#00E676',
    error: '#FF5252',
    warning: '#FFAB40',

    // Borders & Overlays
    border: '#2A2A36',
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

// Syne is a display face - reserved for large hero moments (largeTitle/h1/h2)
// only, so it never competes with itself at small sizes. Everything else,
// including mid-size headers (h3/h4), uses Inter's bolder weights - this is
// what keeps the type hierarchy feeling deliberate rather than "loud
// everywhere." Fonts are loaded via useFonts in App.js - these family names
// must match the keys passed there.
export const FONTS = {
    largeTitle: { fontSize: SIZES.largeTitle, fontFamily: 'Syne_800ExtraBold', color: COLORS.text },
    h1: { fontSize: SIZES.h1, fontFamily: 'Syne_800ExtraBold', color: COLORS.text },
    h2: { fontSize: SIZES.h2, fontFamily: 'Syne_800ExtraBold', color: COLORS.text },
    h3: { fontSize: SIZES.h3, fontFamily: 'Inter_700Bold', color: COLORS.text },
    h4: { fontSize: SIZES.h4, fontFamily: 'Inter_700Bold', color: COLORS.text },
    body1: { fontSize: SIZES.body1, fontFamily: 'Inter_400Regular', color: COLORS.text },
    body2: { fontSize: SIZES.body2, fontFamily: 'Inter_400Regular', color: COLORS.text },
    body3: { fontSize: SIZES.body3, fontFamily: 'Inter_400Regular', color: COLORS.text },
    body4: { fontSize: SIZES.body4, fontFamily: 'Inter_400Regular', color: COLORS.text },
    body5: { fontSize: SIZES.small, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary },
    button: { fontSize: SIZES.body3, fontFamily: 'Inter_600SemiBold', color: COLORS.white },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
