
# 🤖 AI_GOLD_MASTER - Bot de Trading IA 24/7

Bot de trading automatisé avec intelligence artificielle pour analyse de marché en temps réel et génération de signaux d'achat/vente précis.

## 🌟 Fonctionnalités Principales

### 🚀 Trading Bot 24/7
- ✅ **Analyse continue** - Mise à jour chaque seconde
- ✅ **Signaux automatiques** - BUY/SELL/HOLD avec niveau de confiance
- ✅ **IA avancée** - GPT-4o ou Qwen 3 pour des décisions intelligentes
- ✅ **Multi-marchés** - Crypto (Binance, Coinbase) et Actions (Alpha Vantage, Polygon)
- ✅ **Notifications en temps réel** - Telegram, Webhook, Dashboard web
- ✅ **Déploiement cloud** - Fonctionne 24/7 sur Render

### 📊 Indicateurs Techniques
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Moving Averages (SMA 50/200)
- Analyse de volume
- Momentum
- Analyse IA contextuelle

### 🔔 Notifications
- 📱 Telegram bot
- 🌐 Webhooks
- 📊 Dashboard web temps réel
- 📝 Logs détaillés

## 🏃 Démarrage Rapide

### 🎓 Nouveau? Commencez ici!

**Vous n'êtes pas très doué avec la programmation? Pas de problème!**

#### 📋 Si vous avez TOUTES vos clés API (OpenAI, Telegram, Twelve Data):
👉 **[GUIDE_CONFIGURATION_COMPLETE.md](./GUIDE_CONFIGURATION_COMPLETE.md)** - Configuration complète étape par étape ⭐  
👉 **[CHECKLIST_RAPIDE.md](./CHECKLIST_RAPIDE.md)** - Checklist à cocher (20-30 minutes)

#### 📖 Guides généraux:
👉 **[GUIDE_DEBUTANT.md](./GUIDE_DEBUTANT.md)** - Guide complet pour débutants  
👉 **[OBTENIR_OPENAI_API_KEY.md](./OBTENIR_OPENAI_API_KEY.md)** - Comment obtenir votre clé OpenAI

### Déploiement sur Render (Recommandé - 24/7)

**Le plus simple pour avoir un bot actif 24/7!**

1. **Obtenir votre clé OpenAI** - Voir [OBTENIR_OPENAI_API_KEY.md](./OBTENIR_OPENAI_API_KEY.md)

2. **Fork ce repository** sur votre compte GitHub

3. **Créer un compte sur Render** (gratuit): [https://render.com](https://render.com)

4. **Déployer en un clic**:
   - Connectez votre GitHub à Render
   - Sélectionnez ce repository
   - Render détecte automatiquement `render.yaml`
   - Ajoutez votre clé `OPENAI_API_KEY`
   - Cliquez sur "Create Web Service"

5. **C'est tout!** Votre bot est en ligne 24/7 🎉

👉 **Guide complet**: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

### Utilisation Locale (Test)

```bash
# 1. Cloner le repository
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env et ajouter votre OPENAI_API_KEY

# 4. Démarrer le bot
npm start
```

Accédez au dashboard: `http://localhost:3000/dashboard`

## 📖 Documentation Complète

### 🎓 Pour Débutants
- 🎯 **[GUIDE_CONFIGURATION_COMPLETE.md](./GUIDE_CONFIGURATION_COMPLETE.md)** - Configuration complète avec toutes les APIs ⭐⭐⭐
- ✅ **[CHECKLIST_RAPIDE.md](./CHECKLIST_RAPIDE.md)** - Checklist de configuration (20-30 min)
- 📘 **[GUIDE_DEBUTANT.md](./GUIDE_DEBUTANT.md)** - Guide complet avec explications simples
- 🔑 **[OBTENIR_OPENAI_API_KEY.md](./OBTENIR_OPENAI_API_KEY.md)** - Comment obtenir votre clé API OpenAI

### Guides Techniques
- 🚀 **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** - Déploiement 24/7 sur Render
- 📊 **[AI_MODEL_COMPARISON.md](./AI_MODEL_COMPARISON.md)** - Comparaison GPT-4o vs Qwen 3
- 🐧 **[QWEN3_DEPLOYMENT.md](./QWEN3_DEPLOYMENT.md)** - Déploiement Qwen 3 local
- ⚡ **[QUICKSTART.md](./QUICKSTART.md)** - Guide de démarrage rapide
- 📋 **[SOLUTION_COMPLETE.md](./SOLUTION_COMPLETE.md)** - Vue d'ensemble complète

### Fichiers Principaux
- `trading-bot-24-7.js` - Bot principal 24/7
- `real-time-market-analyzer.js` - Analyseur de marché en temps réel
- `market-data-connector.js` - Connexion aux APIs de marché
- `ai-integration.js` - Gestionnaire IA (GPT-4o/Qwen 3)

## 🔧 Configuration

### Variables d'Environnement Essentielles

```env
# IA
AI_MODEL=gpt-4o                    # ou qwen-3
OPENAI_API_KEY=sk-...              # Clé OpenAI

# Trading
TRADING_SYMBOL=BTCUSDT             # Symbole à trader
DATA_PROVIDER=binance              # binance, coinbase, alphavantage, twelvedata
UPDATE_INTERVAL=1000               # Fréquence d'analyse (ms)

# API Keys pour données de marché
MARKET_API_KEY=...                 # Pour Alpha Vantage, Polygon
TWELVE_DATA_API_KEY=...            # Pour Twelve Data (or, stocks, forex)

# Notifications (optionnel)
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
WEBHOOK_URL=...
```

### 🥇 Configuration pour l'Or (XAUUSD)

```env
DATA_PROVIDER=twelvedata
TRADING_SYMBOL=XAUUSD
TWELVE_DATA_API_KEY=votre-clé-ici
UPDATE_INTERVAL=5000               # 5 sec (reste sous la limite gratuite)
```

**Autres métaux précieux:**
- Argent: `XAGUSD`
- Pétrole: `USOIL`

Voir [.env.example](./.env.example) pour la configuration complète.

## 🎯 Choix du Modèle IA

### GPT-4o (Recommandé pour débuter)
- ✅ Qualité supérieure
- ✅ Facile à configurer
- ✅ Déploiement immédiat
- 💰 ~$5-20/mois

### Qwen 3 (Pour volume élevé)
- ✅ Gratuit après setup
- ✅ Confidentialité totale
- ✅ Latence minimale
- ⚙️ Nécessite GPU local

👉 **Comparaison détaillée**: [AI_MODEL_COMPARISON.md](./AI_MODEL_COMPARISON.md)

## 📊 Dashboard Web

Une fois déployé, accédez à:

- `/` ou `/health` - Health check
- `/dashboard` - Dashboard visuel avec statistiques
- `/stats` - Statistiques JSON
- `/signals` - Derniers signaux JSON

## 🔔 Exemples de Signaux

```
============================================================
🔔 SIGNAL DE TRADING - BUY
============================================================
💰 Prix: $50,125.50
📊 Confiance: 85.2%
📝 Raisons:
   - BUY: RSI survendu (poids: 2)
   - BUY: MACD haussier (poids: 1.5)
   - BUY: Croix dorée (MA) (poids: 1)
============================================================
```

## 🎓 Fonctionnalités Pine Script (Original)

Ce repository inclut également:
- **Custom Indicator Development** - Indicateurs Pine Script personnalisés
- **Pine Script v6 Syntax** - Exemples et tutoriels
- **TradingView Integration** - Scripts d'automatisation TradingView

## Getting Started (Pine Script)
1. Clone the repository: `git clone https://github.com/davidnault0/AI_GOLD_MASTER.git`
2. Open the scripts in TradingView and start customizing your indicators!

## AI Model Integration

This repository now includes support for AI-powered enhancements using either **GPT-4o** or **Qwen 3** (Gwen 3).

### Choosing the Right Model

For detailed comparison and recommendations, see [AI_MODEL_COMPARISON.md](./AI_MODEL_COMPARISON.md).

**Quick Decision Guide:**
- 🚀 **GPT-4o**: Best for code quality, multimodal tasks, and ease of use
- 🔒 **Qwen 3**: Best for privacy, local deployment, and high-volume usage

### Configuration

See `ai-config.json` for model configuration and task routing settings.

### Usage

```javascript
const AIModelManager = require('./ai-integration');

// Initialize with default model (GPT-4o)
const ai = new AIModelManager();

// Generate Pine Script
await ai.generatePineScript('Create a moving average crossover indicator');

// Analyze logs
await ai.analyzeLogs(compilationLogs);

// Switch models
ai.switchModel('qwen-3');
```

For network efficiency recommendations, refer to the comparison document.

## 💰 Coûts

### Render (Hébergement)
- **Starter (Gratuit)**: 750h/mois, idéal pour tester
- **Standard ($7/mois)**: 24/7 sans interruption, recommandé

### OpenAI API (IA)
- **GPT-4o**: ~$2.50-10 par million de tokens
- **Estimation mensuelle**: $5-20/mois selon l'utilisation

### Données de Marché
- **Binance**: GRATUIT (API publique)
- **Coinbase**: GRATUIT (API publique)
- **Alpha Vantage**: GRATUIT (5 calls/min) ou $50/mois (premium)

## 🛡️ Sécurité

⚠️ **IMPORTANT**: Ce bot est à des fins éducatives et de démonstration.

- ✅ Ne jamais committer vos clés API
- ✅ Utiliser des variables d'environnement
- ✅ Tester avec de petits montants
- ⚠️ Faire vos propres recherches (DYOR)
- ⚠️ Le trading comporte des risques

## 🐛 Dépannage

### Le bot ne démarre pas
- Vérifier que `OPENAI_API_KEY` est définie
- Vérifier les logs sur Render
- Vérifier la configuration dans `.env`

### Pas de signaux
- Attendre 1-2 minutes pour données historiques
- Le marché peut être calme (normal)
- Vérifier que les données sont reçues dans les logs

### Erreurs de connexion
- Binance: Devrait toujours fonctionner (API publique)
- Vérifier votre connexion internet
- Voir [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) section dépannage

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [API Binance](https://binance-docs.github.io/apidocs/)
- [OpenAI API](https://platform.openai.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 🤝 Contribution

Feel free to contribute by submitting pull requests with your indicators, strategies, or improvements!

## 📝 License

MIT License - Voir LICENSE pour plus de détails

## ⭐ Support

Si ce projet vous aide, donnez-lui une ⭐ sur GitHub!

---

**Made with ❤️ and 🤖 AI**