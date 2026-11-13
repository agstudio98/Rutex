export const theme = {
  colors: {
    background: '#000000',
    backgroundSubtle: '#080808',
    surface: '#0F0F0F',
    surfaceElevated: '#171717',
    border: '#262626',
    borderSubtle: '#1C1C1C',
    borderWhite: '#FFFFFF',
    borderYellow: '#FFE600',

    // Botones y destacados amarillos brutalistas
    yellow: '#FFE600',
    yellowHover: '#E5CF00',
    yellowMuted: '#332E00',

    // Tipografía monocromática de alto contraste
    textPrimary: '#FFFFFF',
    textSecondary: '#A3A3A3',
    textMuted: '#666666',
    textDark: '#000000',

    // Alertas y peligro brutalista
    danger: '#FF3333',
    dangerDark: '#330A0A',
    success: '#00FF66',
    info: '#00E5FF',
  },
  fonts: {
    h1: 'Nunito_900Black',
    h2: 'Nunito_800ExtraBold',
    h3: 'Nunito_700Bold',
    body: 'WorkSans_400Regular',
    bodyMedium: 'WorkSans_500Medium',
    bodySemiBold: 'WorkSans_600SemiBold',
    bodyBold: 'WorkSans_700Bold',
  },
  // Brutalismo: sin sombras
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  },
  radii: {
    none: 0,
    sharp: 2,
    sm: 4,
    md: 8,
    full: 9999,
  },
};

export default theme;
