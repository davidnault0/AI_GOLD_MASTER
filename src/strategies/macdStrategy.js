const BaseStrategy = require('./baseStrategy');

/**
 * MACD Strategy
 * Generates signals based on MACD indicator
 */
class MACDStrategy extends BaseStrategy {
    constructor() {
        super('MACD Strategy');
        this.fastPeriod = 12;
        this.slowPeriod = 26;
        this.signalPeriod = 9;
    }

    analyze(closingPrices, currentData) {
        if (closingPrices.length < this.slowPeriod + 1) {
            return this.createSignal('HOLD', 0, 'Insufficient data for MACD calculation');
        }

        const macd = this.calculateMACD(closingPrices, this.fastPeriod, this.slowPeriod, this.signalPeriod);
        const prevMACD = this.calculateMACD(closingPrices.slice(0, -1), this.fastPeriod, this.slowPeriod, this.signalPeriod);
        
        if (!macd || !prevMACD) {
            return this.createSignal('HOLD', 0, 'Unable to calculate MACD');
        }

        const currentPrice = closingPrices[closingPrices.length - 1];

        // Bullish crossover: MACD crosses above signal line
        if (prevMACD.macd <= prevMACD.signal && macd.macd > macd.signal) {
            const crossoverStrength = Math.abs(macd.macd - macd.signal);
            const confidence = Math.min(0.9, 0.6 + crossoverStrength * 10);
            return this.createSignal(
                'BUY',
                confidence,
                `Bullish MACD crossover. MACD (${macd.macd.toFixed(4)}) crossed above Signal (${macd.signal.toFixed(4)})`,
                { macd: macd.macd, signal: macd.signal, currentPrice }
            );
        }

        // Bearish crossover: MACD crosses below signal line
        if (prevMACD.macd >= prevMACD.signal && macd.macd < macd.signal) {
            const crossoverStrength = Math.abs(macd.macd - macd.signal);
            const confidence = Math.min(0.9, 0.6 + crossoverStrength * 10);
            return this.createSignal(
                'SELL',
                confidence,
                `Bearish MACD crossover. MACD (${macd.macd.toFixed(4)}) crossed below Signal (${macd.signal.toFixed(4)})`,
                { macd: macd.macd, signal: macd.signal, currentPrice }
            );
        }

        // MACD above signal line (bullish momentum)
        if (macd.macd > macd.signal) {
            return this.createSignal('HOLD', 0.4, 'MACD above signal line - bullish momentum', { macd: macd.macd, signal: macd.signal });
        }

        // MACD below signal line (bearish momentum)
        if (macd.macd < macd.signal) {
            return this.createSignal('HOLD', 0.4, 'MACD below signal line - bearish momentum', { macd: macd.macd, signal: macd.signal });
        }

        return this.createSignal('HOLD', 0.3, 'No significant MACD signal', { macd: macd.macd, signal: macd.signal });
    }
}

module.exports = MACDStrategy;
