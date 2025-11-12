const BaseStrategy = require('./baseStrategy');

/**
 * SMA Crossover Strategy
 * Generates signals based on moving average crossovers
 */
class SMACrossoverStrategy extends BaseStrategy {
    constructor() {
        super('SMA Crossover');
        this.shortPeriod = 10;
        this.longPeriod = 30;
    }

    analyze(closingPrices, currentData) {
        if (closingPrices.length < this.longPeriod) {
            return this.createSignal('HOLD', 0, 'Insufficient data for analysis');
        }

        const shortSMA = this.calculateSMA(closingPrices, this.shortPeriod);
        const longSMA = this.calculateSMA(closingPrices, this.longPeriod);

        // Previous values for crossover detection
        const prevShortSMA = this.calculateSMA(closingPrices.slice(0, -1), this.shortPeriod);
        const prevLongSMA = this.calculateSMA(closingPrices.slice(0, -1), this.longPeriod);

        const currentPrice = closingPrices[closingPrices.length - 1];

        // Bullish crossover: short SMA crosses above long SMA
        if (prevShortSMA <= prevLongSMA && shortSMA > longSMA) {
            const confidence = Math.min(0.9, (shortSMA - longSMA) / longSMA + 0.5);
            return this.createSignal(
                'BUY',
                confidence,
                `Bullish SMA crossover detected. Short SMA (${shortSMA.toFixed(2)}) crossed above Long SMA (${longSMA.toFixed(2)})`,
                { shortSMA, longSMA, currentPrice }
            );
        }

        // Bearish crossover: short SMA crosses below long SMA
        if (prevShortSMA >= prevLongSMA && shortSMA < longSMA) {
            const confidence = Math.min(0.9, (longSMA - shortSMA) / longSMA + 0.5);
            return this.createSignal(
                'SELL',
                confidence,
                `Bearish SMA crossover detected. Short SMA (${shortSMA.toFixed(2)}) crossed below Long SMA (${longSMA.toFixed(2)})`,
                { shortSMA, longSMA, currentPrice }
            );
        }

        // No crossover
        return this.createSignal('HOLD', 0.3, 'No significant crossover detected', { shortSMA, longSMA });
    }
}

module.exports = SMACrossoverStrategy;
