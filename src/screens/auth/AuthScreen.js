// ============================================================
// src/screens/auth/AuthScreen.js
//
// Écran d'authentification combinant Connexion ET Inscription
// dans un seul écran avec ANIMATION FLUIDE entre les deux.
//
// COMMENT FONCTIONNE L'ANIMATION :
// On utilise l'Animated API de React Native (intégrée, pas besoin
// de librairie externe). On a deux "valeurs animées" :
//   - tabIndicator : fait glisser la ligne verte sous l'onglet actif
//   - formSlide : fait glisser le formulaire gauche/droite
//   - formOpacity : fait apparaître/disparaître le formulaire en fondu
//
// L'animation "spring" donne un effet de rebond naturel très élégant.
// ============================================================

import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

// ============================================================
// COMPOSANT : TabIndicator
// La ligne verte qui glisse sous l'onglet actif
// ============================================================
function TabIndicator({ animation }) {
    // interpolate traduit une valeur de 0 à 1 en position en pixels
    // 0 = onglet Connexion (à gauche), 1 = onglet Inscription (à droite)
    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width / 2 - SPACING.lg * 2],
        // La ligne glisse de sa position gauche à sa position droite
    });

    return (
        <Animated.View
            style={[
                styles.tabIndicator,
                { transform: [{ translateX }] },
            ]}
        />
    );
}

// ============================================================
// COMPOSANT : InputField
// Champ de saisie stylisé et réutilisable
// ============================================================
function InputField({ placeholder, secureTextEntry = false, value, onChangeText, keyboardType = 'default' }) {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.inputPlaceholder}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize="none"
        />
    );
}

// ============================================================
// COMPOSANT : GoogleButton
// Bouton "Se connecter avec Google" (même design dans les 2 onglets)
// ============================================================
function GoogleButton({ label, onPress }) {
    return (
        <TouchableOpacity style={styles.googleBtn} onPress={onPress} activeOpacity={0.85}>
            <Text style={styles.googleBtnText}>{label}</Text>
            {/* Logo Google en emoji simplifié */}
            <Text style={styles.googleIcon}>G</Text>
        </TouchableOpacity>
    );
}

// ============================================================
// COMPOSANT PRINCIPAL : AuthScreen
// ============================================================
export default function AuthScreen({ navigation }) {
    // 0 = onglet Connexion actif, 1 = onglet Inscription actif
    const [activeTab, setActiveTab] = useState(0);

    // États pour les champs de connexion
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // États pour les champs d'inscription
    const [registerNom, setRegisterNom] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirm, setRegisterConfirm] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    // 🔐 RÉCUPÉRER LES FONCTIONS SUPABASE
    const { signUp, signIn } = useAuth();

    // useRef conserve la valeur animée entre les rendus
    // sans déclencher un re-rendu à chaque changement
    const tabAnimation = useRef(new Animated.Value(0)).current;
    // Animated.Value(0) = commence sur l'onglet Connexion (index 0)

    const formAnimation = useRef(new Animated.Value(0)).current;

    // ============================================================
    // FONCTION : switchTab
    // Appelée quand l'utilisateur clique sur un onglet.
    // Lance les animations en parallèle.
    // ============================================================
    const switchTab = useCallback((tabIndex) => {
        setActiveTab(tabIndex);

        // Animated.parallel lance plusieurs animations EN MÊME TEMPS
        Animated.parallel([
            // Animation 1 : la ligne glisse sous le bon onglet
            Animated.spring(tabAnimation, {
                toValue: tabIndex,      // 0 = gauche, 1 = droite
                tension: 80,            // rigidité du ressort (plus élevé = plus rapide)
                friction: 10,           // amortissement (plus élevé = moins de rebond)
                useNativeDriver: true,  // IMPORTANT : utilise le thread natif pour la fluidité
            }),

            // Animation 2 : le formulaire glisse horizontalement
            Animated.spring(formAnimation, {
                toValue: tabIndex,
                tension: 60,
                friction: 12,
                useNativeDriver: true,
            }),
        ]).start(); // .start() lance les animations
    }, [tabAnimation, formAnimation]);

    // Calcul de la translation du formulaire
    // quand tabIndex = 0 : translateX = 0 (formulaire connexion visible)
    // quand tabIndex = 1 : translateX = -width (glisse pour montrer inscription)
    const formTranslateX = formAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -width],
    });

    // ============================================================
    // HANDLERS - UTILISER LES VRAIES FONCTIONS SUPABASE! ✅
    // ============================================================
    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
            return;
        }
        setIsLoading(true);
        console.log('🔐 Tentative de connexion:', { email: loginEmail });
        
        const { data, error } = await signIn(loginEmail, loginPassword);
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
            Alert.alert('Succès', 'Vous êtes connecté! 🎉');
            // Navigation auto via RootNavigator quand user devient non-null
        }
    };

    const handleRegister = async () => {
        if (!registerNom || !registerEmail || !registerPassword || !registerConfirm) {
            Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
            return;
        }
        if (registerPassword !== registerConfirm) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }
        if (registerPassword.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setIsLoading(true);
        console.log('🔐 Tentative d\'inscription:', { email: registerEmail, nom: registerNom });
        
        const { data, error } = await signUp(registerEmail, registerPassword, registerNom, '', 'citoyen');
        setIsLoading(false);

        if (error) {
            console.error('❌ Erreur inscription:', error.message);
            let message = error.message;
            if (message.includes('already registered')) {
                message = 'Cet email est déjà utilisé.';
            } else if (message.includes('invalid email')) {
                message = 'Format d\'email invalide.';
            }
            Alert.alert('Erreur d\'inscription', message);
        } else if (data?.user) {
            console.log('✅ Inscription réussie!');
            Alert.alert(
                'Inscription réussie! ✅',
                'Votre compte a été créé. Vérifiez votre email pour le confirmer, puis vous pourrez vous connecter.',
                [{ text: 'OK', onPress: () => {
                    setRegisterNom('');
                    setRegisterEmail('');
                    setRegisterPassword('');
                    setRegisterConfirm('');
                    switchTab(0); // Retour à la connexion
                }}]
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.root}
            // Sur iOS, le clavier pousse le contenu vers le haut
            // Sur Android, le comportement est différent
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            // keyboardShouldPersistTaps = le clavier ne se ferme pas
            // si on appuie sur quelque chose d'autre
            >

                {/* Logo au sommet */}
                <View style={styles.logoHeader}>
                    <Text style={styles.logoWhite}>Clean</Text>
                    <Text style={styles.logoGreen}>Wave</Text>
                </View>

                {/* Carte principale des formulaires */}
                <View style={styles.card}>

                    {/* ---- ONGLETS ---- */}
                    <View style={styles.tabsRow}>
                        {/* Onglet Connexion */}
                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => switchTab(0)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === 0 && styles.tabTextActive
                                // Si onglet actif, on applique le style actif EN PLUS
                            ]}>
                                Connexion
                            </Text>
                        </TouchableOpacity>

                        {/* Onglet Inscription */}
                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => switchTab(1)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === 1 && styles.tabTextActive
                            ]}>
                                Inscription
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Ligne de séparation avec indicateur animé */}
                    <View style={styles.tabDivider}>
                        <TabIndicator animation={tabAnimation} />
                    </View>

                    {/* ---- FORMULAIRES ANIMÉS ---- */}
                    {/*
            Le conteneur a une largeur de 2 * width pour contenir
            les deux formulaires côte à côte.
            L'animation de translation fait défiler entre les deux.
          */}
                    <View style={styles.formsContainer}>
                        <Animated.View
                            style={[
                                styles.formsSlider,
                                { transform: [{ translateX: formTranslateX }] }
                            ]}
                        >

                            {/* ---- FORMULAIRE CONNEXION (index 0) ---- */}
                            <View style={styles.formPanel}>

                                {/* Titre Google */}
                                <Text style={styles.googleTitle}>CONNECTEZ-VOUS AVEC GOOGLE</Text>
                                <GoogleButton
                                    label="Se connecter avec Google"
                                    onPress={() => Alert.alert('Google', 'Connexion Google bientôt disponible')}
                                />

                                {/* Séparateur OU */}
                                <View style={styles.dividerRow}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>OU</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                {/* Champs email et mot de passe */}
                                <InputField
                                    placeholder="E-MAIL"
                                    keyboardType="email-address"
                                    value={loginEmail}
                                    onChangeText={setLoginEmail}
                                />
                                <InputField
                                    placeholder="MOT DE PASSE"
                                    secureTextEntry
                                    value={loginPassword}
                                    onChangeText={setLoginPassword}
                                />

                                {/* Liens bas de formulaire */}
                                <View style={styles.loginBottom}>
                                    <TouchableOpacity>
                                        <Text style={styles.forgotText}>Mot de passe oublié?</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.loginBtn}
                                        onPress={handleLogin}
                                        disabled={isLoading}
                                        activeOpacity={0.85}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size="small" color={COLORS.textDark} />
                                        ) : (
                                            <Text style={styles.loginBtnText}>SE CONNECTER</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>

                            </View>

                            {/* ---- FORMULAIRE INSCRIPTION (index 1) ---- */}
                            <View style={styles.formPanel}>

                                <GoogleButton
                                    label="S'inscrire avec Google"
                                    onPress={() => Alert.alert('Google', 'Inscription Google bientôt disponible')}
                                />

                                {/* Séparateur OU */}
                                <View style={styles.dividerRow}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>OU</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                {/* Champs d'inscription */}
                                <InputField
                                    placeholder="NOM"
                                    value={registerNom}
                                    onChangeText={setRegisterNom}
                                />
                                <InputField
                                    placeholder="E-MAIL"
                                    keyboardType="email-address"
                                    value={registerEmail}
                                    onChangeText={setRegisterEmail}
                                />
                                <InputField
                                    placeholder="MOT DE PASSE"
                                    secureTextEntry
                                    value={registerPassword}
                                    onChangeText={setRegisterPassword}
                                />
                                <InputField
                                    placeholder="CONFIRMATION DU MOT DE PASSE"
                                    secureTextEntry
                                    value={registerConfirm}
                                    onChangeText={setRegisterConfirm}
                                />

                                {/* Bouton S'inscrire */}
                                <TouchableOpacity
                                    style={styles.registerBtn}
                                    onPress={handleRegister}
                                    disabled={isLoading}
                                    activeOpacity={0.85}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.registerBtnText}>S'inscrire</Text>
                                    )}
                                </TouchableOpacity>

                            </View>

                        </Animated.View>
                    </View>

                </View>

                {/* Lien retour accueil */}
                <TouchableOpacity
                    style={styles.backHome}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backHomeText}>← Retour à l'accueil</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// ============================================================
// STYLES
// ============================================================
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
        paddingTop: SPACING.xxl,
    },

    // Logo
    logoHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    logoWhite: {
        fontSize: FONTS.xxl,
        fontWeight: FONTS.extraBold,
        color: COLORS.primary,
    },
    logoGreen: {
        fontSize: FONTS.xxl,
        fontWeight: FONTS.extraBold,
        color: COLORS.accent,
    },

    // Carte blanche
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        overflow: 'hidden', // important pour que l'animation ne déborde pas
        ...SHADOWS.card,
    },

    // --- ONGLETS ---
    tabsRow: {
        flexDirection: 'row',
        paddingTop: SPACING.xl,
        paddingHorizontal: SPACING.lg,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: SPACING.sm,
    },
    tabText: {
        fontSize: FONTS.lg,
        fontWeight: FONTS.medium,
        color: COLORS.textLight,
    },
    tabTextActive: {
        color: COLORS.textDark,
        fontWeight: FONTS.bold,
        // Soulignement manuel (textDecorationLine ne fonctionne pas bien sur Android)
    },

    // Ligne avec indicateur animé
    tabDivider: {
        height: 2,
        backgroundColor: COLORS.inputBorder,
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
        position: 'relative',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        // La largeur est calculée pour couvrir un onglet
        width: width / 2 - SPACING.lg * 2,
        height: 2,
        backgroundColor: COLORS.primary,
        borderRadius: 1,
    },

    // --- FORMULAIRES ---
    formsContainer: {
        overflow: 'hidden', // cache le formulaire qui est hors champ
        // La hauteur s'adapte automatiquement au formulaire le plus grand
    },
    formsSlider: {
        flexDirection: 'row', // les deux formulaires côte à côte
        width: width * 2,     // assez large pour contenir les deux formulaires
    },
    formPanel: {
        width: width - SPACING.lg * 2, // largeur d'un formulaire = largeur écran - marges de la carte
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
    },

    // Titre Google
    googleTitle: {
        fontSize: FONTS.sm,
        fontWeight: FONTS.bold,
        color: COLORS.primary,
        textAlign: 'center',
        letterSpacing: 0.5,
        marginBottom: SPACING.md,
    },

    // Bouton Google
    googleBtn: {
        backgroundColor: COLORS.accentBright,
        borderRadius: RADIUS.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
        marginBottom: SPACING.md,
        ...SHADOWS.button,
    },
    googleBtnText: {
        color: COLORS.white,
        fontWeight: FONTS.bold,
        fontSize: FONTS.md,
    },
    googleIcon: {
        fontSize: FONTS.xl,
        fontWeight: FONTS.extraBold,
        color: COLORS.white,
        backgroundColor: COLORS.white,
        color: '#EA4335', // rouge Google
        width: 24,
        height: 24,
        textAlign: 'center',
        lineHeight: 24,
        borderRadius: 12,
        overflow: 'hidden',
        fontWeight: FONTS.extraBold,
    },

    // Séparateur OU
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.md,
        gap: SPACING.sm,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.inputBorder,
    },
    dividerText: {
        fontSize: FONTS.sm,
        color: COLORS.textLight,
        fontWeight: FONTS.medium,
    },

    // Champ de saisie
    input: {
        backgroundColor: COLORS.inputBackground,
        borderRadius: RADIUS.xl,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        fontSize: FONTS.sm,
        color: COLORS.textDark,
        marginBottom: SPACING.sm,
        letterSpacing: 0.5,
    },

    // Bas formulaire connexion
    loginBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    forgotText: {
        fontSize: FONTS.sm,
        color: COLORS.textDark,
        fontWeight: FONTS.medium,
        textDecorationLine: 'underline',
    },
    loginBtn: {
        borderWidth: 1.5,
        borderColor: COLORS.textDark,
        borderRadius: RADIUS.sm,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        minWidth: 100,
        alignItems: 'center',
    },
    loginBtnText: {
        fontSize: FONTS.xs,
        fontWeight: FONTS.bold,
        color: COLORS.textDark,
        letterSpacing: 1,
    },

    // Bouton S'inscrire
    registerBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.xl,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
        ...SHADOWS.button,
    },
    registerBtnText: {
        color: COLORS.white,
        fontWeight: FONTS.bold,
        fontSize: FONTS.md,
        letterSpacing: 0.5,
    },

    // Retour accueil
    backHome: {
        alignItems: 'center',
        marginTop: SPACING.lg,
        paddingVertical: SPACING.sm,
    },
    backHomeText: {
        color: COLORS.primary,
        fontSize: FONTS.sm,
        fontWeight: FONTS.medium,
    },
});