import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DashboardLayout from '../../components/DashboardLayout';
import { COLORS, SPACING } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

function CollecteurScreenContent() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Planning Collecte</Text>
            <View style={styles.card}>
                <View style={styles.planItem}>
                    <Text style={styles.planDate}>2026-05-21</Text>
                    <Text style={styles.planTask}>Collecte Secteur Nord - 09:00</Text>
                </View>
                <View style={styles.planItem}>
                    <Text style={styles.planDate}>2026-05-22</Text>
                    <Text style={styles.planTask}>Collecte Secteur Sud - 14:00</Text>
                </View>
            </View>
        </View>
    );
}

export default function DashboardCollecteur() {
    const [activeTab, setActiveTab] = useState(0);
    const { profile } = useAuth();

    const tabs = [
        { label: 'Planning', icon: 'calendar' },
        { label: 'Collectes', icon: 'truck' },
        { label: 'Statistiques', icon: 'chart-line' },
        { label: 'Équipe', icon: 'users' },
        { label: 'Rapports', icon: 'file-document' },
        { label: 'Paramètres', icon: 'cog' },
    ];

    const screens = [
        <CollecteurScreenContent key="planning" />,
        <View key="collectes" style={styles.container}>
            <Text style={styles.title}>Mes Collectes</Text>
            <View style={styles.card}>
                <Text style={styles.cardText}>200 kg de déchets collectés ce mois</Text>
            </View>
        </View>,
        <View key="stats" style={styles.container}>
            <Text style={styles.title}>Statistiques</Text>
            <View style={styles.card}>
                <Text style={styles.statItem}>• Total mensuel: 200 kg</Text>
                <Text style={styles.statItem}>• Nombre de trajets: 15</Text>
                <Text style={styles.statItem}>• Efficiency: 95%</Text>
            </View>
        </View>,
        <View key="equipe" style={styles.container}>
            <Text style={styles.title}>Mon Équipe</Text>
            <View style={styles.card}>
                <Text style={styles.cardText}>3 membres dans votre équipe</Text>
            </View>
        </View>,
        <View key="rapports" style={styles.container}>
            <Text style={styles.title}>Rapports</Text>
            <View style={styles.card}>
                <Text style={styles.cardText}>Rapport mensuel disponible</Text>
            </View>
        </View>,
        <View key="params" style={styles.container}>
            <Text style={styles.title}>Paramètres</Text>
            <View style={styles.card}>
                <Text style={styles.settingItem}>• Zone assignée: Nord</Text>
                <Text style={styles.settingItem}>• Notifications: Activées</Text>
            </View>
        </View>,
    ];

    return (
        <DashboardLayout
            userName={profile?.nom || 'Collecteur'}
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
    planItem: {
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    planDate: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
    },
    planTask: {
        fontSize: 14,
        color: COLORS.textDark,
    },
    statItem: {
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
