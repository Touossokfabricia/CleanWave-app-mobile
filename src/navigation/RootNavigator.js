// src/navigation/RootNavigator.js
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Écrans non connectés
import AuthScreen from '../screens/auth/AuthScreen';
import HomeScreen from '../screens/home/HomeScreen';

// Navigateurs connectés (selon le rôle)
import CitoyenNavigator from './CitoyenNavigator';
import CollecteurNavigator from './CollecteurNavigator';
import PartenaireNavigator from './PartenaireNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { user, profile, loading } = useAuth();

    // Pendant la vérification de session, affiche un spinner
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2ECC71" />
            </View>
        );
    }

    // Si l'utilisateur N'EST PAS connecté → écrans de connexion/accueil
    if (!user) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Auth" component={AuthScreen} />
            </Stack.Navigator>
        );
    }

    // Si l'utilisateur EST connecté → navigateur selon son rôle
    // profile?.type contient 'citoyen', 'collecteur', 'partenaire' ou 'admin'
    switch (profile?.type) {
        case 'admin':
            return <AdminNavigator />;
        case 'collecteur':
            return <CollecteurNavigator />;
        case 'partenaire':
            return <PartenaireNavigator />;
        default:
            return <CitoyenNavigator />;
    }
}
           