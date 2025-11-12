const BaseStrategy = require('./baseStrategy');

/**
 * RSI Strategy
 * Generates signals based on Relative Strength Index
 */
class RSIStrategy extends BaseStrategy {
    constructor() {
        super('RSI Strategy');
        this.period = 14;
        this.oversoldThreshold = 30;
        this.overboughtThreshold = 70;
    }

    analyze(closingPrices, currentData) {
        if (closingPrices.length < this.period + 1) {
            return this.createSignal('HOLD', 0, 'Insufficient data for RSI calculation');
        }

        const rsi = this.calculateRSI(closingPrices, this.period);
        const currentPrice = closingPrices[closingPrices.length - 1];

        // Oversold condition - potential buy signal
        if (rsi < this.oversoldThreshold) {
            const confidence = Math.min(0.95, (this.oversoldThreshold - rsi) / this.oversoldThreshold + 0.5);
            return this.createSignal(
                'BUY',
                confidence,
                `RSI indicates oversold conditions (${rsi.toFixed(2)}). Strong buy signal.`,
                { rsi, currentPrice }
            );
        }

        // Overbought condition - potential sell signal
        if (rsi > this.overboughtThreshold) {
            const confidence = Math.min(0.95, (rsi - this.overboughtThreshold) / (100 - this.overboughtThreshold) + 0.5);
            return this.createSignal(
                'SELL',
                confidence,
                `RSI indicates overbought conditions (${rsi.toFixed(2)}). Strong sell signal.`,
                { rsi, currentPrice }
            );
        }

        // Neutral zone
        return this.createSignal('HOLD', 0.4, `RSI in neutral zone (${rsi.toFixed(2)})`, { rsi });
    }
}

module.exports = RSIStrategy;
