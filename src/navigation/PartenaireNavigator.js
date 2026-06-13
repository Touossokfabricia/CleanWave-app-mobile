import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardPartenaire from '../screens/dashboard/DashboardPartenaire';

const Stack = createNativeStackNavigator();

export default function PartenaireNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DashboardPartenaire" component={DashboardPartenaire} />
        </Stack.Navigator>
    );
}
