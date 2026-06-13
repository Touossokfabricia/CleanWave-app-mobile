import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * DashboardLayout: Composant wrapper pour dashboard avec sidebar/navigation
 * Adaptable pour desktop (sidebar) et mobile (bottom tabs)
 */
export default function DashboardLayout({
    userName = 'Utilisateur',
    children,
    tabs,
    activeTab,
    onTabChange,
}) {
    const { signOut } = useAuth();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Wrapper pour gérer la déconnexion avec état de loading
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const result = await signOut();
            if (result?.error) {
                console.error('Logout failed:', result.error);
                // L'état local a déjà été nettoyé en fallback dans signOut()
            }
        } catch (error) {
            console.error('Logout exception:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (isMobile) {
        // VERSION MOBILE: Navigation en bas
        return (
            <View style={styles.mobileContainer}>
                {/* Header */}
                <View style={styles.mobileHeader}>
                    <View>
                        <Text style={styles.mobileTitle}>CleanWave</Text>
                        <Text style={styles.mobileSubtitle}>Bienvenue, {userName}</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} disabled={isLoggingOut} style={styles.logoutIcon}>
                        {isLoggingOut ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <MaterialCommunityIcons name="logout" size={24} color={COLORS.primary} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Contenu principal */}
                <ScrollView style={styles.mobileContent} showsVerticalScrollIndicator={false}>
                    {children}
                </ScrollView>

                {/* Navigation en bas */}
                <View style={styles.bottomNav}>
                    {tabs.map((tab, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.bottomNavItem,
                                activeTab === index && styles.bottomNavItemActive,
                            ]}
                            onPress={() => onTabChange(index)}
                        >
                            <MaterialCommunityIcons
                                name={tab.icon}
                                size={24}
                                color={activeTab === index ? COLORS.primary : COLORS.textLight}
                            />
                            <Text
                                style={[
                                    styles.bottomNavLabel,
                                    activeTab === index && styles.bottomNavLabelActive,
                                ]}
                                numberOfLines={1}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    }

    // VERSION DESKTOP: Navigation latérale (Sidebar)
    return (
        <View style={styles.desktopContainer}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
                <View style={styles.sidebarHeader}>
                <MaterialCommunityIcons name="account-circle" size={40} color={COLORS.white} />
                </View>

                <ScrollView style={styles.sidebarMenu} showsVerticalScrollIndicator={false}>
                    {tabs.map((tab, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.sidebarMenuItem,
                                activeTab === index && styles.sidebarMenuItemActive,
                            ]}
                            onPress={() => onTabChange(index)}
                        >
                            <MaterialCommunityIcons
                                name={tab.icon}
                                size={20}
                                color={activeTab === index ? COLORS.accent : COLORS.white}
                            />
                            <Text
                                style={[
                                    styles.sidebarMenuLabel,
                                    activeTab === index && styles.sidebarMenuLabelActive,
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.sidebarButton} onPress={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="logout" size={18} color={COLORS.white} />
                            <Text style={styles.sidebarButtonText}>Se deconnecter</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.signalerButton}>
                    <Text style={styles.signalerButtonText}>Signaler</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                <View style={styles.desktopHeader}>
                    <Text style={styles.desktopTitle}>Bienvenue, {userName}</Text>
                    <TouchableOpacity onPress={handleLogout} disabled={isLoggingOut} style={styles.desktopLogout}>
                        {isLoggingOut ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <MaterialCommunityIcons name="logout" size={24} color={COLORS.primary} />
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.desktopContentArea}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // ============= MOBILE =============
    mobileContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    mobileHeader: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingTop: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    mobileTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    mobileSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: SPACING.xs,
    },
    logoutIcon: {
        padding: SPACING.sm,
    },
    mobileContent: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: 8,
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    bottomNavItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
    },
    bottomNavItemActive: {
        backgroundColor: COLORS.lightGreen,
        borderBottomWidth: 3,
        borderBottomColor: COLORS.primary,
    },
    bottomNavLabel: {
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    bottomNavLabelActive: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },

    // ============= DESKTOP =============
    desktopContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.background,
    },
    sidebar: {
        width: 220,
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.md,
        justifyContent: 'space-between',
    },
    sidebarHeader: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    sidebarTitle: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: SPACING.sm,
    },
    sidebarMenu: {
        flex: 1,
    },
    sidebarMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        marginVertical: SPACING.xs,
        borderRadius: RADIUS.md,
    },
    sidebarMenuItemActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    sidebarMenuLabel: {
        color: COLORS.white,
        fontSize: 13,
        marginLeft: SPACING.md,
        fontWeight: '500',
    },
    sidebarMenuLabelActive: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    sidebarButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
    },
    sidebarButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        marginLeft: SPACING.sm,
        fontSize: 13,
    },
    signalerButton: {
        backgroundColor: COLORS.white,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    signalerButtonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 13,
    },

    // ============= DESKTOP MAIN CONTENT =============
    mainContent: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    desktopHeader: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    desktopTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    desktopLogout: {
        padding: SPACING.sm,
    },
    desktopContentArea: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.lg,
    },
});
