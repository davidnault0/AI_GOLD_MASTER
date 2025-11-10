# ⚠️ AVERTISSEMENT DE SÉCURITÉ CRITIQUE

## 🚨 NE JAMAIS POSTER DE CREDENTIALS DANS GITHUB!

Les credentials (email/password) **NE DOIVENT JAMAIS** être:
- ❌ Postés dans les commentaires GitHub
- ❌ Committés dans le code
- ❌ Partagés dans les issues
- ❌ Mis dans des fichiers publics

## ✅ Comment Utiliser les Credentials CORRECTEMENT

### Option 1: Fichier .env (RECOMMANDÉ)
```bash
# 1. Créer un fichier .env (qui est ignoré par git)
cp .env.example .env

# 2. Éditer .env avec vos vrais credentials
nano .env

# 3. Le fichier .env contient:
TRADINGVIEW_EMAIL=your-email@example.com
TRADINGVIEW_PASSWORD=your-password
```

### Option 2: Variables d'Environnement
```bash
export TRADINGVIEW_EMAIL="your-email@example.com"
export TRADINGVIEW_PASSWORD="your-password"
node test_agm_tradingview.js
```

### Option 3: GitHub Secrets (pour CI/CD)
1. Allez dans Settings → Secrets and variables → Actions
2. Créez deux secrets:
   - `TRADINGVIEW_EMAIL`
   - `TRADINGVIEW_PASSWORD`
3. Les scripts CI/CD les utiliseront automatiquement

## 📝 Les Scripts Chargent Automatiquement

Tous les scripts de test sont configurés pour charger depuis:
1. Variables d'environnement
2. Fichier `.env`
3. Utilise des placeholders si rien n'est trouvé

## 🔒 Sécurité

- ✅ `.env` est dans `.gitignore`
- ✅ Les credentials ne seront JAMAIS committés
- ✅ Vous pouvez tester localement en toute sécurité

## ⚡ Action Immédiate Requise

**SI VOUS AVEZ POSTÉ VOS CREDENTIALS DANS GITHUB:**

1. **CHANGEZ VOTRE MOT DE PASSE IMMÉDIATEMENT** sur TradingView
2. Supprimez le commentaire avec les credentials (si possible)
3. Utilisez la méthode `.env` pour les futurs tests
4. Ne refaites JAMAIS cette erreur

## 🧪 Pour Tester Maintenant

```bash
# 1. Installer dependencies
npm install puppeteer dotenv

# 2. Créer .env avec vos credentials
cat > .env << 'EOF'
TRADINGVIEW_EMAIL=your-real-email@example.com
TRADINGVIEW_PASSWORD=your-real-password
EOF

# 3. Lancer le test
node test_agm_tradingview.js
```

Le script va:
- Se connecter à TradingView
- Coller le code Pine Script
- Vérifier la compilation
- Prendre des screenshots
- Rapporter les erreurs s'il y en a
