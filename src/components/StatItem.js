// ============================================================
// src/components/StatItem.js
//
// Un item de statistique : grand nombre + label
// Utilisé dans la section "NOS STATISTIQUES"
// Ex: "300Kg" + "CO2 évités"
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function StatItem({ icon, value, label }) {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1, // chaque item prend le même espace horizontal
        paddingHorizontal: SPACING.xs,
    },
    icon: {
        fontSize: 26,
        marginBottom: 2,
    },
    value: {
        fontSize: FONTS.xxl,
        fontWeight: FONTS.extraBold,
        color: COLORS.white,
        lineHeight: 32,
    },
    label: {
        fontSize: FONTS.xs,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});