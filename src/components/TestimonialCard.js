// ============================================================
// src/components/TestimonialCard.js
//
// Carte de témoignage avec photo, nom, ville, texte et étoiles
// ============================================================

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function TestimonialCard({ name, city, text, avatar }) {
    return (
        <View style={styles.card}>
            {/* En-tête : photo + nom + ville */}
            <View style={styles.header}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.city}>{city}</Text>
                </View>
            </View>

            {/* Texte du témoignage */}
            <Text style={styles.text}>{text}</Text>

            {/* Étoiles */}
            <Text style={styles.stars}>★★★★☆</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        width: 200,
        marginRight: SPACING.md,
        ...SHADOWS.card,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        gap: SPACING.sm,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24, // cercle parfait
        backgroundColor: COLORS.inputBackground,
    },
    name: {
        fontSize: FONTS.sm,
        fontWeight: FONTS.bold,
        color: COLORS.textDark,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    city: {
        fontSize: FONTS.xs,
        color: COLORS.textLight,
        textTransform: 'uppercase',
    },
    text: {
        fontSize: FONTS.sm,
        color: COLORS.textMedium,
        lineHeight: 19,
        marginBottom: SPACING.sm,
    },
    stars: {
        fontSize: FONTS.md,
        color: '#F4C430', // jaune doré pour les étoiles
        letterSpacing: 2,
    },
});