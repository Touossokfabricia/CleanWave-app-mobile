// ============================================================
// src/navigation/AppNavigator.js
//
// Configuration de la navigation PUBLIQUE de l'application.
// Ce fichier gère les écrans accessibles SANS être connecté :
//   - Accueil (HomeScreen)
//   - Connexion/Inscription (AuthScreen)
//
// On utilise createStackNavigator qui empile les écrans comme
// des cartes : tu peux avancer et reculer entre elles.
// ============================================================
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import AuthScreen from '../screens/auth/AuthScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                // native-stack utilise les animations système automatiquement
                // pas besoin de cardStyleInterpolator
                animation: 'slide_from_right', // iOS et Android
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
    );
}