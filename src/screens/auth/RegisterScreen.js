import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator,
    KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

export default function RegisterScreen({ navigation }) {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [type, setType] = useState('citoyen'); // sélection du rôle
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();

    const handleRegister = async () => {
        // Validations
        if (!nom || !email || !password || !confirmPassword) {
            Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        if (!email.includes('@')) {
            Alert.alert('Erreur', 'Veuillez entrer un email valide.');
            return;
        }

        setIsLoading(true);
        console.log('🔐 Tentative d\'inscription:', { email, nom, type });

        const { data, error } = await signUp(email, password, nom, '', type);

        setIsLoading(false);
        console.log('Résultat inscription:', { data, error });

        if (error) {
            // Messages d'erreur en français
            let message = error.message;
            if (message.includes('already registered')) {
                message = 'Cet email est déjà utilisé.';
            } else if (message.includes('invalid email')) {
                message = 'Format d\'email invalide.';
            } else if (message.includes('password')) {
                message = 'Mot de passe trop court (minimum 6 caractères).';
            }
            Alert.alert('Erreur d\'inscription', message);
        } else if (data?.user) {
            Alert.alert(
                'Inscription réussie ! ✅',
                'Votre compte a été créé. Vérifiez votre email pour le confirmer, puis vous pourrez vous connecter.',
                [{ text: 'OK', onPress: () => {
                    // Effacer les champs
                    setNom('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    navigation.navigate('Login');
                }}]
            );
        }
    };

    // Les 4 rôles disponibles
    const roles = [
        { value: 'citoyen', label: '👤 Citoyen' },
        { value: 'collecteur', label: '🚛 Collecteur' },
        { value: 'partenaire', label: '🏢 Partenaire' },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <Text style={styles.title}>🌊 CleanWave</Text>
                    <Text style={styles.subtitle}>Créer un compte</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nom complet"
                        placeholderTextColor={COLORS.textLight}
                        value={nom}
                        onChangeText={setNom}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Adresse email"
                        placeholderTextColor={COLORS.textLight}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe (min. 6 caractères)"
                        placeholderTextColor={COLORS.textLight}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor={COLORS.textLight}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    {/* Sélection du rôle */}
                    <Text style={styles.roleLabel}>Je suis un(e) :</Text>
                    <View style={styles.rolesRow}>
                        {roles.map((role) => (
                            <TouchableOpacity
                                key={role.value}
                                style={[
                                    styles.roleBtn,
                                    type === role.value && styles.roleBtnActive
                                ]}
                                onPress={() => setType(role.value)}
                            >
                                <Text style={[
                                    styles.roleBtnText,
                                    type === role.value && styles.roleBtnTextActive
                                ]}>
                                    {role.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.buttonText}>Créer mon compte</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>
                            Déjà un compte ? Se connecter
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: SPACING.xl,
    },
    content: {
        paddingHorizontal: SPACING.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: 14,
        marginBottom: SPACING.sm,
        fontSize: 15,
        color: COLORS.textDark,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    roleLabel: {
        fontSize: 14,
        color: COLORS.textMedium,
        fontWeight: '600',
        marginTop: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    rolesRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    roleBtn: {
        flex: 1,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    roleBtnActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#E8F5E9',
    },
    roleBtnText: {
        fontSize: 11,
        color: COLORS.textLight,
        fontWeight: '500',
        textAlign: 'center',
    },
    roleBtnTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.md,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: SPACING.sm,
        marginBottom: SPACING.md,
    },
    buttonDisabled: {
        backgroundColor: '#A5D6A7',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        textAlign: 'center',
        color: COLORS.primary,
        fontSize: 14,
        paddingVertical: SPACING.sm,
    },
});