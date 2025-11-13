/**
 * Analyseur de Marché en Temps Réel avec IA
 * Connecte aux données boursières et génère des signaux d'achat/vente
 */

const AIModelManager = require('./ai-integration');
const EventEmitter = require('events');

class RealTimeMarketAnalyzer extends EventEmitter {
    constructor(config = {}) {
        super();
        
        // Configuration
        this.symbol = config.symbol || 'BTC/USD';
        this.updateInterval = config.updateInterval || 1000; // 1 seconde
        this.aiModel = config.aiModel || 'gpt-4o'; // ou 'qwen-3'
        this.dataProvider = config.dataProvider || 'binance'; // binance, coinbase, alpaca, etc.
        
        // Initialisation de l'IA
        this.ai = new AIModelManager(this.aiModel);
        
        // État du marché
        this.currentPrice = null;
        this.priceHistory = [];
        this.indicators = {};
        this.lastSignal = null;
        this.isRunning = false;
        
        // Stratégies de trading
        this.strategies = {
            rsi: { enabled: true, period: 14, oversold: 30, overbought: 70 },
            macd: { enabled: true, fast: 12, slow: 26, signal: 9 },
            movingAverage: { enabled: true, shortPeriod: 50, longPeriod: 200 },
            volumeAnalysis: { enabled: true },
            aiAnalysis: { enabled: true, confidence: 0.7 }
        };
        
        console.log(`🤖 Analyseur de marché initialisé pour ${this.symbol}`);
        console.log(`📊 Modèle IA: ${this.aiModel}`);
        console.log(`⏱️  Fréquence d'analyse: ${this.updateInterval}ms`);
    }

    /**
     * Démarrer l'analyse en temps réel
     */
    async start() {
        if (this.isRunning) {
            console.log('⚠️  L\'analyseur est déjà en cours d\'exécution');
            return;
        }

        this.isRunning = true;
        console.log(`\n🚀 Démarrage de l'analyse en temps réel pour ${this.symbol}\n`);
        
        // Boucle principale d'analyse
        this.analysisLoop = setInterval(async () => {
            try {
                await this.analyzeMarket();
            } catch (error) {
                console.error('❌ Erreur lors de l\'analyse:', error.message);
            }
        }, this.updateInterval);

        this.emit('started', { symbol: this.symbol, model: this.aiModel });
    }

    /**
     * Arrêter l'analyse
     */
    stop() {
        if (!this.isRunning) {
            return;
        }

        clearInterval(this.analysisLoop);
        this.isRunning = false;
        console.log('\n🛑 Analyse arrêtée');
        
        this.emit('stopped');
    }

    /**
     * Obtenir les données de marché en temps réel
     */
    async fetchMarketData() {
        // Dans un environnement réel, connectez-vous à une API de marché
        // Exemples: Binance, Coinbase, Alpha Vantage, Polygon.io, etc.
        
        // Pour la démonstration, nous simulons des données
        const timestamp = Date.now();
        const basePrice = 50000; // Prix de base pour BTC
        const volatility = 100;
        
        // Simuler des variations de prix réalistes
        const randomChange = (Math.random() - 0.5) * volatility;
        const trend = Math.sin(timestamp / 10000) * 500; // Tendance sinusoïdale
        
        const price = basePrice + trend + randomChange;
        const volume = 1000 + Math.random() * 500;
        
        return {
            symbol: this.symbol,
            price: price,
            timestamp: timestamp,
            volume: volume,
            bid: price - 0.5,
            ask: price + 0.5,
            high24h: price * 1.02,
            low24h: price * 0.98,
            change24h: (Math.random() - 0.5) * 5
        };
    }

    /**
     * Calculer les indicateurs techniques
     */
    calculateIndicators(priceData) {
        const prices = this.priceHistory.map(d => d.price);
        const volumes = this.priceHistory.map(d => d.volume);
        
        if (prices.length < 2) {
            return {};
        }

        const indicators = {};
        
        // RSI (Relative Strength Index)
        if (this.strategies.rsi.enabled && prices.length >= this.strategies.rsi.period) {
            indicators.rsi = this.calculateRSI(prices, this.strategies.rsi.period);
        }
        
        // MACD (Moving Average Convergence Divergence)
        if (this.strategies.macd.enabled && prices.length >= this.strategies.macd.slow) {
            indicators.macd = this.calculateMACD(prices);
        }
        
        // Moving Averages
        if (this.strategies.movingAverage.enabled) {
            if (prices.length >= this.strategies.movingAverage.shortPeriod) {
                indicators.sma50 = this.calculateSMA(prices, this.strategies.movingAverage.shortPeriod);
            }
            if (prices.length >= this.strategies.movingAverage.longPeriod) {
                indicators.sma200 = this.calculateSMA(prices, this.strategies.movingAverage.longPeriod);
            }
        }
        
        // Volume Analysis
        if (this.strategies.volumeAnalysis.enabled && volumes.length >= 20) {
            indicators.volumeTrend = this.analyzeVolume(volumes);
        }
        
        // Momentum
        indicators.momentum = this.calculateMomentum(prices, 10);
        
        return indicators;
    }

    /**
     * Calculer RSI
     */
    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) return null;
        
        const changes = [];
        for (let i = 1; i < prices.length; i++) {
            changes.push(prices[i] - prices[i - 1]);
        }
        
        const gains = changes.slice(-period).filter(c => c > 0);
        const losses = changes.slice(-period).filter(c => c < 0).map(Math.abs);
        
        const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0;
        const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0;
        
        if (avgLoss === 0) return 100;
        
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        
        return rsi;
    }

    /**
     * Calculer MACD
     */
    calculateMACD(prices) {
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        
        if (!ema12 || !ema26) return null;
        
        const macdLine = ema12 - ema26;
        
        return {
            macdLine: macdLine,
            signal: macdLine * 0.9, // Simplifié
            histogram: macdLine * 0.1
        };
    }

    /**
     * Calculer SMA (Simple Moving Average)
     */
    calculateSMA(prices, period) {
        if (prices.length < period) return null;
        
        const relevantPrices = prices.slice(-period);
        return relevantPrices.reduce((a, b) => a + b, 0) / period;
    }

    /**
     * Calculer EMA (Exponential Moving Average)
     */
    calculateEMA(prices, period) {
        if (prices.length < period) return null;
        
        const k = 2 / (period + 1);
        let ema = prices[0];
        
        for (let i = 1; i < prices.length; i++) {
            ema = prices[i] * k + ema * (1 - k);
        }
        
        return ema;
    }

    /**
     * Calculer le momentum
     */
    calculateMomentum(prices, period = 10) {
        if (prices.length < period + 1) return 0;
        
        const currentPrice = prices[prices.length - 1];
        const pastPrice = prices[prices.length - 1 - period];
        
        return ((currentPrice - pastPrice) / pastPrice) * 100;
    }

    /**
     * Analyser le volume
     */
    analyzeVolume(volumes) {
        if (volumes.length < 20) return 'NEUTRAL';
        
        const recentVolume = volumes.slice(-10).reduce((a, b) => a + b, 0) / 10;
        const pastVolume = volumes.slice(-20, -10).reduce((a, b) => a + b, 0) / 10;
        
        const volumeChange = ((recentVolume - pastVolume) / pastVolume) * 100;
        
        if (volumeChange > 20) return 'INCREASING';
        if (volumeChange < -20) return 'DECREASING';
        return 'STABLE';
    }

    /**
     * Analyser le marché avec l'IA
     */
    async analyzeWithAI(marketData, indicators) {
        const prompt = this.buildAnalysisPrompt(marketData, indicators);
        
        try {
            // Utiliser l'IA pour l'analyse (simulé pour la démo)
            // En production, ceci ferait un vrai appel API
            const aiResponse = await this.ai.callGPT4o(prompt);
            
            // Parser la réponse de l'IA
            return this.parseAIResponse(aiResponse);
        } catch (error) {
            console.error('Erreur lors de l\'analyse IA:', error.message);
            return null;
        }
    }

    /**
     * Construire le prompt pour l'IA
     */
    buildAnalysisPrompt(marketData, indicators) {
        return `Analyse ce marché et fournis un signal de trading:

Symbole: ${marketData.symbol}
Prix actuel: $${marketData.price.toFixed(2)}
Changement 24h: ${marketData.change24h.toFixed(2)}%

Indicateurs techniques:
- RSI: ${indicators.rsi?.toFixed(2) || 'N/A'}
- MACD: ${indicators.macd ? indicators.macd.macdLine.toFixed(2) : 'N/A'}
- SMA50: ${indicators.sma50?.toFixed(2) || 'N/A'}
- SMA200: ${indicators.sma200?.toFixed(2) || 'N/A'}
- Momentum: ${indicators.momentum?.toFixed(2) || 'N/A'}%
- Volume: ${indicators.volumeTrend || 'N/A'}

Fournis un signal (BUY/SELL/HOLD) avec:
1. Signal: [BUY/SELL/HOLD]
2. Confiance: [0-100]%
3. Raison: [brève explication]
4. Prix cible: [si applicable]
5. Stop loss: [si applicable]`;
    }

    /**
     * Parser la réponse de l'IA
     */
    parseAIResponse(aiResponse) {
        // Simulation d'une réponse parsée
        // En production, parser la vraie réponse de l'IA
        return {
            signal: 'BUY', // BUY, SELL, or HOLD
            confidence: 75,
            reason: 'RSI oversold, MACD bullish crossover',
            targetPrice: this.currentPrice * 1.05,
            stopLoss: this.currentPrice * 0.98
        };
    }

    /**
     * Générer un signal de trading basé sur les stratégies
     */
    generateTradingSignal(indicators) {
        const signals = [];
        let totalWeight = 0;
        
        // Signal RSI
        if (indicators.rsi) {
            if (indicators.rsi < this.strategies.rsi.oversold) {
                signals.push({ type: 'BUY', weight: 2, reason: 'RSI survendu' });
                totalWeight += 2;
            } else if (indicators.rsi > this.strategies.rsi.overbought) {
                signals.push({ type: 'SELL', weight: 2, reason: 'RSI suracheté' });
                totalWeight += 2;
            }
        }
        
        // Signal MACD
        if (indicators.macd) {
            if (indicators.macd.histogram > 0) {
                signals.push({ type: 'BUY', weight: 1.5, reason: 'MACD haussier' });
                totalWeight += 1.5;
            } else {
                signals.push({ type: 'SELL', weight: 1.5, reason: 'MACD baissier' });
                totalWeight += 1.5;
            }
        }
        
        // Signal Moving Average
        if (indicators.sma50 && indicators.sma200) {
            if (indicators.sma50 > indicators.sma200) {
                signals.push({ type: 'BUY', weight: 1, reason: 'Croix dorée (MA)' });
                totalWeight += 1;
            } else {
                signals.push({ type: 'SELL', weight: 1, reason: 'Croix de la mort (MA)' });
                totalWeight += 1;
            }
        }
        
        // Signal Momentum
        if (indicators.momentum) {
            if (indicators.momentum > 5) {
                signals.push({ type: 'BUY', weight: 1, reason: 'Momentum fort positif' });
                totalWeight += 1;
            } else if (indicators.momentum < -5) {
                signals.push({ type: 'SELL', weight: 1, reason: 'Momentum fort négatif' });
                totalWeight += 1;
            }
        }
        
        // Calculer le signal global
        const buyWeight = signals.filter(s => s.type === 'BUY').reduce((sum, s) => sum + s.weight, 0);
        const sellWeight = signals.filter(s => s.type === 'SELL').reduce((sum, s) => sum + s.weight, 0);
        
        let finalSignal = 'HOLD';
        let confidence = 50;
        
        if (buyWeight > sellWeight && buyWeight / totalWeight > 0.6) {
            finalSignal = 'BUY';
            confidence = Math.min(95, (buyWeight / totalWeight) * 100);
        } else if (sellWeight > buyWeight && sellWeight / totalWeight > 0.6) {
            finalSignal = 'SELL';
            confidence = Math.min(95, (sellWeight / totalWeight) * 100);
        }
        
        return {
            signal: finalSignal,
            confidence: confidence,
            reasons: signals,
            timestamp: Date.now()
        };
    }

    /**
     * Analyser le marché (boucle principale)
     */
    async analyzeMarket() {
        // 1. Obtenir les données de marché
        const marketData = await this.fetchMarketData();
        this.currentPrice = marketData.price;
        
        // 2. Ajouter à l'historique (garder 300 derniers points)
        this.priceHistory.push(marketData);
        if (this.priceHistory.length > 300) {
            this.priceHistory.shift();
        }
        
        // 3. Calculer les indicateurs
        this.indicators = this.calculateIndicators(marketData);
        
        // 4. Générer le signal de trading
        const signal = this.generateTradingSignal(this.indicators);
        
        // 5. Analyser avec l'IA si activé
        if (this.strategies.aiAnalysis.enabled && signal.confidence > 60) {
            // L'analyse IA peut être faite de manière asynchrone pour certains signaux
            // pour ne pas ralentir le flux en temps réel
        }
        
        // 6. Émettre le signal si changement significatif
        if (this.shouldEmitSignal(signal)) {
            this.lastSignal = signal;
            this.emitTradingSignal(marketData, signal);
        }
        
        // 7. Afficher le statut
        this.displayStatus(marketData, this.indicators, signal);
    }

    /**
     * Vérifier si on doit émettre un nouveau signal
     */
    shouldEmitSignal(newSignal) {
        if (!this.lastSignal) return true;
        
        // Émettre si le signal change
        if (newSignal.signal !== this.lastSignal.signal) return true;
        
        // Émettre si la confiance augmente significativement
        if (newSignal.confidence > this.lastSignal.confidence + 10) return true;
        
        return false;
    }

    /**
     * Émettre un signal de trading
     */
    emitTradingSignal(marketData, signal) {
        const tradingSignal = {
            symbol: this.symbol,
            signal: signal.signal,
            confidence: signal.confidence,
            price: marketData.price,
            timestamp: new Date().toISOString(),
            indicators: this.indicators,
            reasons: signal.reasons
        };
        
        console.log('\n' + '='.repeat(60));
        console.log(`🔔 SIGNAL DE TRADING - ${signal.signal}`);
        console.log('='.repeat(60));
        console.log(`💰 Prix: $${marketData.price.toFixed(2)}`);
        console.log(`📊 Confiance: ${signal.confidence.toFixed(1)}%`);
        console.log(`📝 Raisons:`);
        signal.reasons.forEach(r => {
            console.log(`   - ${r.type}: ${r.reason} (poids: ${r.weight})`);
        });
        console.log('='.repeat(60) + '\n');
        
        this.emit('signal', tradingSignal);
    }

    /**
     * Afficher le statut actuel
     */
    displayStatus(marketData, indicators, signal) {
        // Afficher toutes les 10 secondes pour ne pas surcharger la console
        if (Date.now() % 10000 < this.updateInterval) {
            console.log(`[${new Date().toLocaleTimeString()}] ${this.symbol}: $${marketData.price.toFixed(2)} | ` +
                       `RSI: ${indicators.rsi?.toFixed(1) || 'N/A'} | ` +
                       `Signal: ${signal.signal} (${signal.confidence.toFixed(0)}%)`);
        }
    }
}

// Exemple d'utilisation
if (require.main === module) {
    const analyzer = new RealTimeMarketAnalyzer({
        symbol: 'BTC/USD',
        updateInterval: 1000, // Analyser toutes les secondes
        aiModel: 'gpt-4o' // ou 'qwen-3' pour analyse locale
    });

    // Écouter les signaux
    analyzer.on('signal', (signal) => {
        console.log('📨 Nouveau signal reçu:', JSON.stringify(signal, null, 2));
        
        // Ici, vous pourriez:
        // 1. Envoyer une notification
        // 2. Exécuter un ordre automatiquement
        // 3. Enregistrer dans une base de données
        // 4. Envoyer à un bot Telegram/Discord
    });

    // Démarrer l'analyse
    analyzer.start();

    // Arrêter après 60 secondes (pour démo)
    setTimeout(() => {
        analyzer.stop();
        console.log('\n✅ Démonstration terminée');
        process.exit(0);
    }, 60000);
}

module.exports = RealTimeMarketAnalyzer;
