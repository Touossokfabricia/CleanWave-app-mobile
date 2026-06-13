import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DashboardLayout from '../../components/DashboardLayout';
import { COLORS, SPACING } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function DashboardAdmin() {
    const [activeTab, setActiveTab] = useState(0);
    const { profile } = useAuth();

    const tabs = [
        { label: 'Dashboard', icon: 'view-dashboard' },
        { label: 'Utilisateurs', icon: 'account-multiple' },
        { label: 'Campagnes', icon: 'campaign' },
        { label: 'Statistiques', icon: 'chart-box' },
        { label: 'Modération', icon: 'shield-account' },
        { label: 'Paramètres', icon: 'cog' },
    ];

    const screens = [
        <View key="dashboard" style={styles.container}>
            <Text style={styles.title}>Vue d'ensemble</Text>
            <View style={styles.statsGrid}>
                <View style={[styles.statsCard, { backgroundColor: COLORS.lightGreen }]}>
                    <Text style={styles.statsValue}>2,450</Text>
                    <Text style={styles.statsLabel}>Utilisateurs</Text>
                </View>
                <View style={[styles.statsCard, { backgroundColor: COLORS.lightBlue }]}>
                    <Text style={styles.statsValue}>156</Text>
                    <Text style={styles.statsLabel}>Campagnes</Text>
                </View>
                <View style={[styles.statsCard, { backgroundColor: COLORS.lightOrange }]}>
                    <Text style={styles.statsValue}>8.2K</Text>
                    <Text style={styles.statsLabel}>Déchets (kg)</Text>
                </View>
                <View style={[styles.statsCard, { backgroundColor: COLORS.lightRed }]}>
                    <Text style={styles.statsValue}>12</Text>
                    <Text style={styles.statsLabel}>Signalements</Text>
                </View>
            </View>
        </View>,
        <View key="utilisateurs" style={styles.container}>
            <Text style={styles.title}>Gestion Utilisateurs</Text>
            <View style={styles.card}>
                <View style={styles.userItem}>
                    <Text style={styles.userName}>Paul - Citoyen</Text>
                    <Text style={styles.userEmail}>paul@example.com</Text>
                    <Text style={styles.userStatus}>Actif ✓</Text>
                </View>
                <View style={styles.userItem}>
                    <Text style={styles.userName}>Marie - Collecteur</Text>
                    <Text style={styles.userEmail}>marie@example.com</Text>
                    <Text style={styles.userStatus}>Actif ✓</Text>
                </View>
            </View>
        </View>,
        <View key="campagnes" style={styles.container}>
            <Text style={styles.title}>Campagnes</Text>
            <View style={styles.card}>
                <View style={styles.campaignItem}>
                    <Text style={styles.campaignName}>Nettoyage Parc Central</Text>
                    <Text style={styles.campaignStatus}>Statut: En cours</Text>
                </View>
                <View style={styles.campaignItem}>
                    <Text style={styles.campaignName}>Collecte Plages</Text>
                    <Text style={styles.campaignStatus}>Statut: Planifiée</Text>
                </View>
            </View>
        </View>,
        <View key="stats" style={styles.container}>
            <Text style={styles.title}>Statistiques Globales</Text>
            <View style={styles.card}>
                <Text style={styles.statItem}>• Total déchets collectés: 8.2 tonnes</Text>
                <Text style={styles.statItem}>• Participation mensuelle: 450 personnes</Text>
                <Text style={styles.statItem}>• Taux d'engagement: 85%</Text>
                <Text style={styles.statItem}>• Zones couvertes: 24</Text>
            </View>
        </View>,
        <View key="moderation" style={styles.container}>
            <Text style={styles.title}>Modération</Text>
            <View style={styles.card}>
                <View style={styles.moderationItem}>
                    <Text style={styles.moderationLabel}>Signalements en attente:</Text>
                    <Text style={styles.moderationValue}>12</Text>
                </View>
                <View style={styles.moderationItem}>
                    <Text style={styles.moderationLabel}>Utilisateurs flaggés:</Text>
                    <Text style={styles.moderationValue}>3</Text>
                </View>
                <View style={styles.moderationItem}>
                    <Text style={styles.moderationLabel}>Contenu à examiner:</Text>
                    <Text style={styles.moderationValue}>8</Text>
                </View>
            </View>
        </View>,
        <View key="params" style={styles.container}>
            <Text style={styles.title}>Paramètres Admin</Text>
            <View style={styles.card}>
                <Text style={styles.settingItem}>• Mode maintenance: Désactivé</Text>
                <Text style={styles.settingItem}>• Emails notifications: Activés</Text>
                <Text style={styles.settingItem}>• Sauvegarde automatique: Activée</Text>
                <Text style={styles.settingItem}>• Logs détaillés: Activés</Text>
            </View>
        </View>,
    ];

    return (
        <DashboardLayout
            userName={profile?.nom || 'Admin'}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {screens[activeTab]}
        </DashboardLayout>
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statsCard: {
        width: '48%',
        borderRadius: 8,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        elevation: 3,
    },
    statsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: SPACING.xs,
    },
    statsLabel: {
        fontSize: 12,
        color: COLORS.white,
        textAlign: 'center',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    userItem: {
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: SPACING.xs,
    },
    userEmail: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
    },
    userStatus: {
        fontSize: 12,
        color: COLORS.accent,
        fontWeight: '600',
    },
    campaignItem: {
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    campaignName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    campaignStatus: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    statItem: {
        fontSize: 14,
        color: COLORS.textDark,
        paddingVertical: SPACING.md,
    },
    moderationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    moderationLabel: {
        fontSize: 14,
        color: COLORS.textDark,
    },
    moderationValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    settingItem: {
        fontSize: 14,
        color: COLORS.textDark,
        paddingVertical: SPACING.md,
    },
});
