import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardAdmin from '../screens/dashboard/DashboardAdmin';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DashboardAdmin" component={DashboardAdmin} />
        </Stack.Navigator>
    );
}
