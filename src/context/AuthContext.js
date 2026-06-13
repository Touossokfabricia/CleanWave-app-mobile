// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // useRef garde une valeur sans déclencher de re-rendu
    // On l'utilise pour savoir si initSession est terminée
    // Tant qu'elle n'est pas terminée, onAuthStateChange
    // ne doit PAS modifier loading
    const initDone = useRef(false);
    const isSigningOut = useRef(false);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.log('fetchProfile erreur:', error.message);
                return null;
            }
            return data;
        } catch (e) {
            console.log('fetchProfile exception:', e);
            return null;
        }
    };

    useEffect(() => {
        // ============================================================
        // ÉTAPE 1 : Écouter les changements d'auth EN PREMIER
        // C'est important : on installe le listener AVANT initSession
        // pour ne rater aucun événement
        // ============================================================
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);

                // TOKEN_REFRESHED = Supabase renouvelle le token en arrière-plan
                // Ce n'est PAS une vraie connexion/déconnexion → on l'ignore
                if (event === 'TOKEN_REFRESHED') {
                    console.log('Token rafraîchi, on ignore cet événement');
                    return; // ← CORRECTION CLÉ : ne rien faire pour cet event
                }

                // SIGNED_OUT = déconnexion réelle
                if (event === 'SIGNED_OUT') {
                    console.log('Déconnexion confirmée par Supabase');
                    setUser(null);
                    setProfile(null);
                    // On remet loading à false au cas où
                    setLoading(false);
                    return;
                }

                // SIGNED_IN ou INITIAL_SESSION = connexion
                if (session?.user) {
                    setUser(session.user);
                    const profileData = await fetchProfile(session.user.id);
                    setProfile(profileData);

                    // Ne touche loading que si initSession est déjà terminée
                    if (initDone.current) {
                        setLoading(false);
                    }
                }
            }
        );

        // ============================================================
        // ÉTAPE 2 : Vérification initiale de session
        // ============================================================
        const initSession = async () => {
            console.log('🔐 [AuthContext] Starting initSession...');
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.log('getSession erreur:', error.message);
                    return;
                }

                if (session?.user) {
                    setUser(session.user);
                    const profileData = await fetchProfile(session.user.id);
                    setProfile(profileData);
                }
            } catch (e) {
                console.log('initSession exception:', e);
            } finally {
                // finally s'exécute TOUJOURS, même en cas d'erreur
                initDone.current = true; // marque initSession comme terminée
                setLoading(false);       // TOUJOURS remettre loading à false ici
                console.log('✅ initSession terminée');
            }
        };

        initSession();

        return () => subscription.unsubscribe();
    }, []);

    // ============================================================
    // INSCRIPTION
    // ============================================================
    const signUp = async (email, password, nom, prenom = '', type = 'citoyen') => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { nom, prenom, type } }
            });

            if (error) return { data: null, error };

            // Sécurité : si le trigger n'a pas créé le profil, on le crée
            if (data?.user) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const { data: existing } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', data.user.id)
                    .single();

                if (!existing) {
                    await supabase.from('profiles').insert({
                        id: data.user.id,
                        nom, prenom, email, type,
                    });
                }
            }

            return { data, error: null };
        } catch (e) {
            return { data: null, error: e };
        }
    };

    // ============================================================
    // CONNEXION
    // ============================================================
    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email, password
            });
            return { data, error };
        } catch (e) {
            return { data: null, error: e };
        }
    };

    // ============================================================
    // DÉCONNEXION — version robuste
    // ============================================================
    const signOut = async () => {
        // Empêche les appels multiples si on clique plusieurs fois
        if (isSigningOut.current) return;
        isSigningOut.current = true;

        console.log('🚪 Déconnexion en cours...');

        try {
            // On vide l'état LOCAL immédiatement
            // Ainsi RootNavigator redirige vers HomeScreen tout de suite
            // AVANT même que Supabase réponde
            setUser(null);
            setProfile(null);

            // Ensuite on demande à Supabase de terminer la session
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.log('signOut erreur (non bloquante):', error.message);
                // Pas grave : l'état local est déjà nettoyé
            } else {
                console.log('✅ Déconnexion Supabase confirmée');
            }
        } catch (e) {
            console.log('signOut exception:', e);
            // L'état local est déjà nettoyé, pas de problème
        } finally {
            isSigningOut.current = false;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            signUp,
            signIn,
            signOut,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);