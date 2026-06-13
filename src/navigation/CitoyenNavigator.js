import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardCitoyen from '../screens/dashboard/DashboardCitoyen';

const Stack = createNativeStackNavigator();

export default function CitoyenNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DashboardCitoyen" component={DashboardCitoyen} />
        </Stack.Navigator>
    );
}
