# 🏆 AI GOLD MASTER - Intelligence Artificielle d'Analyse de l'Or

## 📋 Description

**AI Gold Master** est une intelligence artificielle sophistiquée qui analyse le marché de l'or (XAUUSD) en temps réel et génère automatiquement des signaux de trading (ACHAT/VENTE) basés sur de multiples indicateurs techniques.

## ✨ Fonctionnalités

### 🎯 Analyse Technique Complète
- **Moyennes Mobiles Exponentielles (EMA)** : 9, 21, 50 périodes
- **Moyenne Mobile Simple (SMA)** : 200 périodes
- **RSI (Relative Strength Index)** : Détection de surachat/survente
- **MACD** : Identification des tendances et momentum
- **Bandes de Bollinger** : Analyse de la volatilité
- **ATR (Average True Range)** : Mesure de la volatilité
- **Analyse de Volume** : Confirmation des mouvements
- **Stochastique** : Signal de retournement

### 📊 Système de Score
Le système génère un score sur 10 points pour les signaux d'ACHAT et de VENTE basé sur:
- Croisement des EMAs (2 points)
- Niveaux RSI (1.5 points)
- Signaux MACD (1.5 points)
- Position par rapport aux Bandes de Bollinger (1 point)
- Confirmation de tendance (2 points)
- Volume inhabituel (1 point)
- Stochastique (1 point)

### 🔔 Signaux Générés
- **ACHAT** 🟢 : Score ≥ 3.0 avec conditions haussières
- **VENTE** 🔴 : Score ≥ 3.0 avec conditions baissières
- **ATTENTE** ⚪ : Pas de signal clair

## 📦 Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm (Node Package Manager)

### Installation des dépendances

```bash
# Cloner le repository
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER

# Installer les dépendances
npm install
```

## 🚀 Utilisation

### Lancer l'analyse en temps réel

```bash
npm start
```

### Configuration personnalisée

Vous pouvez modifier les paramètres dans `index.js`:

```javascript
const config = {
    symbol: 'XAUUSD',               // Symbole à analyser
    interval: '5m',                  // Intervalle: 1m, 5m, 15m, 1h, 4h, 1d
    updateFrequency: 30000,          // Fréquence de mise à jour en ms
    rsiPeriod: 14,                   // Période RSI
    rsiOverbought: 70,               // Seuil suracheté
    rsiOversold: 30,                 // Seuil survendu
    emaFast: 9,                      // EMA rapide
    emaSlow: 21,                     // EMA lente
    emaTrend: 50,                    // EMA tendance
    signalThreshold: 3.0             // Seuil minimum de signal
};
```

## 📈 Utilisation avec TradingView

### Ajouter l'indicateur Pine Script

1. Ouvrez TradingView et accédez à l'éditeur Pine
2. Copiez le contenu du fichier `gold_analysis_ai.pine`
3. Cliquez sur "Ajouter au graphique"
4. L'indicateur s'affiche avec tous les signaux

### Configurer les alertes

1. Cliquez sur l'icône d'alerte (⏰) dans TradingView
2. Sélectionnez "AI Gold Master - Analyse Or en Temps Réel"
3. Choisissez la condition : "Signal ACHAT Fort" ou "Signal VENTE Fort"
4. Configurez votre notification (email, SMS, webhook)

## 📊 Exemple de Sortie

```
======================================================================
📊 XAUUSD - 12/11/2025, 11:09:45
======================================================================
🟢 SIGNAL: ACHAT (Force: 5.5/10)
💰 Prix: $2045.32
📈 Tendance: HAUSSIÈRE

📊 Score ACHAT: 5.5 | Score VENTE: 1.0

📈 Indicateurs:
   • RSI: 28.4
   • MACD: -0.0234
   • EMA 9: $2043.21
   • EMA 21: $2041.87
   • ATR: 3.45
   • Volume Ratio: 1.35x

💡 Raisons du signal:
   ✓ RSI survendu (28.4) (+1.5)
   ✓ MACD croise signal à la hausse (+1.5)
   ✓ Tendance haussière confirmée (+2)
   ✓ Volume élevé haussier (+1)
======================================================================
```

## 🎛️ API et Événements

### Utilisation Programmatique

```javascript
const GoldAnalysisAI = require('./gold_analysis_ai');

const analyzer = new GoldAnalysisAI({
    symbol: 'XAUUSD',
    updateFrequency: 60000
});

// Écouter les signaux
analyzer.on('signal', (signal) => {
    console.log('Nouveau signal:', signal);
    
    if (signal.signal === 'ACHAT') {
        // Votre logique pour signal d'achat
        sendNotification('Signal ACHAT détecté!');
    }
});

// Écouter les erreurs
analyzer.on('error', (error) => {
    console.error('Erreur:', error);
});

// Démarrer
analyzer.start();

// Arrêter
// analyzer.stop();
```

### Structure du Signal

```javascript
{
    timestamp: 1699790985000,
    symbol: 'XAUUSD',
    signal: 'ACHAT',              // 'ACHAT', 'VENTE', ou 'ATTENTE'
    strength: 5.5,                 // Force du signal (0-10)
    buyScore: 5.5,                 // Score d'achat
    sellScore: 1.0,                // Score de vente
    reasons: [...],                // Liste des raisons
    price: 2045.32,                // Prix actuel
    indicators: {                  // Valeurs des indicateurs
        rsi: 28.4,
        macd: -0.0234,
        emaFast: 2043.21,
        emaSlow: 2041.87,
        atr: 3.45,
        volumeRatio: 1.35
    },
    trend: 'HAUSSIÈRE'             // 'HAUSSIÈRE', 'BAISSIÈRE', ou 'NEUTRE'
}
```

## ⚙️ Architecture du Système

```
AI_GOLD_MASTER/
├── gold_analysis_ai.pine       # Script Pine Script v6 pour TradingView
├── gold_analysis_ai.js          # Moteur d'analyse JavaScript
├── index.js                     # Point d'entrée principal
├── compile_pine_script.js       # Utilitaire de compilation (optionnel)
├── package.json                 # Configuration npm
└── README_FR.md                 # Cette documentation
```

## 🔐 Sécurité et Avertissement

⚠️ **IMPORTANT** :
- Cet outil est fourni à des fins éducatives et informatives
- Les signaux générés ne constituent pas des conseils financiers
- Le trading comporte des risques significants de perte
- Toujours faire ses propres recherches avant de trader
- Ne jamais investir plus que ce que vous pouvez vous permettre de perdre
- Utilisez toujours un stop-loss approprié

## 🔄 Prochaines Améliorations

- [ ] Intégration API réelle pour données en temps réel (Alpha Vantage, Twelve Data)
- [ ] Système de notifications (Email, SMS, Telegram, Discord)
- [ ] Interface web pour monitoring
- [ ] Backtesting sur données historiques
- [ ] Machine Learning pour optimisation des paramètres
- [ ] Trading automatique (avec mode simulation)
- [ ] Support multi-actifs (argent, pétrole, indices)
- [ ] Base de données pour historique des signaux

## 📝 Version en Production

Pour utiliser ce système en production avec de vraies données :

1. **Choisir un fournisseur de données** :
   - [Alpha Vantage](https://www.alphavantage.co/) (gratuit avec limite)
   - [Twelve Data](https://twelvedata.com/) (gratuit puis payant)
   - [Polygon.io](https://polygon.io/) (payant)
   - [Finnhub](https://finnhub.io/) (gratuit avec limite)

2. **Obtenir une clé API** du fournisseur choisi

3. **Modifier `gold_analysis_ai.js`** :
   - Remplacer la méthode `fetchPriceData()` 
   - Intégrer les appels API réels
   - Gérer le rate limiting

4. **Ajouter les variables d'environnement** :
   ```bash
   # Créer un fichier .env
   API_KEY=votre_clé_api_ici
   API_PROVIDER=alphavantage
   ```

## 🤝 Contribution

Les contributions sont bienvenues! N'hésitez pas à:
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Soumettre des pull requests

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails

## 👤 Auteur

**David Nault**
- GitHub: [@davidnault0](https://github.com/davidnault0)

## 🙏 Remerciements

- TradingView pour la plateforme Pine Script
- La communauté des traders et développeurs
- Tous les contributeurs du projet

---

**Note** : Ce système utilise actuellement des données simulées pour la démonstration. Pour une utilisation en trading réel, vous devez intégrer une source de données en temps réel fiable.

## 📞 Support

Si vous avez des questions ou besoin d'aide:
- Ouvrez une issue sur GitHub
- Consultez la documentation TradingView pour Pine Script
- Rejoignez les communautés de trading algorithmique

**Bon trading! 📈💰**
