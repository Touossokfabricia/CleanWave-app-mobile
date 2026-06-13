// ============================================================
// src/components/FeatureCard.js
//
// Carte de fonctionnalité utilisée dans la section "NOS FONCTIONNALITES"
// Reproduit exactement les cartes blanches avec ombre et icône emoji
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

// On calcule la largeur de la carte selon l'écran
// 2 cartes par ligne avec marges
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;
// Explication : largeur écran - (3 marges de 16px) / 2 colonnes

export default function FeatureCard({ icon, title, description }) {
    return (
        <View style={styles.card}>
            {/* Icône en haut */}
            <Text style={styles.icon}>{icon}</Text>

            {/* Titre en majuscules */}
            <Text style={styles.title}>{title}</Text>

            {/* Description */}
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.card,
        // Le "..." c'est le "spread operator" : ça copie toutes les
        // propriétés de SHADOWS.card dans cet objet de style
    },
    icon: {
        fontSize: 32,
        marginBottom: SPACING.sm,
    },
    title: {
        fontSize: FONTS.xs,
        fontWeight: FONTS.bold,
        color: COLORS.textDark,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.xs,
        lineHeight: 16,
    },
    description: {
        fontSize: FONTS.sm,
        color: COLORS.textMedium,
        lineHeight: 19,
    },
});