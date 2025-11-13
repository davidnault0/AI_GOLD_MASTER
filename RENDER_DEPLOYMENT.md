# Guide de Déploiement sur Render - Bot de Trading 24/7

## 🚀 Vue d'ensemble

Ce guide explique comment déployer votre bot de trading IA sur Render pour une analyse de marché en temps réel 24/7.

## 📋 Prérequis

1. **Compte Render** (gratuit) - [https://render.com](https://render.com)
2. **Clé API OpenAI** (pour GPT-4o) - [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. **Repository GitHub** avec ce code

## 🎯 Fonctionnalités

✅ **Analyse en temps réel** - Mise à jour chaque seconde  
✅ **Signaux automatiques** - BUY/SELL/HOLD avec niveau de confiance  
✅ **Multi-marchés** - Crypto (Binance, Coinbase), Actions (Alpha Vantage, Polygon)  
✅ **Notifications** - Telegram, Webhook, Dashboard web  
✅ **IA avancée** - GPT-4o ou Qwen 3  
✅ **Dashboard en direct** - Interface web pour surveiller le bot  
✅ **Disponibilité 24/7** - Fonctionne en continu sur le cloud  

## 📦 Étape 1: Préparation du Code

Le code est déjà prêt! Voici les fichiers principaux:

```
AI_GOLD_MASTER/
├── trading-bot-24-7.js          # Bot principal (24/7)
├── real-time-market-analyzer.js # Analyseur de marché
├── market-data-connector.js     # Connecteur de données réelles
├── ai-integration.js            # Gestionnaire IA
├── render.yaml                  # Configuration Render
└── package.json                 # Dépendances Node.js
```

## 🌐 Étape 2: Déploiement sur Render

### Option A: Déploiement avec render.yaml (Recommandé)

1. **Fork/Push ce repository sur GitHub**

2. **Aller sur Render.com**
   - Connectez-vous à [https://dashboard.render.com](https://dashboard.render.com)

3. **Créer un nouveau Web Service**
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre repository GitHub
   - Render détectera automatiquement le `render.yaml`

4. **Configurer les variables d'environnement** (IMPORTANT!)
   
   Dans le dashboard Render, ajoutez ces variables:

   ```
   OPENAI_API_KEY=sk-...votre-clé...
   TRADING_SYMBOL=BTCUSDT
   AI_MODEL=gpt-4o
   UPDATE_INTERVAL=1000
   DATA_PROVIDER=binance
   ```

   Variables optionnelles pour les notifications:
   ```
   TELEGRAM_BOT_TOKEN=votre-token
   TELEGRAM_CHAT_ID=votre-chat-id
   WEBHOOK_URL=https://votre-webhook.com
   ```

5. **Déployer!**
   - Cliquez sur "Create Web Service"
   - Render va build et déployer automatiquement
   - Le bot démarre automatiquement après le déploiement

### Option B: Déploiement Manuel

1. **Créer un Web Service** sur Render
   - Build Command: `npm install`
   - Start Command: `node trading-bot-24-7.js`
   - Environment: `Node`

2. **Ajouter les variables d'environnement** (voir ci-dessus)

3. **Déployer**

## 🔧 Étape 3: Configuration des APIs

### OpenAI (GPT-4o) - REQUIS

1. Créer un compte sur [https://platform.openai.com](https://platform.openai.com)
2. Aller dans API Keys
3. Créer une nouvelle clé
4. Copier la clé dans `OPENAI_API_KEY` sur Render

**Coût**: ~$2.50-10 par million de tokens

### Binance (Crypto - GRATUIT)

Aucune clé API requise pour les données publiques!

Le bot utilise l'API publique de Binance par défaut.

### Alpha Vantage (Actions)

Si vous voulez trader des actions (AAPL, TSLA, etc.):

1. Obtenir une clé gratuite sur [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Ajouter `MARKET_API_KEY=votre-clé` sur Render
3. Changer `DATA_PROVIDER=alphavantage`
4. Changer `TRADING_SYMBOL=AAPL` (par exemple)

## 📱 Étape 4: Configuration des Notifications

### Telegram (Recommandé)

1. **Créer un bot Telegram**
   - Parler à [@BotFather](https://t.me/BotFather) sur Telegram
   - Envoyer `/newbot`
   - Suivre les instructions
   - Copier le token

2. **Obtenir votre Chat ID**
   - Parler à [@userinfobot](https://t.me/userinfobot)
   - Il vous donnera votre Chat ID

3. **Configurer sur Render**
   ```
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
   TELEGRAM_CHAT_ID=123456789
   ```

### Webhook

Pour recevoir les signaux sur votre propre serveur:

```
WEBHOOK_URL=https://votre-serveur.com/trading-signal
```

Le bot enverra des POST requests avec le format:
```json
{
  "type": "TRADING_SIGNAL",
  "signal": "BUY",
  "symbol": "BTCUSDT",
  "price": 50000.00,
  "confidence": 85.5,
  "timestamp": "2025-11-12T23:00:00.000Z",
  "reasons": [...]
}
```

## 📊 Étape 5: Accéder au Dashboard

Une fois déployé, votre bot sera accessible via:

```
https://votre-app-name.onrender.com
```

**Endpoints disponibles:**

- `/` ou `/health` - Health check
- `/dashboard` - Dashboard visuel avec graphiques
- `/stats` - Statistiques JSON
- `/signals` - Derniers signaux JSON

## 🔍 Surveillance et Logs

### Voir les logs en temps réel

Sur Render:
1. Aller dans votre service
2. Cliquer sur "Logs"
3. Les signaux apparaîtront en temps réel!

### Logs typiques

```
🤖 Trading Bot 24/7 initialisé
✅ Connexion au marché réussie - BTCUSDT: $50000.00
🚀 Démarrage de l'analyse en temps réel...
💚 Bot actif - 0 signaux générés

============================================================
🔔 SIGNAL DE TRADING - BUY
============================================================
💰 Prix: $50125.50
📊 Confiance: 85.2%
📝 Raisons:
   - BUY: RSI survendu (poids: 2)
   - BUY: MACD haussier (poids: 1.5)
============================================================
```

## 💰 Coûts et Plans

### Render Plans

- **Starter (Gratuit)**: 
  - 750 heures/mois
  - Suffisant pour tester
  - Le service dort après 15 min d'inactivité

- **Standard ($7/mois)**:
  - 24/7 sans interruption
  - Recommandé pour production
  - Pas de sommeil automatique

### OpenAI Coûts

GPT-4o: ~$2.50 input / $10 output par million tokens

**Estimation**: $5-20/mois selon l'utilisation

### Alternative Économique: Qwen 3

Déployez Qwen 3 localement et configurez:
```
AI_MODEL=qwen-3
QWEN3_ENDPOINT=http://votre-serveur-qwen:8000
```

Voir [QWEN3_DEPLOYMENT.md](./QWEN3_DEPLOYMENT.md)

## 🛠️ Configuration Avancée

### Changer le symbole tradé

```
TRADING_SYMBOL=ETHUSDT   # Ethereum
TRADING_SYMBOL=BTCUSDT   # Bitcoin
TRADING_SYMBOL=AAPL      # Apple (avec Alpha Vantage)
TRADING_SYMBOL=TSLA      # Tesla (avec Alpha Vantage)
```

### Ajuster la fréquence d'analyse

```
UPDATE_INTERVAL=1000   # 1 seconde (défaut)
UPDATE_INTERVAL=5000   # 5 secondes (moins coûteux)
UPDATE_INTERVAL=500    # 0.5 seconde (très actif)
```

### Utiliser Qwen 3 au lieu de GPT-4o

```
AI_MODEL=qwen-3
QWEN3_ENDPOINT=http://votre-serveur:8000
```

## 🔐 Sécurité

**IMPORTANT**: Ne jamais committer vos clés API!

✅ Utiliser les variables d'environnement Render  
✅ Ne pas inclure les clés dans le code  
✅ Utiliser `.env` localement (déjà dans `.gitignore`)  
❌ Ne jamais push `.env` sur GitHub  

## 🐛 Dépannage

### Le bot ne démarre pas

1. Vérifier les logs sur Render
2. Vérifier que `OPENAI_API_KEY` est définie
3. Vérifier que le port est bien configuré (Render le fait automatiquement)

### Pas de signaux générés

1. Le bot a besoin de données historiques (attendez 1-2 minutes)
2. Les marchés peuvent être calmes (signal HOLD)
3. Vérifier que les données de marché sont reçues dans les logs

### Erreurs de connexion au marché

- Binance: Aucune clé requise, devrait toujours fonctionner
- Alpha Vantage: Vérifier la clé API et le quota (5 calls/min gratuit)
- Coinbase: Vérifier le format du symbole (BTC-USD vs BTCUSDT)

### Le bot s'arrête après 15 minutes

Vous êtes sur le plan Starter (gratuit) de Render.

**Solutions**:
1. Upgrader vers Standard ($7/mois)
2. Utiliser un service de "ping" pour garder le bot actif
3. Accepter les interruptions sur le plan gratuit

## 📈 Optimisation des Performances

### Réduire les coûts IA

1. Utiliser Qwen 3 local pour les analyses simples
2. Réduire la fréquence d'analyse (`UPDATE_INTERVAL=5000`)
3. Activer l'analyse IA seulement pour les signaux > 70% confiance

### Améliorer la précision

1. Ajuster les paramètres des indicateurs dans le code
2. Ajouter plus d'indicateurs techniques
3. Utiliser des données historiques plus longues
4. Fine-tuner le modèle IA avec vos propres données

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [API Binance](https://binance-docs.github.io/apidocs/)
- [OpenAI API](https://platform.openai.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 🆘 Support

Questions? Ouvrez une issue sur GitHub!

## 🎉 Félicitations!

Votre bot de trading IA est maintenant déployé 24/7! 🚀

Surveillez votre dashboard et recevez des signaux en temps réel.

**Rappel important**: Ce bot est à des fins éducatives. Faites vos propres recherches avant de trader avec de l'argent réel!
