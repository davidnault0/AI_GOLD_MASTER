const axios = require('axios');
const EventEmitter = require('events');

/**
 * Module d'analyse de l'or en temps réel
 * Récupère les données et génère des signaux de trading
 */
class GoldAnalysisAI extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            symbol: config.symbol || 'XAUUSD',
            interval: config.interval || '5m', // 1m, 5m, 15m, 1h, 4h, 1d
            updateFrequency: config.updateFrequency || 60000, // ms (1 minute par défaut)
            rsiPeriod: config.rsiPeriod || 14,
            rsiOverbought: config.rsiOverbought || 70,
            rsiOversold: config.rsiOversold || 30,
            emaFast: config.emaFast || 9,
            emaSlow: config.emaSlow || 21,
            emaTrend: config.emaTrend || 50,
            signalThreshold: config.signalThreshold || 3.0,
            ...config
        };
        
        this.priceData = [];
        this.indicators = {};
        this.currentSignal = null;
        this.isRunning = false;
        this.updateInterval = null;
    }

    /**
     * Démarre l'analyse en temps réel
     */
    start() {
        if (this.isRunning) {
            console.log('⚠️  L\'analyse est déjà en cours');
            return;
        }

        this.isRunning = true;
        console.log(`🚀 Démarrage de l'analyse en temps réel pour ${this.config.symbol}`);
        console.log(`📊 Intervalle: ${this.config.interval}`);
        console.log(`⏰ Mise à jour toutes les ${this.config.updateFrequency / 1000}s`);
        
        // Première analyse immédiate
        this.update();
        
        // Mise à jour périodique
        this.updateInterval = setInterval(() => {
            this.update();
        }, this.config.updateFrequency);
    }

    /**
     * Arrête l'analyse
     */
    stop() {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        console.log('⏹️  Analyse arrêtée');
    }

    /**
     * Met à jour les données et analyse
     */
    async update() {
        try {
            console.log(`\n⏳ Mise à jour des données (${new Date().toLocaleTimeString()})...`);
            
            // Récupérer les données de prix
            await this.fetchPriceData();
            
            // Calculer les indicateurs
            this.calculateIndicators();
            
            // Analyser et générer les signaux
            const signal = this.analyzeMarket();
            
            // Émettre le signal
            this.emit('signal', signal);
            this.currentSignal = signal;
            
            // Afficher le résultat
            this.displaySignal(signal);
            
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour:', error.message);
            this.emit('error', error);
        }
    }

    /**
     * Récupère les données de prix (simulation pour démo)
     * Dans une version production, connecter à une API réelle (Alpha Vantage, Twelve Data, etc.)
     */
    async fetchPriceData() {
        // SIMULATION: Génère des données aléatoires pour la démo
        // En production, remplacer par une vraie API comme:
        // - Alpha Vantage: https://www.alphavantage.co/
        // - Twelve Data: https://twelvedata.com/
        // - Polygon.io: https://polygon.io/
        
        const now = Date.now();
        const basePrice = 2000 + Math.random() * 100; // Prix de l'or autour de 2000-2100
        
        // Générer 100 bougies historiques
        if (this.priceData.length === 0) {
            for (let i = 100; i >= 0; i--) {
                const timestamp = now - (i * 5 * 60 * 1000); // 5 minutes par bougie
                const open = basePrice + (Math.random() - 0.5) * 20;
                const close = open + (Math.random() - 0.5) * 10;
                const high = Math.max(open, close) + Math.random() * 5;
                const low = Math.min(open, close) - Math.random() * 5;
                const volume = 1000 + Math.random() * 500;
                
                this.priceData.push({
                    timestamp,
                    open,
                    high,
                    low,
                    close,
                    volume
                });
            }
        } else {
            // Ajouter une nouvelle bougie
            const lastPrice = this.priceData[this.priceData.length - 1].close;
            const open = lastPrice;
            const close = open + (Math.random() - 0.5) * 5;
            const high = Math.max(open, close) + Math.random() * 2;
            const low = Math.min(open, close) - Math.random() * 2;
            const volume = 1000 + Math.random() * 500;
            
            this.priceData.push({
                timestamp: now,
                open,
                high,
                low,
                close,
                volume
            });
            
            // Garder seulement les 100 dernières bougies
            if (this.priceData.length > 100) {
                this.priceData.shift();
            }
        }
    }

    /**
     * Calcule les indicateurs techniques
     */
    calculateIndicators() {
        const closes = this.priceData.map(d => d.close);
        const highs = this.priceData.map(d => d.high);
        const lows = this.priceData.map(d => d.low);
        const volumes = this.priceData.map(d => d.volume);
        
        // RSI
        this.indicators.rsi = this.calculateRSI(closes, this.config.rsiPeriod);
        
        // EMAs
        this.indicators.emaFast = this.calculateEMA(closes, this.config.emaFast);
        this.indicators.emaSlow = this.calculateEMA(closes, this.config.emaSlow);
        this.indicators.emaTrend = this.calculateEMA(closes, this.config.emaTrend);
        
        // SMA
        this.indicators.sma200 = this.calculateSMA(closes, 50); // Simplifié à 50 pour démo
        
        // MACD
        const macd = this.calculateMACD(closes);
        this.indicators.macdLine = macd.macdLine;
        this.indicators.signalLine = macd.signalLine;
        this.indicators.macdHistogram = macd.histogram;
        
        // Bandes de Bollinger
        const bb = this.calculateBollingerBands(closes, 20, 2);
        this.indicators.bbUpper = bb.upper;
        this.indicators.bbMiddle = bb.middle;
        this.indicators.bbLower = bb.lower;
        
        // ATR
        this.indicators.atr = this.calculateATR(highs, lows, closes, 14);
        
        // Volume moyen
        this.indicators.volumeAvg = this.calculateSMA(volumes, 20);
        this.indicators.volumeRatio = volumes[volumes.length - 1] / this.indicators.volumeAvg;
        
        // Prix actuel
        this.indicators.currentPrice = closes[closes.length - 1];
    }

    /**
     * Analyse le marché et génère un signal
     */
    analyzeMarket() {
        let buyScore = 0;
        let sellScore = 0;
        const reasons = { buy: [], sell: [] };
        
        const currentPrice = this.indicators.currentPrice;
        const prevPrice = this.priceData[this.priceData.length - 2].close;
        
        // 1. Signal EMA Crossover (2 points)
        const emaCrossUp = this.indicators.emaFast > this.indicators.emaSlow && 
                          this.priceData[this.priceData.length - 2] && 
                          this.calculateEMA(this.priceData.slice(0, -1).map(d => d.close), this.config.emaFast) <=
                          this.calculateEMA(this.priceData.slice(0, -1).map(d => d.close), this.config.emaSlow);
        
        const emaCrossDown = this.indicators.emaFast < this.indicators.emaSlow && 
                            this.priceData[this.priceData.length - 2] &&
                            this.calculateEMA(this.priceData.slice(0, -1).map(d => d.close), this.config.emaFast) >=
                            this.calculateEMA(this.priceData.slice(0, -1).map(d => d.close), this.config.emaSlow);
        
        if (emaCrossUp) {
            buyScore += 2;
            reasons.buy.push('Croisement EMA haussier (+2)');
        }
        if (emaCrossDown) {
            sellScore += 2;
            reasons.sell.push('Croisement EMA baissier (+2)');
        }
        
        // 2. Signal RSI (1.5 points)
        if (this.indicators.rsi < this.config.rsiOversold) {
            buyScore += 1.5;
            reasons.buy.push(`RSI survendu (${this.indicators.rsi.toFixed(1)}) (+1.5)`);
        }
        if (this.indicators.rsi > this.config.rsiOverbought) {
            sellScore += 1.5;
            reasons.sell.push(`RSI suracheté (${this.indicators.rsi.toFixed(1)}) (+1.5)`);
        }
        
        // 3. Signal MACD (1.5 points)
        if (this.indicators.macdLine > this.indicators.signalLine && this.indicators.macdLine < 0) {
            buyScore += 1.5;
            reasons.buy.push('MACD croise signal à la hausse (+1.5)');
        }
        if (this.indicators.macdLine < this.indicators.signalLine && this.indicators.macdLine > 0) {
            sellScore += 1.5;
            reasons.sell.push('MACD croise signal à la baisse (+1.5)');
        }
        
        // 4. Signal Bandes de Bollinger (1 point)
        if (currentPrice < this.indicators.bbLower && currentPrice > prevPrice) {
            buyScore += 1;
            reasons.buy.push('Prix rebondit sur BB inférieure (+1)');
        }
        if (currentPrice > this.indicators.bbUpper && currentPrice < prevPrice) {
            sellScore += 1;
            reasons.sell.push('Prix rebondit sur BB supérieure (+1)');
        }
        
        // 5. Confirmation Tendance (2 points)
        const trendBullish = this.indicators.emaFast > this.indicators.emaSlow && 
                            this.indicators.emaSlow > this.indicators.emaTrend &&
                            currentPrice > this.indicators.emaTrend;
        const trendBearish = this.indicators.emaFast < this.indicators.emaSlow && 
                            this.indicators.emaSlow < this.indicators.emaTrend &&
                            currentPrice < this.indicators.emaTrend;
        
        if (trendBullish && currentPrice > this.indicators.sma200) {
            buyScore += 2;
            reasons.buy.push('Tendance haussière confirmée (+2)');
        }
        if (trendBearish && currentPrice < this.indicators.sma200) {
            sellScore += 2;
            reasons.sell.push('Tendance baissière confirmée (+2)');
        }
        
        // 6. Volume (1 point)
        if (this.indicators.volumeRatio > 1.2) {
            if (currentPrice > prevPrice) {
                buyScore += 1;
                reasons.buy.push('Volume élevé haussier (+1)');
            } else if (currentPrice < prevPrice) {
                sellScore += 1;
                reasons.sell.push('Volume élevé baissier (+1)');
            }
        }
        
        // Déterminer le signal
        let signalType = 'ATTENTE';
        let signalStrength = 0;
        let signalReasons = [];
        
        if (buyScore >= this.config.signalThreshold && buyScore > sellScore) {
            signalType = 'ACHAT';
            signalStrength = buyScore;
            signalReasons = reasons.buy;
        } else if (sellScore >= this.config.signalThreshold && sellScore > buyScore) {
            signalType = 'VENTE';
            signalStrength = sellScore;
            signalReasons = reasons.sell;
        }
        
        return {
            timestamp: Date.now(),
            symbol: this.config.symbol,
            signal: signalType,
            strength: signalStrength,
            buyScore,
            sellScore,
            reasons: signalReasons,
            price: currentPrice,
            indicators: {
                rsi: this.indicators.rsi,
                macd: this.indicators.macdLine,
                emaFast: this.indicators.emaFast,
                emaSlow: this.indicators.emaSlow,
                atr: this.indicators.atr,
                volumeRatio: this.indicators.volumeRatio
            },
            trend: trendBullish ? 'HAUSSIÈRE' : trendBearish ? 'BAISSIÈRE' : 'NEUTRE'
        };
    }

    /**
     * Affiche le signal de manière formatée
     */
    displaySignal(signal) {
        console.log('\n' + '='.repeat(70));
        console.log(`📊 ${signal.symbol} - ${new Date(signal.timestamp).toLocaleString()}`);
        console.log('='.repeat(70));
        
        // Signal principal
        const signalEmoji = signal.signal === 'ACHAT' ? '🟢' : signal.signal === 'VENTE' ? '🔴' : '⚪';
        const signalColor = signal.signal === 'ACHAT' ? '\x1b[32m' : signal.signal === 'VENTE' ? '\x1b[31m' : '\x1b[37m';
        console.log(`${signalEmoji} SIGNAL: ${signalColor}${signal.signal}\x1b[0m (Force: ${signal.strength.toFixed(1)}/10)`);
        
        // Prix et tendance
        console.log(`💰 Prix: $${signal.price.toFixed(2)}`);
        const trendEmoji = signal.trend === 'HAUSSIÈRE' ? '📈' : signal.trend === 'BAISSIÈRE' ? '📉' : '➡️';
        console.log(`${trendEmoji} Tendance: ${signal.trend}`);
        
        // Scores
        console.log(`\n📊 Score ACHAT: ${signal.buyScore.toFixed(1)} | Score VENTE: ${signal.sellScore.toFixed(1)}`);
        
        // Indicateurs
        console.log('\n📈 Indicateurs:');
        console.log(`   • RSI: ${signal.indicators.rsi.toFixed(1)}`);
        console.log(`   • MACD: ${signal.indicators.macd.toFixed(4)}`);
        console.log(`   • EMA 9: $${signal.indicators.emaFast.toFixed(2)}`);
        console.log(`   • EMA 21: $${signal.indicators.emaSlow.toFixed(2)}`);
        console.log(`   • ATR: ${signal.indicators.atr.toFixed(2)}`);
        console.log(`   • Volume Ratio: ${signal.indicators.volumeRatio.toFixed(2)}x`);
        
        // Raisons
        if (signal.reasons.length > 0) {
            console.log('\n💡 Raisons du signal:');
            signal.reasons.forEach(reason => {
                console.log(`   ✓ ${reason}`);
            });
        }
        
        console.log('='.repeat(70));
    }

    // ========================================================================
    // MÉTHODES DE CALCUL DES INDICATEURS
    // ========================================================================

    calculateSMA(data, period) {
        if (data.length < period) return data[data.length - 1];
        const slice = data.slice(-period);
        return slice.reduce((a, b) => a + b, 0) / period;
    }

    calculateEMA(data, period) {
        if (data.length === 0) return 0;
        if (data.length < period) return data[data.length - 1];
        
        const multiplier = 2 / (period + 1);
        let ema = this.calculateSMA(data.slice(0, period), period);
        
        for (let i = period; i < data.length; i++) {
            ema = (data[i] - ema) * multiplier + ema;
        }
        
        return ema;
    }

    calculateRSI(data, period) {
        if (data.length < period + 1) return 50;
        
        let gains = 0;
        let losses = 0;
        
        for (let i = data.length - period; i < data.length; i++) {
            const change = data[i] - data[i - 1];
            if (change > 0) {
                gains += change;
            } else {
                losses -= change;
            }
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        
        if (avgLoss === 0) return 100;
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }

    calculateMACD(data) {
        const ema12 = this.calculateEMA(data, 12);
        const ema26 = this.calculateEMA(data, 26);
        const macdLine = ema12 - ema26;
        
        // Calculer le signal (EMA 9 de la ligne MACD)
        // Simplifié pour la démo
        const signalLine = macdLine * 0.9;
        const histogram = macdLine - signalLine;
        
        return { macdLine, signalLine, histogram };
    }

    calculateBollingerBands(data, period, multiplier) {
        const sma = this.calculateSMA(data, period);
        
        if (data.length < period) {
            return { upper: sma, middle: sma, lower: sma };
        }
        
        const slice = data.slice(-period);
        const variance = slice.reduce((sum, value) => sum + Math.pow(value - sma, 2), 0) / period;
        const stdDev = Math.sqrt(variance);
        
        return {
            upper: sma + (stdDev * multiplier),
            middle: sma,
            lower: sma - (stdDev * multiplier)
        };
    }

    calculateATR(highs, lows, closes, period) {
        if (highs.length < period + 1) return 0;
        
        const trueRanges = [];
        for (let i = 1; i < highs.length; i++) {
            const tr = Math.max(
                highs[i] - lows[i],
                Math.abs(highs[i] - closes[i - 1]),
                Math.abs(lows[i] - closes[i - 1])
            );
            trueRanges.push(tr);
        }
        
        return this.calculateSMA(trueRanges, period);
    }

    /**
     * Obtient le dernier signal
     */
    getLastSignal() {
        return this.currentSignal;
    }

    /**
     * Obtient les données de prix
     */
    getPriceData() {
        return this.priceData;
    }

    /**
     * Obtient les indicateurs calculés
     */
    getIndicators() {
        return this.indicators;
    }
}

module.exports = GoldAnalysisAI;
