import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setIsLoading(true);
        console.log('🔐 Tentative de connexion:', { email });
        
        const { data, error } = await signIn(email, password);
        setIsLoading(false);

        if (error) {
            console.error('❌ Erreur connexion:', error.message);
            let message = error.message;
            if (message.includes('Email not confirmed')) {
                message = 'Veuillez confirmer votre email.';
            } else if (message.includes('Invalid')) {
                message = 'Email ou mot de passe incorrect.';
            }
            Alert.alert('Erreur de connexion', message);
        } else if (data?.user) {
            console.log('✅ Connexion réussie!');
            // Navigation auto via RootNavigator quand user devient non-null
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <Text style={styles.title}>CleanWave</Text>
                <Text style={styles.subtitle}>Connexion</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={COLORS.textLight}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor={COLORS.textLight}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.buttonText}>Se connecter</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Pas encore inscrit? S'inscrire</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.textLight,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        marginVertical: SPACING.md,
        fontSize: 16,
        color: COLORS.textDark,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.md,
        paddingVertical: SPACING.lg,
        marginVertical: SPACING.lg,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        textAlign: 'center',
        color: COLORS.primary,
        marginTop: SPACING.md,
        fontSize: 14,
    },
});
