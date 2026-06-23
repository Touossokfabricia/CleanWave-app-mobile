# 📱 GUIDE COMPLET - Tester les Dashboards

## 🎯 Vue Générale

Votre application CleanWave dispose maintenant de **4 dashboards différents** adaptés à chaque rôle d'utilisateur. Chaque dashboard est **100% responsive** et s'adapte automatiquement à la taille de l'écran.

---

## 🚀 DÉMARRAGE RAPIDE

### **1. Lancer l'Application**
```bash
cd C:\Users\FABRICIA\Downloads\projetfabricia@123\CleanWave
npm start
```

Vous verrez un QR code dans le terminal.

### **2. Ouvrir avec Expo Go**

**Android:**
- Téléchargez Expo Go: https://play.google.com/store/apps/details?id=host.exp.exponent
- Ouvrez Expo Go
- Appuyez sur "Scan QR code"
- Scannez le QR code du terminal

**iOS:**
- Téléchargez Expo Go: https://apps.apple.com/app/expo-go/id982107779
- Ouvrez l'app
- Appuyez sur le QR code
- Scannez le code du terminal

### **3. Connectez-vous**
Utilisez vos identifiants pour vous connecter.

---

## 🔐 Test Complet (Différents Rôles)

### **Rôle 1️⃣: CITOYEN**

#### Accès
- Inscrivez-vous avec le rôle "Citoyen"
- Ou connectez-vous avec un compte citoyen

#### Ce que vous verrez

**MOBILE** (Navigation en bas):
```
┌──────────────────────┐
│ CleanWave            │
│ Bienvenue, Paul      │
├──────────────────────┤
│   [Contenu]          │
├──────────────────────┤
│ 🔔 📊 ⚙️ 📜 👤    │
└──────────────────────┘
```

**DESKTOP** (Sidebar latérale):
```
┌────────┬────────────────┐
│ 🟢     │ Bienvenue Paul │
│ Non    │ [Contenu]      │
│ user   │                │
├────────┤                │
│🔔 Not  │                │
│📊 Cla  │                │
│⚙️ Sta  │                │
│📜 Par  │                │
│👤 His  │                │
│...     │                │
│Se déc  │                │
└────────┴────────────────┘
```

#### Tabs disponibles (Citoyen)
1. **🔔 Notifications** - Liste des notifications
2. **📊 Classement** - Classement des utilisateurs
3. **📈 Statistiques** - Vos stats personnelles
4. **⚙️ Paramètres** - Vos paramètres
5. **📜 Historiques** - Historique des actions
6. **🚩 Signalements** - Vos signalements
7. **👤 Mon Compte** - Gérer votre profil

#### Test
- [ ] Naviguez entre les tabs
- [ ] Vérifiez que chaque tab affiche le contenu correct
- [ ] Testez le bouton "Se déconnecter"

---

### **Rôle 2️⃣: COLLECTEUR**

#### Accès
- Inscrivez-vous/connectez-vous avec le rôle "Collecteur"

#### Tabs disponibles (Collecteur)
1. **📅 Planning** - Planning de collecte
2. **🚗 Collectes** - Mes collectes
3. **📈 Statistiques** - Stats avancées
4. **👥 Équipe** - Gestion d'équipe
5. **📋 Rapports** - Rapports mensuels
6. **⚙️ Paramètres** - Paramètres collecteur

#### Test
- [ ] Vérifiez le planning de collecte
- [ ] Naviguer dans tous les tabs
- [ ] Vérifiez que les données s'affichent correctement

---

### **Rôle 3️⃣: PARTENAIRE**

#### Accès
- Inscrivez-vous/connectez-vous avec le rôle "Partenaire"

#### Tabs disponibles (Partenaire)
1. **📢 Campagnes** - Mes campagnes
2. **📊 Résultats** - Résultats des campagnes
3. **👥 Participants** - Liste des participants
4. **📦 Ressources** - Ressources disponibles
5. **💬 Messages** - Messages
6. **⚙️ Paramètres** - Paramètres

#### Test
- [ ] Vérifiez les campagnes affichées
- [ ] Naviguez entre les tabs
- [ ] Testez la responsivité

---

### **Rôle 4️⃣: ADMIN**

#### Accès
- Inscrivez-vous/connectez-vous avec le rôle "Admin"

#### Dashboard Spécial - Vue d'Ensemble
Affiche des **cartes de statistiques** en grille:
- 🟢 Utilisateurs: 2,450
- 🔵 Campagnes: 156
- 🟠 Déchets (kg): 8.2K
- 🔴 Signalements: 12

#### Tabs disponibles (Admin)
1. **📊 Dashboard** - Vue d'ensemble avec stats
2. **👥 Utilisateurs** - Gestion des utilisateurs
3. **📢 Campagnes** - Gestion des campagnes
4. **📈 Statistiques** - Stats globales
5. **🛡️ Modération** - Modération du contenu
6. **⚙️ Paramètres** - Paramètres admin

#### Test
- [ ] Vérifiez les cartes de stats
- [ ] Vérifiez la gestion des utilisateurs
- [ ] Testez tous les tabs

---

## 📱 Test Responsivité

### **Sur Téléphone (Mobile)**

**Attendu:**
- Navigation en bas avec icônes + labels
- Tout le contenu scrollable verticalement
- Header compact avec logout icon
- Sidebar MASQUÉE

**Test:**
1. Scannez avec Expo Go sur mobile
2. Naviguez entre les tabs avec le bottom nav
3. Scrollez le contenu
4. Testez le logout

### **Sur Web/Tablette (Desktop)**

**Attendu:**
- Sidebar latérale verte à gauche
- Contenu principal au centre
- Bouton "Se déconnecter" en bas du sidebar
- Bouton "Signaler" en bas du sidebar

**Test:**
1. Ouvrez dans un navigateur: http://localhost:8081
2. Ouvrez le DevTools (F12)
3. Changez la taille (résolution ≥ 768px)
4. Vérifiez que la sidebar s'affiche

---

## 🔍 Vérifications Importantes

### ✅ Rendez-vous Check-List

#### Interface Générale
- [ ] L'app se lance sans erreur
- [ ] La navigation ne crash pas
- [ ] Les couleurs sont correctes (vert primaire)
- [ ] Les icônes s'affichent correctement

#### Navigation
- [ ] Sur mobile: bottom nav avec 6-7 tabs
- [ ] Sur desktop: sidebar latérale
- [ ] Cliquer sur un tab change le contenu
- [ ] Le titre du tab s'affiche

#### Responsive
- [ ] Redimensionnez la fenêtre
- [ ] Vérifiez que le layout change à 768px
- [ ] Mobile: navigation en bas
- [ ] Desktop: sidebar à gauche

#### Logout
- [ ] Cliquez sur "Se déconnecter"
- [ ] Vous revenir à l'écran de connexion
- [ ] Pouvez vous reconnecter avec un autre rôle

#### Contenu
- [ ] Chaque tab affiche du contenu
- [ ] Les cartes s'affichent correctement
- [ ] Les textes sont lisibles
- [ ] Les données fictives s'affichent

---

## 🐛 Troubleshooting

### **L'app crash au démarrage**
```
Solution: 
1. Appuyez sur 'r' dans le terminal Expo pour recharger
2. Vérifiez qu'il n'y a pas de messages d'erreur
```

### **Les tabs ne changent pas**
```
Solution:
1. Vérifiez que vous touchez les tabs
2. Les tabs sont différents pour chaque rôle
```

### **Pas de navigation en bas sur mobile**
```
Solution:
1. Vérifiez que vous êtes sur un mobile (< 768px)
2. La sidebar doit être cachée
3. La bottom nav doit être visible
```

### **Les icônes ne s'affichent pas**
```
Solution:
1. Attendez le chargement complet de l'app
2. Recharge: Appuyez sur 'r'
3. Les icônes viennent d'@expo/vector-icons
```

### **Le layout n'est pas responsive**
```
Solution:
1. Redimensionnez la fenêtre du navigateur
2. À 768px, le layout devrait changer
3. Vérifiez qu'useWindowDimensions est importé
```

---

## 📊 Données Fictives (pour tester)

Les dashboards affichent actuellement des **données fictives**. Si vous voulez voir des **données réelles**, il faut les connecter à Supabase.

### Exemple de Données Affichées Actuellement:

**Citoyen - Classement:**
```
1. Marie (245 points)
2. Jean (198 points)
3. Sophie (156 points)
```

**Admin - Statistiques:**
```
- Utilisateurs: 2,450
- Campagnes: 156
- Déchets collectés: 8.2 tonnes
```

---

## 🔄 Intégration Supabase (Optionnel)

Si vous voulez utiliser les **vraies données** de Supabase:

### Étapes à Faire:

1. **Créer les requêtes Supabase**
   ```javascript
   // Exemple: récupérer les utilisateurs pour l'admin
   const { data: users } = await supabase
     .from('profiles')
     .select('*');
   ```

2. **Passer les données au dashboard**
   ```javascript
   <AdminDashboard users={users} />
   ```

3. **Afficher les données dynamiquement**
   ```javascript
   {users.map(user => (
       <View key={user.id}>
           <Text>{user.nom}</Text>
       </View>
   ))}
   ```

---

## 📝 Notes

- Chaque dashboard a son propre design adapté au rôle
- La responsive est **automatique** (DashboardLayout gère tout)
- Les icônes viennent de **@expo/vector-icons**
- Les couleurs viennent du **theme.js**
- Le logout se fait via **AuthContext**

---

## ✨ Prochaines Étapes

1. ✅ Tester les dashboards (ce que vous faites)
2. 🔄 Connecter les vraies données de Supabase (optionnel)
3. 📊 Ajouter des graphiques si nécessaire
4. 💾 Implémenter les actions (créer, modifier)

---

## 🎓 Fichiers Importants

- `src/components/DashboardLayout.js` - Composant main
- `src/screens/dashboard/DashboardCitoyen.js` - Dashboard citoyen
- `src/screens/dashboard/DashboardCollecteur.js` - Dashboard collecteur
- `src/screens/dashboard/DashboardPartenaire.js` - Dashboard partenaire
- `src/screens/dashboard/DashboardAdmin.js` - Dashboard admin
- `src/constants/theme.js` - Thème et couleurs

---

**✅ Status: PRÊT À TESTER!**

Lancez `npm start` et explorez les dashboards! 🎉
