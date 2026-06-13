import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DashboardLayout from '../../components/DashboardLayout';
import { COLORS, SPACING } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPartenaire() {
    const [activeTab, setActiveTab] = useState(0);
    const { profile } = useAuth();

    const tabs = [
        { label: 'Campagnes', icon: 'campaign' },
        { label: 'Résultats', icon: 'chart-bar' },
        { label: 'Participants', icon: 'people' },
        { label: 'Ressources', icon: 'package' },
        { label: 'Messages', icon: 'email' },
        { label: 'Paramètres', icon: 'cog' },
    ];

    const screens = [
        <View key="campagnes" style={styles.container}>
            <Text style={styles.title}>Mes Campagnes</Text>
            <View style={styles.card}>
                <View style={styles.campaignItem}>
                    <Text style={styles.campaignName}>Nettoyage Parc Central</Text>
                    <Text style={styles.campaignDate}>Du 20 au 27 mai 2026</Text>
                    <Text style={styles.campaignStat}>50 participants</Text>
                </View>
            </View>
        </View>,
        <View key="resultats" style={styles.container}>
            <Text style={styles.title}>Résultats</Text>
            <View style={styles.card}>
                <Text style={styles.resultItem}>• Total collecté: 500 kg</Text>
                <Text style={styles.resultItem}>• Participants actifs: 45</Text>
                <Text style={styles.resultItem}>• Impact environnemental: Excellent</Text>
            </View>
        </View>,
        <View key="participants" style={styles.container}>
            <Text style={styles.title}>Participants</Text>
            <View style={styles.card}>
                <Text style={styles.cardText}>50 participants inscrits</Text>
            </View>
        </View>,
        <View key="ressources" style={styles.container}>
            <Text style={styles.title}>Ressources</Text>
            <View style={styles.card}>
                <Text style={styles.resourceItem}>• Sacs de collecte: 100</Text>
                <Text style={styles.resourceItem}>• Gants: 200</Text>
                <Text style={styles.resourceItem}>• Gilets de sécurité: 50</Text>
            </View>
        </View>,
        <View key="messages" style={styles.container}>
            <Text style={styles.title}>Messages</Text>
            <View style={styles.card}>
                <Text style={styles.cardText}>Aucun message pour le moment</Text>
            </View>
        </View>,
        <View key="params" style={styles.container}>
            <Text style={styles.title}>Paramètres</Text>
            <View style={styles.card}>
                <Text style={styles.settingItem}>• Organisation: EcoClean</Text>
                <Text style={styles.settingItem}>• Notifications: Activées</Text>
            </View>
        </View>,
    ];

    return (
        <DashboardLayout
            userName={profile?.nom || 'Partenaire'}
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
    cardText: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        paddingVertical: SPACING.lg,
    },
    campaignItem: {
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    campaignName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    campaignDate: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
    },
    campaignStat: {
        fontSize: 14,
        color: COLORS.textDark,
    },
    resultItem: {
        fontSize: 14,
        color: COLORS.textDark,
        paddingVertical: SPACING.md,
    },
    resourceItem: {
        fontSize: 14,
        color: COLORS.textDark,
        paddingVertical: SPACING.md,
    },
    settingItem: {
        fontSize: 14,
        color: COLORS.textDark,
        paddingVertical: SPACING.md,
    },
});
