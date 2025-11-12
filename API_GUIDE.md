# 🔌 Guide d'Intégration API - AI Gold Master

## 📖 Table des matières

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration de base](#configuration-de-base)
4. [Utilisation avancée](#utilisation-avancée)
5. [Intégration avec des API réelles](#intégration-avec-des-api-réelles)
6. [Exemples pratiques](#exemples-pratiques)
7. [Webhooks et notifications](#webhooks-et-notifications)

---

## 🎯 Introduction

Ce guide vous montre comment intégrer **AI Gold Master** dans vos propres applications de trading.

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration de base

### Exemple minimal

```javascript
const GoldAnalysisAI = require('./gold_analysis_ai');

const analyzer = new GoldAnalysisAI();
analyzer.start();
```

### Configuration avancée

```javascript
const analyzer = new GoldAnalysisAI({
    // Symbole à analyser
    symbol: 'XAUUSD',
    
    // Intervalle des bougies (1m, 5m, 15m, 1h, 4h, 1d)
    interval: '5m',
    
    // Fréquence de mise à jour en millisecondes
    updateFrequency: 30000,
    
    // Paramètres RSI
    rsiPeriod: 14,
    rsiOverbought: 70,
    rsiOversold: 30,
    
    // Paramètres EMA
    emaFast: 9,
    emaSlow: 21,
    emaTrend: 50,
    
    // Seuil minimum pour générer un signal
    signalThreshold: 3.0
});
```

## 🚀 Utilisation avancée

### Écouter les signaux

```javascript
analyzer.on('signal', (signal) => {
    console.log('Nouveau signal:', signal);
    
    // Structure du signal:
    // {
    //     timestamp: 1699790985000,
    //     symbol: 'XAUUSD',
    //     signal: 'ACHAT',  // 'ACHAT', 'VENTE', ou 'ATTENTE'
    //     strength: 5.5,
    //     buyScore: 5.5,
    //     sellScore: 1.0,
    //     reasons: ['RSI survendu (+1.5)', ...],
    //     price: 2045.32,
    //     indicators: { rsi, macd, emaFast, emaSlow, atr, volumeRatio },
    //     trend: 'HAUSSIÈRE'  // 'HAUSSIÈRE', 'BAISSIÈRE', 'NEUTRE'
    // }
});
```

### Gérer les erreurs

```javascript
analyzer.on('error', (error) => {
    console.error('Erreur:', error.message);
    // Implémenter votre logique de gestion d'erreur
});
```

### Contrôler l'analyse

```javascript
// Démarrer
analyzer.start();

// Arrêter
analyzer.stop();

// Vérifier si en cours
if (analyzer.isRunning) {
    console.log('Analyse en cours');
}
```

### Accéder aux données

```javascript
// Obtenir le dernier signal
const lastSignal = analyzer.getLastSignal();

// Obtenir les données de prix
const priceData = analyzer.getPriceData();

// Obtenir les indicateurs calculés
const indicators = analyzer.getIndicators();
```

## 🌐 Intégration avec des API réelles

### Option 1: Alpha Vantage (Gratuit)

```javascript
// 1. Installer axios si pas déjà fait
// npm install axios

// 2. Obtenir une clé API gratuite sur: https://www.alphavantage.co/support/#api-key

// 3. Modifier gold_analysis_ai.js, méthode fetchPriceData():

async fetchPriceData() {
    const API_KEY = 'VOTRE_CLE_API';
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=XAUUSD&interval=${this.config.interval}&apikey=${API_KEY}`;
    
    try {
        const response = await axios.get(url);
        const timeSeries = response.data[`Time Series (${this.config.interval})`];
        
        // Convertir au format interne
        Object.entries(timeSeries).forEach(([timestamp, data]) => {
            this.priceData.push({
                timestamp: new Date(timestamp).getTime(),
                open: parseFloat(data['1. open']),
                high: parseFloat(data['2. high']),
                low: parseFloat(data['3. low']),
                close: parseFloat(data['4. close']),
                volume: parseFloat(data['5. volume'])
            });
        });
        
        // Garder seulement les 100 dernières
        if (this.priceData.length > 100) {
            this.priceData = this.priceData.slice(-100);
        }
    } catch (error) {
        console.error('Erreur API Alpha Vantage:', error.message);
        throw error;
    }
}
```

### Option 2: Twelve Data

```javascript
// Documentation: https://twelvedata.com/docs

async fetchPriceData() {
    const API_KEY = 'VOTRE_CLE_API';
    const url = `https://api.twelvedata.com/time_series?symbol=XAUUSD&interval=${this.config.interval}&apikey=${API_KEY}&outputsize=100`;
    
    try {
        const response = await axios.get(url);
        const values = response.data.values;
        
        this.priceData = values.map(candle => ({
            timestamp: new Date(candle.datetime).getTime(),
            open: parseFloat(candle.open),
            high: parseFloat(candle.high),
            low: parseFloat(candle.low),
            close: parseFloat(candle.close),
            volume: parseFloat(candle.volume)
        }));
    } catch (error) {
        console.error('Erreur API Twelve Data:', error.message);
        throw error;
    }
}
```

### Option 3: Binance (Pour crypto avec or tokenisé)

```javascript
async fetchPriceData() {
    const url = `https://api.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=${this.config.interval}&limit=100`;
    
    try {
        const response = await axios.get(url);
        
        this.priceData = response.data.map(candle => ({
            timestamp: candle[0],
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5])
        }));
    } catch (error) {
        console.error('Erreur API Binance:', error.message);
        throw error;
    }
}
```

## 💡 Exemples pratiques

### 1. Calculer Stop-Loss et Take-Profit

```javascript
analyzer.on('signal', (signal) => {
    if (signal.signal === 'ACHAT') {
        const entry = signal.price;
        const atr = signal.indicators.atr;
        
        const stopLoss = entry - (atr * 2);      // 2 ATR en dessous
        const takeProfit1 = entry + (atr * 3);   // 3 ATR au-dessus
        const takeProfit2 = entry + (atr * 4);   // 4 ATR au-dessus
        
        console.log(`Entry: $${entry}`);
        console.log(`Stop-Loss: $${stopLoss}`);
        console.log(`TP1: $${takeProfit1}`);
        console.log(`TP2: $${takeProfit2}`);
    }
});
```

### 2. Enregistrer dans une base de données

```javascript
const mongoose = require('mongoose');

// Schema pour les signaux
const SignalSchema = new mongoose.Schema({
    timestamp: Date,
    symbol: String,
    signal: String,
    strength: Number,
    price: Number,
    indicators: Object
});

const Signal = mongoose.model('Signal', SignalSchema);

// Enregistrer chaque signal
analyzer.on('signal', async (signal) => {
    if (signal.signal !== 'ATTENTE') {
        const newSignal = new Signal(signal);
        await newSignal.save();
        console.log('Signal enregistré dans la DB');
    }
});
```

### 3. Envoyer une notification par email

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'votre.email@gmail.com',
        pass: 'votre_mot_de_passe'
    }
});

analyzer.on('signal', (signal) => {
    if (signal.signal === 'ACHAT' || signal.signal === 'VENTE') {
        const mailOptions = {
            from: 'votre.email@gmail.com',
            to: 'destination@example.com',
            subject: `🔔 Signal ${signal.signal} - AI Gold Master`,
            html: `
                <h2>Signal ${signal.signal} détecté!</h2>
                <p><strong>Prix:</strong> $${signal.price.toFixed(2)}</p>
                <p><strong>Force:</strong> ${signal.strength}/10</p>
                <p><strong>Tendance:</strong> ${signal.trend}</p>
                <h3>Raisons:</h3>
                <ul>
                    ${signal.reasons.map(r => `<li>${r}</li>`).join('')}
                </ul>
            `
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erreur email:', error);
            } else {
                console.log('Email envoyé:', info.response);
            }
        });
    }
});
```

### 4. Intégration Telegram Bot

```javascript
const TelegramBot = require('node-telegram-bot-api');

const token = 'VOTRE_TOKEN_BOT_TELEGRAM';
const chatId = 'VOTRE_CHAT_ID';
const bot = new TelegramBot(token, { polling: false });

analyzer.on('signal', (signal) => {
    if (signal.signal === 'ACHAT' || signal.signal === 'VENTE') {
        const emoji = signal.signal === 'ACHAT' ? '🟢' : '🔴';
        const message = `
${emoji} *Signal ${signal.signal}*

💰 Prix: $${signal.price.toFixed(2)}
💪 Force: ${signal.strength}/10
📈 Tendance: ${signal.trend}

*Indicateurs:*
• RSI: ${signal.indicators.rsi.toFixed(1)}
• MACD: ${signal.indicators.macd.toFixed(4)}

*Raisons:*
${signal.reasons.map(r => `✓ ${r}`).join('\n')}
        `;
        
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
});
```

### 5. Webhook pour Discord

```javascript
const axios = require('axios');

const DISCORD_WEBHOOK_URL = 'VOTRE_WEBHOOK_URL';

analyzer.on('signal', async (signal) => {
    if (signal.signal === 'ACHAT' || signal.signal === 'VENTE') {
        const color = signal.signal === 'ACHAT' ? 3066993 : 15158332; // Vert ou Rouge
        
        const embed = {
            embeds: [{
                title: `${signal.signal} Signal Detected!`,
                color: color,
                fields: [
                    { name: 'Prix', value: `$${signal.price.toFixed(2)}`, inline: true },
                    { name: 'Force', value: `${signal.strength}/10`, inline: true },
                    { name: 'Tendance', value: signal.trend, inline: true },
                    { name: 'RSI', value: signal.indicators.rsi.toFixed(1), inline: true },
                    { name: 'MACD', value: signal.indicators.macd.toFixed(4), inline: true },
                    { name: 'Raisons', value: signal.reasons.join('\n'), inline: false }
                ],
                timestamp: new Date(signal.timestamp).toISOString()
            }]
        };
        
        try {
            await axios.post(DISCORD_WEBHOOK_URL, embed);
            console.log('Notification Discord envoyée');
        } catch (error) {
            console.error('Erreur Discord:', error.message);
        }
    }
});
```

### 6. Trading automatique (avec prudence!)

```javascript
// ⚠️ ATTENTION: Ceci est un exemple éducatif
// Ne jamais trader automatiquement sans tests approfondis!

const ccxt = require('ccxt');

const exchange = new ccxt.binance({
    apiKey: 'VOTRE_API_KEY',
    secret: 'VOTRE_SECRET',
    enableRateLimit: true
});

analyzer.on('signal', async (signal) => {
    // Uniquement pour signaux très forts
    if (signal.strength >= 6.0) {
        try {
            if (signal.signal === 'ACHAT') {
                // Calculer la taille de position (exemple: 1% du capital)
                const balance = await exchange.fetchBalance();
                const capital = balance.USDT.free;
                const positionSize = capital * 0.01; // 1%
                
                // Calculer stop-loss et take-profit
                const entry = signal.price;
                const atr = signal.indicators.atr;
                const stopLoss = entry - (atr * 2);
                const takeProfit = entry + (atr * 3);
                
                // Passer l'ordre (SIMULATION SEULEMENT!)
                console.log('Ordre simulé:');
                console.log(`  Type: ACHAT`);
                console.log(`  Taille: ${positionSize} USDT`);
                console.log(`  Entry: ${entry}`);
                console.log(`  Stop-Loss: ${stopLoss}`);
                console.log(`  Take-Profit: ${takeProfit}`);
                
                // En production, décommenter:
                // const order = await exchange.createMarketBuyOrder('XAUUSD', positionSize / entry);
                // console.log('Ordre exécuté:', order);
            }
        } catch (error) {
            console.error('Erreur trading:', error.message);
        }
    }
});
```

## 🔐 Sécurité et Bonnes Pratiques

### Variables d'environnement

Utilisez un fichier `.env` pour les clés sensibles:

```bash
# .env
ALPHA_VANTAGE_API_KEY=votre_clé
TELEGRAM_BOT_TOKEN=votre_token
DISCORD_WEBHOOK=votre_webhook
EXCHANGE_API_KEY=votre_clé
EXCHANGE_SECRET=votre_secret
```

```javascript
// Charger les variables
require('dotenv').config();

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
```

### Gestion des erreurs robuste

```javascript
analyzer.on('error', (error) => {
    // Logger l'erreur
    console.error(`[${new Date().toISOString()}] Erreur:`, error);
    
    // Notifier l'administrateur
    sendAdminNotification(error);
    
    // Tentative de redémarrage automatique
    setTimeout(() => {
        console.log('Tentative de redémarrage...');
        analyzer.start();
    }, 60000); // Attendre 1 minute
});
```

### Rate Limiting

```javascript
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 secondes minimum entre requêtes

async function fetchPriceDataWithRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => 
            setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
        );
    }
    
    lastRequestTime = Date.now();
    return this.fetchPriceData();
}
```

## 📚 Ressources supplémentaires

- [Documentation Pine Script](https://www.tradingview.com/pine-script-docs/)
- [API Alpha Vantage](https://www.alphavantage.co/documentation/)
- [API Twelve Data](https://twelvedata.com/docs)
- [Node-Telegram-Bot-API](https://github.com/yagop/node-telegram-bot-api)
- [Nodemailer](https://nodemailer.com/)

## 🤝 Support

Pour toute question ou problème d'intégration, ouvrez une issue sur GitHub.

---

**Bon développement! 💻📈**
