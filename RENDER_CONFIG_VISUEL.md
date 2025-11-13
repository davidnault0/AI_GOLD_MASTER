# 🎯 Configuration Render - Guide Visuel Simple

## ⚠️ IMPORTANT - Commandes Exactes pour Render

Quand vous créez votre service sur Render, utilisez **EXACTEMENT** ces commandes:

```
Build Command:    npm install
Start Command:    node trading-bot-24-7.js
```

**NE PAS METTRE** `npm start` ou autre chose!

---

## 📋 ÉTAPE PAR ÉTAPE - Configuration Render

### ✅ Étape 1: Créer le Service (2 minutes)

1. **Allez sur** https://render.com
2. **Connectez-vous** avec votre compte GitHub
3. **Cliquez** sur le gros bouton "New +" (en haut à droite)
4. **Sélectionnez** "Web Service"
5. **Trouvez** "AI_GOLD_MASTER" dans la liste de vos repos
6. **Cliquez** sur "Connect" à côté du repo

---

### ✅ Étape 2: Configuration du Service (3 minutes)

Vous allez voir un formulaire. Remplissez **EXACTEMENT** comme ceci:

#### Section "Details"
```
Name:              ai-trading-bot
                   (ou n'importe quel nom que vous voulez)

Region:            Oregon (US West)
                   (laissez par défaut)

Branch:            copilot/evaluate-gpt-4o-vs-gwen-3
                   (ou main si vous avez mergé)
```

#### Section "Build & Deploy"

**🔴 TRÈS IMPORTANT - Copiez exactement:**

```
Root Directory:    (LAISSEZ VIDE)

Build Command:     npm install

Start Command:     node trading-bot-24-7.js
```

**Vérifiez 3 fois que c'est exactement ça!**

#### Section "Plan"
```
Plan:              Starter (Free)
                   (Pour commencer - gratuit)
```

---

### ✅ Étape 3: Variables d'Environnement (10 minutes)

Scrollez vers le bas jusqu'à voir **"Environment Variables"**

**Cliquez sur "Add Environment Variable"** pour chaque variable ci-dessous:

#### Variable 1: OpenAI
```
Key:     OPENAI_API_KEY
Value:   sk-proj-VOTRE_CLE_ICI
```
👉 Collez votre vraie clé OpenAI (celle qui commence par `sk-proj-`)

#### Variable 2: Telegram Token
```
Key:     TELEGRAM_BOT_TOKEN
Value:   123456789:ABC-VOTRE_TOKEN_ICI
```
👉 Collez votre token Telegram (format: chiffres:lettres)

#### Variable 3: Telegram Chat ID
```
Key:     TELEGRAM_CHAT_ID
Value:   VOTRE_CHAT_ID_ICI
```
👉 Collez votre Chat ID (juste des chiffres)

#### Variable 4: Twelve Data
```
Key:     TWELVE_DATA_API_KEY
Value:   VOTRE_CLE_TWELVE_DATA_ICI
```
👉 Collez votre clé Twelve Data

#### Variable 5: Symbole à Trader (Or)
```
Key:     TRADING_SYMBOL
Value:   XAUUSD
```
👉 Tapez exactement `XAUUSD` pour l'or (en majuscules)

#### Variable 6: Provider de Données
```
Key:     DATA_PROVIDER
Value:   twelvedata
```
👉 Tapez exactement `twelvedata` (en minuscules)

#### Variable 7: Modèle IA
```
Key:     AI_MODEL
Value:   gpt-4o
```
👉 Tapez exactement `gpt-4o` (en minuscules)

---

### ✅ Étape 4: Vérification (1 minute)

**Avant de cliquer "Create Web Service", vérifiez:**

- [ ] Build Command = `npm install`
- [ ] Start Command = `node trading-bot-24-7.js`
- [ ] 7 variables d'environnement ajoutées
- [ ] Toutes les clés API sont complètes (pas de `...` à la fin)
- [ ] TRADING_SYMBOL = `XAUUSD`
- [ ] DATA_PROVIDER = `twelvedata`

---

### ✅ Étape 5: Déployer! (3 minutes)

1. **Scrollez tout en bas**
2. **Cliquez** sur le gros bouton bleu "Create Web Service"
3. **Attendez** (2-3 minutes)
4. **Observez** le statut:
   - ⏳ "In Progress" → Installation de Node.js
   - 🔨 "Building" → npm install en cours
   - 🚀 "Deploying" → Démarrage du bot
   - ✅ "Live" → **C'EST PRÊT!** 🎉

---

### ✅ Étape 6: Vérifier que Ça Marche (5 minutes)

#### 6.1 Voir les Logs

1. **Cliquez** sur "Logs" (menu de gauche)
2. **Cherchez** ces messages:

```
✅ Vous DEVEZ voir:
   🤖 Trading Bot 24/7 initialisé
   📊 Configuration: {...}
   📡 Connecteur de marché initialisé: twelvedata
   ✅ Connexion au marché réussie - XAUUSD: $2XXX.XX
   🌐 Serveur HTTP démarré sur le port 3000

❌ Si vous voyez des erreurs:
   - "Invalid API Key" → Vérifiez vos clés API
   - "Cannot find module" → Vérifiez Build Command
   - Port error → Vérifiez Start Command
```

#### 6.2 Accéder au Dashboard

1. **Trouvez** l'URL de votre service (en haut de la page)
   - Format: `https://ai-trading-bot-xxxxx.onrender.com`
2. **Copiez** cette URL
3. **Ajoutez** `/dashboard` à la fin
4. **Ouvrez** dans votre navigateur
   - Exemple: `https://ai-trading-bot-xxxxx.onrender.com/dashboard`

**Vous devriez voir:**
```
┌─────────────────────────────────┐
│ 🤖 Trading Bot 24/7             │
│ ● ACTIF                         │
├─────────────────────────────────┤
│ Symbole: XAUUSD                 │
│ Prix actuel: $2,XXX.XX          │
│ Temps actif: 0h 2m              │
│ Signaux totaux: 0               │
└─────────────────────────────────┘
```

#### 6.3 Vérifier Telegram

1. **Ouvrez** Telegram sur votre téléphone
2. **Trouvez** votre bot
3. **Envoyez** `/start` (si pas déjà fait)
4. **Attendez** 5-10 minutes
5. **Vous recevrez** un message quand il y a un signal important

---

## 🆘 Erreurs Courantes et Solutions

### ❌ Erreur: "Build failed"

**Cause:** Build Command incorrecte

**Solution:**
1. Allez dans "Settings" de votre service
2. Section "Build & Deploy"
3. Changez Build Command en: `npm install`
4. Cliquez "Save Changes"
5. Cliquez "Manual Deploy" → "Deploy latest commit"

---

### ❌ Erreur: "Application failed to respond"

**Cause:** Start Command incorrecte

**Solution:**
1. Allez dans "Settings"
2. Section "Build & Deploy"
3. Changez Start Command en: `node trading-bot-24-7.js`
4. Cliquez "Save Changes"
5. Le service redémarre automatiquement

---

### ❌ Le guide complet donne une erreur 404

**Cause:** Le fichier n'est pas dans votre repo local

**Solution:** Les guides sont dans le repo GitHub! Voici les liens directs:

- **Guide complet:** Allez sur GitHub → Fichiers du repo → Cliquez sur `GUIDE_CONFIGURATION_COMPLETE.md`
- **Checklist rapide:** Cliquez sur `CHECKLIST_RAPIDE.md`

**OU** clonez le repo:
```bash
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER
git checkout copilot/evaluate-gpt-4o-vs-gwen-3
cat GUIDE_CONFIGURATION_COMPLETE.md
```

---

## 📸 Captures d'Écran des Bons Réglages

### Configuration Render - Vue d'ensemble

```
┌─────────────────────────────────────────────┐
│ Name: ai-trading-bot                        │
│ Region: Oregon (US West)                    │
│ Branch: copilot/evaluate-gpt-4o-vs-gwen-3  │
│                                             │
│ Build Command:   npm install                │
│ Start Command:   node trading-bot-24-7.js   │
│                                             │
│ Environment Variables: 7 configured         │
└─────────────────────────────────────────────┘
```

---

## ✅ Checklist Finale

Cochez tout avant de déployer:

- [ ] Build Command = `npm install` (exactement)
- [ ] Start Command = `node trading-bot-24-7.js` (exactement)
- [ ] OPENAI_API_KEY configurée (commence par sk-proj-)
- [ ] TELEGRAM_BOT_TOKEN configurée (format: 123:ABC...)
- [ ] TELEGRAM_CHAT_ID configurée (juste chiffres)
- [ ] TWELVE_DATA_API_KEY configurée
- [ ] TRADING_SYMBOL = XAUUSD (majuscules)
- [ ] DATA_PROVIDER = twelvedata (minuscules)
- [ ] AI_MODEL = gpt-4o (minuscules)

---

## 🎯 Résumé Ultra-Rapide

```
Build Command:     npm install
Start Command:     node trading-bot-24-7.js

Variables (7):
1. OPENAI_API_KEY=sk-proj-...
2. TELEGRAM_BOT_TOKEN=123:ABC...
3. TELEGRAM_CHAT_ID=123456789
4. TWELVE_DATA_API_KEY=...
5. TRADING_SYMBOL=XAUUSD
6. DATA_PROVIDER=twelvedata
7. AI_MODEL=gpt-4o
```

---

## 📞 Besoin d'Aide?

**Si ça ne marche toujours pas:**

1. 📸 Prenez une capture d'écran de:
   - La section "Build & Deploy" dans Settings
   - Les logs d'erreur
   - La section Environment Variables

2. 💬 Commentez sur la PR avec:
   - "Voici ma configuration Render"
   - Joignez les captures d'écran
   - Décrivez l'erreur exacte que vous voyez

3. 👀 Je vais regarder et vous dire exactement quoi corriger!

---

**Temps total estimé: 20-25 minutes**

**Une fois "Live", votre bot tourne 24/7 automatiquement!** 🚀

---

## 🌐 Accès aux Guides sur GitHub

Si les fichiers markdown ne s'ouvrent pas:

1. Allez sur: https://github.com/davidnault0/AI_GOLD_MASTER
2. Cliquez sur la branche: `copilot/evaluate-gpt-4o-vs-gwen-3`
3. Vous verrez tous les fichiers .md
4. Cliquez sur celui que vous voulez lire

**Ou** lisez-les directement depuis ce guide - toutes les infos sont ici! ✅
