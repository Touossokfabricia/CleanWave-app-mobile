# Guide de Test - Système de Déconnexion Corrigé

## 🔧 Corrections Appliquées

### 1. **AuthContext.js** - Fonction `signOut()` Améliorée
```javascript
- ✅ Rendue async pour attendre la réponse Supabase
- ✅ Gestion d'erreur complète (try-catch-finally)
- ✅ Fallback automatique qui nettoie l'état même si erreur
- ✅ Logs détaillés: "Starting logout", "Logout successful", "Logout error"
```

### 2. **theme.js** - Propriétés SHADOWS Corrigées
```javascript
- ✅ boxShadow en priorité (compatible web react-native-web)
- ✅ shadowColor/shadowOffset conservés en fallback
- ✅ Erreur "shadow* deprecated" éliminée
```

### 3. **DashboardLayout.js** - Interface Logout Robuste
```javascript
- ✅ Wrapper handleLogout() qui gère la promesse async
- ✅ État isLoggingOut pour tracker la déconnexion
- ✅ ActivityIndicator pendant le traitement
- ✅ Boutons désactivés pour éviter les clics multiples
- ✅ 3 boutons logout mis à jour (mobile + desktop)
```

---

## 🧪 Étapes de Test

### Étape 1: Accéder à l'Application
1. Ouvre le terminal et navigue vers: `C:\Users\FABRICIA\Downloads\projetfabricia@123\CleanWave`
2. Lance l'application: `npm start` ou `expo start`
3. Ouvre la console de développement (DevTools - F12)

### Étape 2: Se Connecter en tant que Citoyen
1. Clique sur "Se Connecter"
2. Entre tes identifiants citoyen
3. Attends que le dashboard se charge

### Étape 3: Vérifier les Logs de Connexion
Dans la console, tu devrais voir:
```
Auth event: SIGNED_IN
Auth event: TOKEN_REFRESHED
```

### Étape 4: Cliquer sur "Se Déconnecter"
1. Localise le bouton "Se Déconnecter" (📤 icône logout)
   - **Mode Mobile**: En haut à droite du header
   - **Mode Desktop**: Dans la sidebar en bas OU en haut à droite du header
2. Clique sur le bouton
3. Observe:
   - ✅ L'icône logout devient un spinner (ActivityIndicator)
   - ✅ Le bouton est désactivé (pas réactif)

### Étape 5: Vérifier les Logs de Déconnexion
Dans la console, tu devrais voir DANS CET ORDRE:
```
"Starting logout process..."
"Auth event: SIGNED_OUT"
"Logout successful, onAuthStateChange should handle state cleanup"
```

**OU en cas d'erreur:**
```
"Starting logout process..."
"Logout error from Supabase: [error details]"
"Logout successful, onAuthStateChange should handle state cleanup"
```

### Étape 6: Vérifier la Navigation
Après 1-2 secondes:
- ✅ L'application navigue automatiquement vers l'écran d'accueil (HomeScreen)
- ✅ L'écran de connexion est accessible
- ✅ Pas d'écran blanc ou frozen
- ✅ La sidebar/header a disparu (on est hors du dashboard)

### Étape 7: Se Reconnecter
1. Clique sur "Se Connecter" pour vérifier que le système fonctionne encore
2. Entre tes identifiants
3. Vérifier que tu peux re-accéder au dashboard sans problèmes

---

## 🐛 Dépannage - Si Ça Ne Fonctionne Pas

### Symptôme 1: "Écran Blanc" Après Déconnexion
**Vérify dans la console:**
```javascript
// Devrait voir ces logs:
"Starting logout process..."  // ✅
"Auth event: SIGNED_OUT"       // ✅
"Logout successful..."         // ✅
```

Si tu ne vois pas ces logs, la déconnexion ne s'est pas déclenchée correctement.

### Symptôme 2: "Spinner Infini"
- Le bouton reste bloqué avec le spinner
- La console n'affiche rien après "Starting logout"

**Solution:**
1. Vérifie la connexion internet
2. Vérifie les logs Supabase (assurez-vous que signOut() fonctionne)
3. Recharge l'app: `Ctrl+R` ou restart l'Expo

### Symptôme 3: Erreur dans la Console
```javascript
"Logout error from Supabase: [error details]"
```

**Solution:**
- Vérifie les logs Supabase pour voir pourquoi signOut() échoue
- Peut être un problème de token expiré ou de session

---

## 📋 Checklist de Validation

- [ ] Console affiche "Starting logout process..."
- [ ] Icône logout devient spinner
- [ ] Console affiche "Auth event: SIGNED_OUT"
- [ ] Console affiche "Logout successful..."
- [ ] L'app navigue vers HomeScreen (1-2 sec après)
- [ ] Pas d'écran blanc ou message d'erreur
- [ ] Je peux me reconnecter sans problème
- [ ] Les 3 boutons logout fonctionnent (mobile + sidebar + header desktop)

---

## 🎯 Résumé Technique

**Avant:** 
```javascript
const signOut = async () => {
    await supabase.auth.signOut();  // Pas d'attente réelle
    setUser(null);                   // Peut causer des race conditions
    setProfile(null);
};
```

**Après:**
```javascript
const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
            setUser(null);  // Fallback
            setProfile(null);
        }
        // sinon onAuthStateChange nettoie l'état
    } catch (e) {
        console.error('Exception:', e);
        setUser(null);  // Fallback
        setProfile(null);
    }
};
```

Le flux de déconnexion est maintenant robuste et les utilisateurs voient un feedback visuel.
