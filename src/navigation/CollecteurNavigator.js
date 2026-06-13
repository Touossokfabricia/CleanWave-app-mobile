import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardCollecteur from '../screens/dashboard/DashboardCollecteur';

const Stack = createNativeStackNavigator();

export default function CollecteurNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DashboardCollecteur" component={DashboardCollecteur} />
        </Stack.Navigator>
    );
}
