const BaseStrategy = require('./baseStrategy');

/**
 * Gold-Optimized Trend-Pullback Strategy
 * Based on professional gold trading research (2025)
 * 
 * This strategy combines:
 * - 50-period MA trend filter (only trade with the trend)
 * - RSI pullback detection (oversold recovery in uptrend)
 * - ATR-based volatility adjustment
 * - Multiple timeframe confirmation
 * 
 * Research shows this is the most effective strategy for XAU/USD trading
 * Sources: MasterFunders, GoldPipHub, Forex GDP professional analysis
 */
class GoldOptimizedStrategy extends BaseStrategy {
    constructor() {
        super('Gold-Optimized Trend-Pullback');
        
        // Strategy parameters based on professional research
        this.trendFilterPeriod = 50;      // 50-MA for trend confirmation
        this.rsiPeriod = 14;               // Standard RSI period
        this.rsiOversoldLevel = 40;        // Entry threshold for uptrend pullbacks
        this.rsiOverboughtLevel = 60;      // Exit threshold for downtrend rallies
        this.atrPeriod = 10;               // ATR for volatility measurement
        this.atrHighVolThreshold = 30;     // High volatility threshold
        this.shortMAPeriod = 20;           // Short-term MA for momentum
        this.emaFastPeriod = 12;           // Fast EMA for momentum confirmation
        this.emaSlowPeriod = 26;           // Slow EMA for momentum confirmation
    }

    analyze(closingPrices, currentData) {
        if (closingPrices.length < this.trendFilterPeriod + 1) {
            return this.createSignal('HOLD', 0, 'Insufficient data for Gold-Optimized analysis');
        }

        const currentPrice = closingPrices[closingPrices.length - 1];
        
        // 1. Calculate trend filter (50-MA)
        const trendMA = this.calculateSMA(closingPrices, this.trendFilterPeriod);
        const shortMA = this.calculateSMA(closingPrices, this.shortMAPeriod);
        
        // 2. Calculate RSI
        const rsi = this.calculateRSI(closingPrices, this.rsiPeriod);
        const prevRSI = this.calculateRSI(closingPrices.slice(0, -1), this.rsiPeriod);
        
        // 3. Calculate ATR for volatility adjustment
        const atr = this.calculateATR(closingPrices, this.atrPeriod);
        
        // 4. Calculate EMA for momentum
        const fastEMA = this.calculateEMA(closingPrices, this.emaFastPeriod);
        const slowEMA = this.calculateEMA(closingPrices, this.emaSlowPeriod);
        
        // 5. Determine market structure
        const isInUptrend = currentPrice > trendMA;
        const isInDowntrend = currentPrice < trendMA;
        const trendStrength = Math.abs((currentPrice - trendMA) / trendMA) * 100;
        
        // 6. Volatility adjustment factor
        const isHighVolatility = atr > this.atrHighVolThreshold;
        const volatilityAdjustment = isHighVolatility ? 0.85 : 1.0;
        
        // 7. Momentum confirmation
        const isBullishMomentum = fastEMA > slowEMA;
        const isBearishMomentum = fastEMA < slowEMA;
        const momentumStrength = Math.abs((fastEMA - slowEMA) / slowEMA) * 100;

        // === BULLISH SETUP: Trend-Plus-Pullback LONG ===
        // Conditions: Price above 50-MA + RSI recovering from oversold
        if (isInUptrend && prevRSI < this.rsiOversoldLevel && rsi >= this.rsiOversoldLevel) {
            // RSI is recovering from oversold in an uptrend - Strong buy signal
            let confidence = 0.75;
            
            // Boost confidence with additional confirmations
            if (isBullishMomentum) confidence += 0.08;
            if (shortMA > trendMA) confidence += 0.05; // Short-term momentum
            if (trendStrength > 2) confidence += 0.07; // Strong trend
            if (!isHighVolatility) confidence += 0.05; // Lower risk in calm markets
            
            // Apply volatility adjustment
            confidence *= volatilityAdjustment;
            confidence = Math.min(0.95, confidence);
            
            return this.createSignal(
                'BUY',
                confidence,
                `🎯 GOLD OPTIMIZED: Trend-Pullback BUY. Price above 50-MA ($${trendMA.toFixed(2)}), RSI recovering from oversold (${prevRSI.toFixed(1)} → ${rsi.toFixed(1)}). ` +
                `Momentum: ${isBullishMomentum ? 'Bullish' : 'Neutral'}. Volatility: ${isHighVolatility ? 'High' : 'Normal'}.`,
                {
                    currentPrice,
                    trendMA: trendMA.toFixed(2),
                    rsi: rsi.toFixed(2),
                    prevRSI: prevRSI.toFixed(2),
                    atr: atr.toFixed(2),
                    trendStrength: trendStrength.toFixed(2),
                    momentumStrength: momentumStrength.toFixed(2),
                    fastEMA: fastEMA.toFixed(2),
                    slowEMA: slowEMA.toFixed(2)
                }
            );
        }

        // === BEARISH SETUP: Trend-Plus-Rally SHORT ===
        // Conditions: Price below 50-MA + RSI failing from overbought
        if (isInDowntrend && prevRSI > this.rsiOverboughtLevel && rsi <= this.rsiOverboughtLevel) {
            // RSI is failing from overbought in a downtrend - Strong sell signal
            let confidence = 0.75;
            
            // Boost confidence with additional confirmations
            if (isBearishMomentum) confidence += 0.08;
            if (shortMA < trendMA) confidence += 0.05;
            if (trendStrength > 2) confidence += 0.07;
            if (!isHighVolatility) confidence += 0.05;
            
            // Apply volatility adjustment
            confidence *= volatilityAdjustment;
            confidence = Math.min(0.95, confidence);
            
            return this.createSignal(
                'SELL',
                confidence,
                `🎯 GOLD OPTIMIZED: Trend-Rally SELL. Price below 50-MA ($${trendMA.toFixed(2)}), RSI failing from overbought (${prevRSI.toFixed(1)} → ${rsi.toFixed(1)}). ` +
                `Momentum: ${isBearishMomentum ? 'Bearish' : 'Neutral'}. Volatility: ${isHighVolatility ? 'High' : 'Normal'}.`,
                {
                    currentPrice,
                    trendMA: trendMA.toFixed(2),
                    rsi: rsi.toFixed(2),
                    prevRSI: prevRSI.toFixed(2),
                    atr: atr.toFixed(2),
                    trendStrength: trendStrength.toFixed(2),
                    momentumStrength: momentumStrength.toFixed(2),
                    fastEMA: fastEMA.toFixed(2),
                    slowEMA: slowEMA.toFixed(2)
                }
            );
        }

        // === CONTINUATION SIGNALS ===
        // Strong uptrend with RSI in healthy range
        if (isInUptrend && rsi > 45 && rsi < 70 && isBullishMomentum && trendStrength > 2) {
            const confidence = Math.min(0.72, 0.60 + (trendStrength / 100) + (momentumStrength / 100));
            
            return this.createSignal(
                'BUY',
                confidence,
                `📈 GOLD: Strong uptrend continuation. Price $${currentPrice.toFixed(2)} above 50-MA $${trendMA.toFixed(2)}. RSI healthy at ${rsi.toFixed(1)}.`,
                {
                    currentPrice,
                    trendMA: trendMA.toFixed(2),
                    rsi: rsi.toFixed(2),
                    trendStrength: trendStrength.toFixed(2)
                }
            );
        }

        // Strong downtrend with RSI in healthy range
        if (isInDowntrend && rsi < 55 && rsi > 30 && isBearishMomentum && trendStrength > 2) {
            const confidence = Math.min(0.72, 0.60 + (trendStrength / 100) + (momentumStrength / 100));
            
            return this.createSignal(
                'SELL',
                confidence,
                `📉 GOLD: Strong downtrend continuation. Price $${currentPrice.toFixed(2)} below 50-MA $${trendMA.toFixed(2)}. RSI healthy at ${rsi.toFixed(1)}.`,
                {
                    currentPrice,
                    trendMA: trendMA.toFixed(2),
                    rsi: rsi.toFixed(2),
                    trendStrength: trendStrength.toFixed(2)
                }
            );
        }

        // No clear signal - waiting for better setup
        return this.createSignal(
            'HOLD',
            0.35,
            `⏸️ GOLD: Waiting for optimal entry. Price: $${currentPrice.toFixed(2)}, 50-MA: $${trendMA.toFixed(2)}, RSI: ${rsi.toFixed(1)}`,
            {
                currentPrice,
                trendMA: trendMA.toFixed(2),
                rsi: rsi.toFixed(2),
                atr: atr.toFixed(2)
            }
        );
    }

    /**
     * Calculate Average True Range (ATR) for volatility measurement
     */
    calculateATR(prices, period = 14) {
        if (prices.length < period + 1) return 0;

        const trueRanges = [];
        
        for (let i = 1; i < prices.length; i++) {
            const high = prices[i];
            const low = prices[i];
            const prevClose = prices[i - 1];
            
            // True Range = max(high-low, |high-prevClose|, |low-prevClose|)
            const tr = Math.max(
                Math.abs(high - low),
                Math.abs(high - prevClose),
                Math.abs(low - prevClose)
            );
            trueRanges.push(tr);
        }

        // ATR is the average of true ranges
        const recentTR = trueRanges.slice(-period);
        const atr = recentTR.reduce((sum, tr) => sum + tr, 0) / recentTR.length;
        
        return atr;
    }
}

module.exports = GoldOptimizedStrategy;
