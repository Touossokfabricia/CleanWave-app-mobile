// ============================================================
// src/constants/theme.js
//
// Ce fichier centralise TOUTES les couleurs, polices et espacements
// de l'application. L'avantage : si tu veux changer une couleur,
// tu la modifies ici une seule fois et ça s'applique partout.
// ============================================================

export const COLORS = {
    // Verts principaux (extraits de tes images)
    primary: '#1B5E20',        // Vert foncé du header/hero
    primaryLight: '#2E7D32',   // Vert moyen
    accent: '#43A047',         // Vert accent des boutons
    accentBright: '#4CAF50',   // Vert vif pour les highlights

    // Fonds
    background: '#FFFFFF',
    backgroundGray: '#F7F7F7', // Fond gris très clair des cartes
    backgroundDark: '#1A2E1A', // Fond sombre de la section statistiques

    // Textes
    textDark: '#1A1A1A',
    textMedium: '#555555',
    textLight: '#888888',
    textWhite: '#FFFFFF',

    // Inputs / Formulaires
    inputBackground: '#E8E8E8',
    inputBorder: '#DDDDDD',
    inputPlaceholder: '#999999',
    border: '#E0E0E0',

    // Utilitaires
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.45)',  // Overlay sombre sur le hero
    cardShadow: 'rgba(0, 0, 0, 0.08)',

    // Google button
    googleBg: '#4CAF50',

    // Couleurs dashboard (stats cards)
    lightGreen: '#66BB6A',
    lightBlue: '#42A5F5',
    lightOrange: '#FFA726',
    lightRed: '#EF5350',
};

export const FONTS = {
    // Tailles de texte
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    xxxl: 36,

    // Poids
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const RADIUS = {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    full: 999, // Pour les pilules/cercles parfaits
};

export const SHADOWS = {
    card: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        elevation: 3, // Android only
    },
    button: {
        boxShadow: '0 4px 8px rgba(27, 94, 32, 0.3)',
        elevation: 6,
    },
};