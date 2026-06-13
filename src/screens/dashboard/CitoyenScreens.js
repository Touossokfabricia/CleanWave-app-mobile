import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

export function NotificationsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notifications</Text>
            <View style={styles.card}>
                <Text style={styles.cardText}>Aucune notification pour le moment</Text>
            </View>
        </View>
    );
}

export function ClassementScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Classement</Text>
            <View style={styles.card}>
                <View style={styles.rankItem}>
                    <Text style={styles.rankNumber}>1.</Text>
                    <Text style={styles.rankName}>Marie (245 points)</Text>
                </View>
                <View style={styles.rankItem}>
                    <Text style={styles.rankNumber}>2.</Text>
                    <Text style={styles.rankName}>Jean (198 points)</Text>
                </View>
                <View style={styles.rankItem}>
                    <Text style={styles.rankNumber}>3.</Text>
                    <Text style={styles.rankName}>Sophie (156 points)</Text>
                </View>
            </View>
        </View>
    );
}

export function StatistiquesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Statistiques</Text>
            <View style={styles.card}>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Déchets collectés:</Text>
                    <Text style={styles.statValue}>45 kg</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Points gagnés:</Text>
                    <Text style={styles.statValue}>120 pts</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Participations:</Text>
                    <Text style={styles.statValue}>12</Text>
                </View>
            </View>
        </View>
    );
}

export function ParametresScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Paramètres</Text>
            <View style={styles.card}>
                <Text style={styles.settingItem}>• Notifications: Activées</Text>
                <Text style={styles.settingItem}>• Affichage des résultats: Public</Text>
                <Text style={styles.settingItem}>• Langue: Français</Text>
            </View>
        </View>
    );
}

export function HistoriquesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historiques</Text>
            <View style={styles.card}>
                <View style={styles.historyItem}>
                    <Text style={styles.historyDate}>2026-05-20</Text>
                    <Text style={styles.historyText}>Collecte de 5 kg de plastique</Text>
                </View>
                <View style={styles.historyItem}>
                    <Text style={styles.historyDate}>2026-05-19</Text>
                    <Text style={styles.historyText}>Participation au nettoyage du parc</Text>
                </View>
            </View>
        </View>
    );
}

export function VoirSignalementScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Voir Signalement</Text>
            <View style={styles.card}>
                <Text style={styles.cardText}>Aucun signalement actuellement</Text>
            </View>
        </View>
    );
}

export function GererCompteScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gérer Compte</Text>
            <View style={styles.card}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>user@example.com</Text>
                <Text style={styles.infoLabel} style={{ marginTop: SPACING.lg }}>Nom d'utilisateur:</Text>
                <Text style={styles.infoValue}>Paul</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: SPACING.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: SPACING.lg,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: SPACING.lg,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        elevation: 3,
    },
    cardText: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        paddingVertical: SPACING.lg,
    },
    rankItem: {
        flexDirection: 'row',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    rankNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        width: 30,
    },
    rankName: {
        fontSize: 14,
        color: COLORS.textDark,
        flex: 1,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    settingItem: {
        fontSize: 14,
        color: COLORS.textDark,
        paddingVertical: SPACING.md,
    },
    historyItem: {
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    historyDate: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
    },
    historyText: {
        fontSize: 14,
        color: COLORS.textDark,
    },
    infoLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
    },
});
