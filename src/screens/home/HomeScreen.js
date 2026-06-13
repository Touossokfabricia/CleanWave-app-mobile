// ============================================================
// src/screens/home/HomeScreen.js
//
// L'écran d'accueil complet de CleanWave.
// Il est composé de plusieurs SECTIONS défilables :
// 1. Hero (image de fond avec titre)
// 2. Fonctionnalités (4 cartes en grille)
// 3. Statistiques (fond vert foncé)
// 4. Contact (carte verte)
// 5. Témoignages (défilement horizontal)
// 6. Footer
//
// ScrollView permet de tout faire défiler verticalement.
// ============================================================

import React, { useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Dimensions,
    StatusBar,
    Platform,
} from 'react-native';

import SectionTitle from '../../components/SectionTitle';
import FeatureCard from '../../components/FeatureCard';
import StatItem from '../../components/StatItem';
import TestimonialCard from '../../components/TestimonialCard';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

// Données des fonctionnalités (extraites de l'image)
const FEATURES = [
    {
        icon: '♻️',
        title: 'Signaler des dépôts d\'ordures sauvages',
        description: 'Les citoyens peuvent effectuer des signalements via géolocalisation...',
    },
    {
        icon: '🏅',
        title: 'Gamification et récompenses',
        description: 'Système de points, badges ou classements pour motiver la participation...',
    },
    {
        icon: '🚛',
        title: 'Publication du planning de passage des camions poubelle',
        description: 'Consultez les horaires de collecte dans votre quartier...',
    },
    {
        icon: '📢',
        title: 'Sensibilisation et éducation',
        description: 'Conseils écologiques, guides pratiques pour réduire et trier les déchets au quotidien...',
    },
];

// Données des statistiques
const STATS = [
    { icon: '🌍', value: '300Kg', label: 'CO₂ évités' },
    { icon: '👥', value: '520', label: 'Utilisateurs' },
    { icon: '🗑️', value: '300+', label: 'Signalements' },
    { icon: '🚚', value: '520', label: 'Tournée de collecte' },
];

// Données des témoignages
const TESTIMONIALS = [
    {
        name: 'Jean-Pierre',
        city: 'Douala',
        text: 'Depuis que j\'utilise CleanWave, je sais exactement où et quand déposer mes déchets triés. C\'est simple, clair et ça me motive à participer à la propreté de mon pays!...',
        avatar: 'https://i.pravatar.cc/100?img=11',
    },
    {
        name: 'Cristelle',
        city: 'Yaoundé',
        text: 'Depuis que j\'utilise CleanWave, je sais exactement où et quand déposer mes déchets triés. C\'est simple, clair et ça me motive à participer à la propreté de mon pays!...',
        avatar: 'https://i.pravatar.cc/100?img=47',
    },
    {
        name: 'Alain',
        city: 'Bafoussam',
        text: 'Une application révolutionnaire pour notre environnement. Je recommande à tous les citoyens camerounais!',
        avatar: 'https://i.pravatar.cc/100?img=32',
    },
];

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.root}>
            {/* StatusBar transparente pour que le hero passe derrière */}
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                // bounces permet le rebond sur iOS (désactivé pour rester propre)
                bounces={false}
            >

                {/* ================================================
            SECTION 1 : HERO
            Image de fond avec titre et slogan
        ================================================ */}
                <ImageBackground
                    // On utilise une image de camion poubelle similaire à ton design
                    // En production tu mettras : source={require('../../assets/hero.jpg')}
                    source={{ uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' }}
                    style={styles.hero}
                    imageStyle={styles.heroImage}
                >
                    {/* Overlay sombre pour que le texte soit lisible */}
                    <View style={styles.heroOverlay} />

                    {/* Contenu du hero */}
                    <View style={styles.heroContent}>
                        {/* Logo/Titre */}
                        <View style={styles.logoRow}>
                            <Text style={styles.logoWhite}>Clean</Text>
                            <Text style={styles.logoGreen}>Wave</Text>
                        </View>

                        {/* Slogan */}
                        <Text style={styles.heroSlogan}>
                            Rejoignez la vague du changement avec CleanWave, pour une gestion optimisée des déchets et un Cameroun plus propre !
                        </Text>

                        {/* Bouton CTA */}
                        <TouchableOpacity
                            style={styles.heroCTA}
                            onPress={() => navigation.navigate('Auth')}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.heroCTAText}>SE CONNECTER</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>


                {/* ================================================
            SECTION 2 : NOS FONCTIONNALITES
            4 cartes en grille 2x2
        ================================================ */}
                <View style={styles.section}>
                    <SectionTitle title="Nos Fonctionnalités" />

                    {/* Grille 2 colonnes avec flexWrap */}
                    <View style={styles.featuresGrid}>
                        {FEATURES.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </View>
                </View>


                {/* ================================================
            SECTION 3 : NOS STATISTIQUES
            Fond vert foncé avec 4 stats en ligne
        ================================================ */}
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600' }}
                    style={styles.statsSection}
                >
                    {/* Overlay vert foncé semi-transparent */}
                    <View style={styles.statsOverlay} />

                    <View style={styles.statsContent}>
                        <SectionTitle title="Nos Statistiques" light />

                        <Text style={styles.statsSubtitle}>
                            IMPACT DE NOTRE APPLICATION EN TEMPS RÉEL
                        </Text>

                        {/* Ligne de stats */}
                        <View style={styles.statsRow}>
                            {STATS.map((stat, index) => (
                                <StatItem
                                    key={index}
                                    icon={stat.icon}
                                    value={stat.value}
                                    label={stat.label}
                                />
                            ))}
                        </View>
                    </View>
                </ImageBackground>


                {/* ================================================
            SECTION 4 : CONTACTER-NOUS
            Carte verte avec email et téléphone
        ================================================ */}
                <View style={styles.contactSection}>
                    <View style={styles.contactCard}>
                        {/* Icône recyclage */}
                        <Text style={styles.contactIcon}>♻️</Text>

                        <Text style={styles.contactTitle}>CONTACTER-NOUS</Text>
                        <Text style={styles.contactSlogan}>
                            Ensemble, construisons un Cameroun plus propre. Dès aujourd'hui!
                        </Text>

                        {/* Input email avec bouton envoi */}
                        <View style={styles.contactInputRow}>
                            <TextInput
                                style={styles.contactInput}
                                placeholder="entrez votre courriel..."
                                placeholderTextColor="rgba(255,255,255,0.7)"
                            />
                            <TouchableOpacity style={styles.contactSendBtn}>
                                <Text style={styles.contactSendIcon}>➤</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Coordonnées */}
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactInfoText}>📞  +237 6 69 56 76 09</Text>
                            <Text style={styles.contactInfoText}>     +237 6 10 56 64 09</Text>
                        </View>

                        {/* Email à droite */}
                        <Text style={styles.contactEmail}>✉️  CleanWave@gmail.com</Text>
                    </View>
                </View>


                {/* ================================================
            SECTION 5 : TEMOIGNAGES
            Défilement horizontal des cartes
        ================================================ */}
                <View style={styles.section}>
                    <SectionTitle title="Témoignages" />

                    {/* horizontal={true} = défilement gauche-droite */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.testimonialsScroll}
                    >
                        {TESTIMONIALS.map((t, index) => (
                            <TestimonialCard
                                key={index}
                                name={t.name}
                                city={t.city}
                                text={t.text}
                                avatar={t.avatar}
                            />
                        ))}
                    </ScrollView>
                </View>


                {/* ================================================
            SECTION 6 : FOOTER
        ================================================ */}
                <View style={styles.footer}>
                    <View style={styles.footerTop}>
                        {/* Logo gauche */}
                        <View>
                            <View style={styles.footerLogo}>
                                <Text style={styles.footerLogoText}>🌊 </Text>
                                <Text style={styles.footerLogoWhite}>Clean</Text>
                                <Text style={styles.footerLogoGreen}>Wave</Text>
                            </View>
                            <Text style={styles.footerTagline}>L'intelligence collective{'\n'}au service de la planète</Text>
                        </View>

                        {/* Formulaire rapide inscription */}
                        <View style={styles.footerForm}>
                            <Text style={styles.footerFormTitle}>INSCRIVEZ-VOUS</Text>
                            <TextInput
                                style={styles.footerInput}
                                placeholder="NOM"
                                placeholderTextColor="#999"
                            />
                            <TextInput
                                style={styles.footerInput}
                                placeholder="MOT DE PASSE"
                                placeholderTextColor="#999"
                                secureTextEntry
                            />
                            <TouchableOpacity
                                style={styles.footerBtn}
                                onPress={() => navigation.navigate('Auth')}
                            >
                                <Text style={styles.footerBtnText}>S'inscrire</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Réseaux sociaux */}
                    <View style={styles.footerSocial}>
                        <Text style={styles.footerSocialIcon}>f</Text>
                        <Text style={styles.footerSocialIcon}>📱</Text>
                        <Text style={styles.footerSocialIcon}>✕</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

// ============================================================
// STYLES
// Organisés dans le même ordre que les sections
// ============================================================
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    scroll: {
        flex: 1,
    },

    // --- HERO ---
    hero: {
        width: '100%',
        height: 300,
        justifyContent: 'flex-end',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
    },
    heroImage: {
        resizeMode: 'cover',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject, // couvre toute la surface du parent
        backgroundColor: COLORS.overlay,
    },
    heroContent: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    logoRow: {
        flexDirection: 'row',
        marginBottom: SPACING.sm,
    },
    logoWhite: {
        fontSize: FONTS.xxxl,
        fontWeight: FONTS.extraBold,
        color: COLORS.white,
    },
    logoGreen: {
        fontSize: FONTS.xxxl,
        fontWeight: FONTS.extraBold,
        color: COLORS.accentBright,
    },
    heroSlogan: {
        color: COLORS.white,
        fontSize: FONTS.md,
        lineHeight: 22,
        marginBottom: SPACING.lg,
        opacity: 0.95,
    },
    heroCTA: {
        alignSelf: 'flex-end',
        borderWidth: 1.5,
        borderColor: COLORS.white,
        borderRadius: RADIUS.sm,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
    },
    heroCTAText: {
        color: COLORS.white,
        fontWeight: FONTS.semiBold,
        fontSize: FONTS.sm,
        letterSpacing: 1,
    },

    // --- FONCTIONNALITES ---
    section: {
        padding: SPACING.lg,
        paddingTop: SPACING.xl,
        backgroundColor: COLORS.white,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap', // retour à la ligne automatique
        justifyContent: 'space-between',
    },

    // --- STATISTIQUES ---
    statsSection: {
        width: '100%',
        minHeight: 250,
    },
    statsOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 60, 20, 0.82)',
    },
    statsContent: {
        padding: SPACING.xl,
        paddingVertical: SPACING.xxl,
        alignItems: 'center',
    },
    statsSubtitle: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: FONTS.xs,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: SPACING.xl,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },

    // --- CONTACT ---
    contactSection: {
        padding: SPACING.md,
        backgroundColor: COLORS.backgroundGray,
        paddingVertical: SPACING.xl,
    },
    contactCard: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: RADIUS.lg,
        padding: SPACING.xl,
        alignItems: 'center',
        ...SHADOWS.card,
    },
    contactIcon: {
        fontSize: 40,
        marginBottom: SPACING.sm,
    },
    contactTitle: {
        fontSize: FONTS.lg,
        fontWeight: FONTS.bold,
        color: COLORS.white,
        letterSpacing: 1.5,
        marginBottom: SPACING.sm,
    },
    contactSlogan: {
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        fontSize: FONTS.sm,
        marginBottom: SPACING.lg,
        lineHeight: 20,
    },
    contactInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        width: '100%',
    },
    contactInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.5)',
        color: COLORS.white,
        paddingVertical: SPACING.sm,
        fontSize: FONTS.sm,
        marginRight: SPACING.sm,
    },
    contactSendBtn: {
        padding: SPACING.sm,
    },
    contactSendIcon: {
        color: COLORS.white,
        fontSize: FONTS.xl,
    },
    contactInfo: {
        alignSelf: 'flex-start',
        marginBottom: SPACING.sm,
    },
    contactInfoText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: FONTS.sm,
        marginBottom: 2,
    },
    contactEmail: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: FONTS.sm,
        alignSelf: 'flex-end',
    },

    // --- TEMOIGNAGES ---
    testimonialsScroll: {
        paddingRight: SPACING.lg,
    },

    // --- FOOTER ---
    footer: {
        backgroundColor: COLORS.primary,
        padding: SPACING.lg,
        paddingTop: SPACING.xl,
    },
    footerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    footerLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    footerLogoText: {
        fontSize: FONTS.xl,
    },
    footerLogoWhite: {
        fontSize: FONTS.xl,
        fontWeight: FONTS.bold,
        color: COLORS.white,
    },
    footerLogoGreen: {
        fontSize: FONTS.xl,
        fontWeight: FONTS.bold,
        color: COLORS.accentBright,
    },
    footerTagline: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: FONTS.xs,
        lineHeight: 17,
        maxWidth: 140,
    },
    footerForm: {
        width: 140,
    },
    footerFormTitle: {
        color: COLORS.white,
        fontWeight: FONTS.bold,
        fontSize: FONTS.xs,
        letterSpacing: 1,
        marginBottom: SPACING.sm,
    },
    footerInput: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.sm,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs + 2,
        fontSize: FONTS.xs,
        marginBottom: SPACING.xs,
    },
    footerBtn: {
        backgroundColor: COLORS.accent,
        borderRadius: RADIUS.sm,
        padding: SPACING.sm,
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    footerBtnText: {
        color: COLORS.white,
        fontWeight: FONTS.bold,
        fontSize: FONTS.xs,
    },
    footerSocial: {
        flexDirection: 'row',
        gap: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    footerSocialIcon: {
        fontSize: FONTS.lg,
        color: COLORS.white,
    },
});