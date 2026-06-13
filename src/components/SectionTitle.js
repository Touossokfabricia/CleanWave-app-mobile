// ============================================================
// src/components/SectionTitle.js
//
// Composant réutilisable pour les titres de section.
// Reproduit le style "NOS FONCTIONNALITES" avec la ligne dessous.
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function SectionTitle({ title, light = false }) {
    return (
        <View style={styles.container}>
            <Text style={[styles.title, light && styles.titleLight]}>
                {title}
            </Text>
            {/* La petite ligne décorative sous le titre */}
            <View style={[styles.underline, light && styles.underlineLight]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONTS.xl,
        fontWeight: FONTS.bold,
        color: COLORS.textDark,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    titleLight: {
        color: COLORS.white,
    },
    underline: {
        width: 50,
        height: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
        marginTop: SPACING.sm,
    },
    underlineLight: {
        backgroundColor: COLORS.white,
    },
});