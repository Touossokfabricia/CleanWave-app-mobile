import React, { useState } from 'react';
import { View } from 'react-native';
import DashboardLayout from '../../components/DashboardLayout';
import {
    NotificationsScreen,
    ClassementScreen,
    StatistiquesScreen,
    ParametresScreen,
    HistoriquesScreen,
    VoirSignalementScreen,
    GererCompteScreen,
} from './CitoyenScreens';
import { useAuth } from '../../context/AuthContext';

export default function DashboardCitoyen() {
    const [activeTab, setActiveTab] = useState(0);
    const { profile } = useAuth();

    const tabs = [
        { label: 'Notifications', icon: 'bell' },
        { label: 'Classement', icon: 'trophy' },
        { label: 'Statistiques', icon: 'chart-line' },
        { label: 'Paramètres', icon: 'cog' },
        { label: 'Historiques', icon: 'history' },
        { label: 'Signalements', icon: 'flag' },
        { label: 'Mon Compte', icon: 'account' },
    ];

    const screens = [
        <NotificationsScreen key="notifications" />,
        <ClassementScreen key="classement" />,
        <StatistiquesScreen key="stats" />,
        <ParametresScreen key="params" />,
        <HistoriquesScreen key="history" />,
        <VoirSignalementScreen key="signalement" />,
        <GererCompteScreen key="compte" />,
    ];

    return (
        <DashboardLayout
            userName={profile?.nom || 'Citoyen'}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {screens[activeTab]}
        </DashboardLayout>
    );
}
