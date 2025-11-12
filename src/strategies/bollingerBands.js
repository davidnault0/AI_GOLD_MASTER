const BaseStrategy = require('./baseStrategy');

/**
 * Bollinger Bands Strategy
 * Generates signals based on price interaction with Bollinger Bands
 */
class BollingerBandsStrategy extends BaseStrategy {
    constructor() {
        super('Bollinger Bands');
        this.period = 20;
        this.stdDevMultiplier = 2;
    }

    analyze(closingPrices, currentData) {
        if (closingPrices.length < this.period) {
            return this.createSignal('HOLD', 0, 'Insufficient data for Bollinger Bands calculation');
        }

        const bands = this.calculateBollingerBands(closingPrices, this.period, this.stdDevMultiplier);
        const currentPrice = closingPrices[closingPrices.length - 1];
        const prevPrice = closingPrices[closingPrices.length - 2];

        // Price bouncing off lower band - buy signal
        if (prevPrice <= bands.lower && currentPrice > bands.lower) {
            const distanceFromLower = ((currentPrice - bands.lower) / bands.lower) * 100;
            const confidence = Math.min(0.9, 0.7 + (1 - distanceFromLower / 5));
            return this.createSignal(
                'BUY',
                confidence,
                `Price bouncing off lower Bollinger Band. Current: ${currentPrice.toFixed(2)}, Lower Band: ${bands.lower.toFixed(2)}`,
                { currentPrice, ...bands }
            );
        }

        // Price touching or below lower band - strong buy
        if (currentPrice <= bands.lower) {
            const distanceBelow = ((bands.lower - currentPrice) / bands.lower) * 100;
            const confidence = Math.min(0.95, 0.75 + distanceBelow / 10);
            return this.createSignal(
                'BUY',
                confidence,
                `Price below lower Bollinger Band. Oversold condition. Current: ${currentPrice.toFixed(2)}, Lower Band: ${bands.lower.toFixed(2)}`,
                { currentPrice, ...bands }
            );
        }

        // Price bouncing off upper band - sell signal
        if (prevPrice >= bands.upper && currentPrice < bands.upper) {
            const distanceFromUpper = ((bands.upper - currentPrice) / bands.upper) * 100;
            const confidence = Math.min(0.9, 0.7 + (1 - distanceFromUpper / 5));
            return this.createSignal(
                'SELL',
                confidence,
                `Price bouncing off upper Bollinger Band. Current: ${currentPrice.toFixed(2)}, Upper Band: ${bands.upper.toFixed(2)}`,
                { currentPrice, ...bands }
            );
        }

        // Price touching or above upper band - strong sell
        if (currentPrice >= bands.upper) {
            const distanceAbove = ((currentPrice - bands.upper) / bands.upper) * 100;
            const confidence = Math.min(0.95, 0.75 + distanceAbove / 10);
            return this.createSignal(
                'SELL',
                confidence,
                `Price above upper Bollinger Band. Overbought condition. Current: ${currentPrice.toFixed(2)}, Upper Band: ${bands.upper.toFixed(2)}`,
                { currentPrice, ...bands }
            );
        }

        // Price in middle zone
        return this.createSignal('HOLD', 0.3, 'Price within Bollinger Bands range', { currentPrice, ...bands });
    }
}

module.exports = BollingerBandsStrategy;
