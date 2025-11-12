const logger = require('../logger');

/**
 * Base class for all trading strategies
 */
class BaseStrategy {
    constructor(name) {
        this.name = name;
        this.signals = [];
        this.successRate = 0;
        this.totalSignals = 0;
    }

    /**
     * Analyze market data and generate signal
     * @param {Array} closingPrices - Array of historical closing prices
     * @param {Object} currentData - Current market data
     * @returns {Object} Signal object with action, confidence, and reason
     */
    analyze(closingPrices, currentData) {
        throw new Error('analyze() must be implemented by strategy subclass');
    }

    /**
     * Update strategy performance metrics
     */
    updatePerformance(wasSuccessful) {
        this.totalSignals++;
        if (wasSuccessful) {
            this.successRate = ((this.successRate * (this.totalSignals - 1)) + 1) / this.totalSignals;
        } else {
            this.successRate = (this.successRate * (this.totalSignals - 1)) / this.totalSignals;
        }
    }

    /**
     * Get strategy performance score (0-1)
     */
    getPerformanceScore() {
        return this.successRate;
    }

    /**
     * Create a signal object
     */
    createSignal(action, confidence, reason, indicators = {}) {
        return {
            strategy: this.name,
            action: action, // 'BUY', 'SELL', 'HOLD'
            confidence: confidence, // 0-1
            reason: reason,
            indicators: indicators,
            timestamp: Date.now()
        };
    }

    /**
     * Calculate Simple Moving Average
     */
    calculateSMA(prices, period) {
        if (prices.length < period) return null;
        
        const slice = prices.slice(-period);
        const sum = slice.reduce((a, b) => a + b, 0);
        return sum / period;
    }

    /**
     * Calculate Exponential Moving Average
     */
    calculateEMA(prices, period) {
        if (prices.length < period) return null;

        const multiplier = 2 / (period + 1);
        let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

        for (let i = period; i < prices.length; i++) {
            ema = (prices[i] - ema) * multiplier + ema;
        }

        return ema;
    }

    /**
     * Calculate Relative Strength Index (RSI)
     */
    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) return null;

        let gains = 0;
        let losses = 0;

        // Calculate initial average gain and loss
        for (let i = prices.length - period; i < prices.length; i++) {
            const change = prices[i] - prices[i - 1];
            if (change >= 0) {
                gains += change;
            } else {
                losses -= change;
            }
        }

        const avgGain = gains / period;
        const avgLoss = losses / period;

        if (avgLoss === 0) return 100;

        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        return rsi;
    }

    /**
     * Calculate MACD (Moving Average Convergence Divergence)
     */
    calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        if (prices.length < slowPeriod) return null;

        const fastEMA = this.calculateEMA(prices, fastPeriod);
        const slowEMA = this.calculateEMA(prices, slowPeriod);

        if (!fastEMA || !slowEMA) return null;

        const macdLine = fastEMA - slowEMA;

        return {
            macd: macdLine,
            signal: macdLine, // Simplified - should calculate EMA of MACD
            histogram: 0
        };
    }

    /**
     * Calculate Bollinger Bands
     */
    calculateBollingerBands(prices, period = 20, stdDevMultiplier = 2) {
        if (prices.length < period) return null;

        const sma = this.calculateSMA(prices, period);
        const slice = prices.slice(-period);
        
        const variance = slice.reduce((sum, price) => {
            return sum + Math.pow(price - sma, 2);
        }, 0) / period;
        
        const stdDev = Math.sqrt(variance);

        return {
            upper: sma + (stdDevMultiplier * stdDev),
            middle: sma,
            lower: sma - (stdDevMultiplier * stdDev)
        };
    }
}

module.exports = BaseStrategy;
