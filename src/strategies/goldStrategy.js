/**
 * Advanced Gold Trading Strategy with Multi-Timeframe Analysis
 * Implements complex technical analysis for gold (XAU/USD) trading
 */

class GoldStrategy {
    constructor(config = {}) {
        this.config = {
            // Multi-timeframe periods
            timeframes: config.timeframes || ['1m', '5m', '15m', '1h', '4h', '1d'],
            
            // Moving averages
            emaFast: config.emaFast || 9,
            emaMedium: config.emaMedium || 21,
            emaSlow: config.emaSlow || 50,
            emaLong: config.emaLong || 200,
            
            // RSI settings
            rsiPeriod: config.rsiPeriod || 14,
            rsiOverbought: config.rsiOverbought || 70,
            rsiOversold: config.rsiOversold || 30,
            
            // MACD settings
            macdFast: config.macdFast || 12,
            macdSlow: config.macdSlow || 26,
            macdSignal: config.macdSignal || 9,
            
            // Bollinger Bands
            bbPeriod: config.bbPeriod || 20,
            bbStdDev: config.bbStdDev || 2,
            
            // Risk management
            riskPerTrade: config.riskPerTrade || 0.02, // 2% per trade
            stopLossPercent: config.stopLossPercent || 0.015, // 1.5%
            takeProfitPercent: config.takeProfitPercent || 0.03, // 3%
            
            // Signal strength threshold
            minSignalStrength: config.minSignalStrength || 0.7
        };
    }

    /**
     * Calculate Exponential Moving Average
     */
    calculateEMA(data, period) {
        if (data.length < period) return null;
        
        const multiplier = 2 / (period + 1);
        let ema = data.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
        
        for (let i = period; i < data.length; i++) {
            ema = (data[i] - ema) * multiplier + ema;
        }
        
        return ema;
    }

    /**
     * Calculate RSI (Relative Strength Index)
     */
    calculateRSI(data, period = 14) {
        if (data.length < period + 1) return null;
        
        const changes = [];
        for (let i = 1; i < data.length; i++) {
            changes.push(data[i] - data[i - 1]);
        }
        
        let gains = 0;
        let losses = 0;
        
        for (let i = 0; i < period; i++) {
            if (changes[i] >= 0) {
                gains += changes[i];
            } else {
                losses -= changes[i];
            }
        }
        
        let avgGain = gains / period;
        let avgLoss = losses / period;
        
        for (let i = period; i < changes.length; i++) {
            if (changes[i] >= 0) {
                avgGain = (avgGain * (period - 1) + changes[i]) / period;
                avgLoss = (avgLoss * (period - 1)) / period;
            } else {
                avgGain = (avgGain * (period - 1)) / period;
                avgLoss = (avgLoss * (period - 1) - changes[i]) / period;
            }
        }
        
        if (avgLoss === 0) return 100;
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }

    /**
     * Calculate MACD (Moving Average Convergence Divergence)
     */
    calculateMACD(data) {
        const emaFast = this.calculateEMA(data, this.config.macdFast);
        const emaSlow = this.calculateEMA(data, this.config.macdSlow);
        
        if (!emaFast || !emaSlow) return null;
        
        const macdLine = emaFast - emaSlow;
        const signalLine = macdLine * 0.2; // Simplified signal line
        const histogram = macdLine - signalLine;
        
        return {
            macd: macdLine,
            signal: signalLine,
            histogram: histogram
        };
    }

    /**
     * Calculate Bollinger Bands
     */
    calculateBollingerBands(data, period = 20, stdDev = 2) {
        if (data.length < period) return null;
        
        const sma = data.slice(-period).reduce((sum, val) => sum + val, 0) / period;
        
        const variance = data.slice(-period).reduce((sum, val) => {
            return sum + Math.pow(val - sma, 2);
        }, 0) / period;
        
        const std = Math.sqrt(variance);
        
        return {
            upper: sma + (std * stdDev),
            middle: sma,
            lower: sma - (std * stdDev)
        };
    }

    /**
     * Detect trend based on multiple moving averages
     */
    detectTrend(data) {
        const emaFast = this.calculateEMA(data, this.config.emaFast);
        const emaMedium = this.calculateEMA(data, this.config.emaMedium);
        const emaSlow = this.calculateEMA(data, this.config.emaSlow);
        const emaLong = this.calculateEMA(data, this.config.emaLong);
        
        if (!emaFast || !emaMedium || !emaSlow || !emaLong) {
            return { trend: 'neutral', strength: 0 };
        }
        
        const currentPrice = data[data.length - 1];
        
        // Strong uptrend: Fast > Medium > Slow > Long and price above all
        if (emaFast > emaMedium && emaMedium > emaSlow && emaSlow > emaLong && currentPrice > emaFast) {
            return { trend: 'strong_uptrend', strength: 0.9 };
        }
        
        // Uptrend: Fast > Medium > Slow
        if (emaFast > emaMedium && emaMedium > emaSlow) {
            return { trend: 'uptrend', strength: 0.7 };
        }
        
        // Strong downtrend: Fast < Medium < Slow < Long and price below all
        if (emaFast < emaMedium && emaMedium < emaSlow && emaSlow < emaLong && currentPrice < emaFast) {
            return { trend: 'strong_downtrend', strength: 0.9 };
        }
        
        // Downtrend: Fast < Medium < Slow
        if (emaFast < emaMedium && emaMedium < emaSlow) {
            return { trend: 'downtrend', strength: 0.7 };
        }
        
        return { trend: 'neutral', strength: 0.3 };
    }

    /**
     * Analyze multiple timeframes for confluence
     */
    analyzeMultiTimeframe(marketData) {
        const timeframeSignals = {};
        let bullishCount = 0;
        let bearishCount = 0;
        
        for (const tf of this.config.timeframes) {
            if (marketData[tf] && marketData[tf].length > 0) {
                const signal = this.analyzeSingleTimeframe(marketData[tf]);
                timeframeSignals[tf] = signal;
                
                if (signal.direction === 'LONG') bullishCount++;
                if (signal.direction === 'SHORT') bearishCount++;
            }
        }
        
        const totalTimeframes = Object.keys(timeframeSignals).length;
        const confluenceScore = Math.max(bullishCount, bearishCount) / totalTimeframes;
        
        return {
            timeframeSignals,
            overallDirection: bullishCount > bearishCount ? 'LONG' : bearishCount > bullishCount ? 'SHORT' : 'NEUTRAL',
            confluenceScore,
            bullishTimeframes: bullishCount,
            bearishTimeframes: bearishCount
        };
    }

    /**
     * Analyze single timeframe and generate signal
     */
    analyzeSingleTimeframe(priceData) {
        if (!priceData || priceData.length < 200) {
            return { direction: 'NEUTRAL', strength: 0, reason: 'Insufficient data' };
        }
        
        const currentPrice = priceData[priceData.length - 1];
        const trend = this.detectTrend(priceData);
        const rsi = this.calculateRSI(priceData, this.config.rsiPeriod);
        const macd = this.calculateMACD(priceData);
        const bb = this.calculateBollingerBands(priceData, this.config.bbPeriod, this.config.bbStdDev);
        
        let signalStrength = 0;
        let direction = 'NEUTRAL';
        const reasons = [];
        
        // Trend analysis
        if (trend.trend.includes('uptrend')) {
            signalStrength += trend.strength * 0.3;
            reasons.push(`${trend.trend} detected`);
        } else if (trend.trend.includes('downtrend')) {
            signalStrength -= trend.strength * 0.3;
            reasons.push(`${trend.trend} detected`);
        }
        
        // RSI analysis
        if (rsi !== null) {
            if (rsi < this.config.rsiOversold) {
                signalStrength += 0.2;
                reasons.push(`RSI oversold (${rsi.toFixed(2)})`);
            } else if (rsi > this.config.rsiOverbought) {
                signalStrength -= 0.2;
                reasons.push(`RSI overbought (${rsi.toFixed(2)})`);
            }
        }
        
        // MACD analysis
        if (macd && macd.histogram > 0) {
            signalStrength += 0.15;
            reasons.push('MACD bullish');
        } else if (macd && macd.histogram < 0) {
            signalStrength -= 0.15;
            reasons.push('MACD bearish');
        }
        
        // Bollinger Bands analysis
        if (bb) {
            if (currentPrice <= bb.lower) {
                signalStrength += 0.15;
                reasons.push('Price at lower Bollinger Band');
            } else if (currentPrice >= bb.upper) {
                signalStrength -= 0.15;
                reasons.push('Price at upper Bollinger Band');
            }
        }
        
        // Determine direction
        if (signalStrength > 0.3) {
            direction = 'LONG';
        } else if (signalStrength < -0.3) {
            direction = 'SHORT';
        }
        
        return {
            direction,
            strength: Math.abs(signalStrength),
            reason: reasons.join(', '),
            indicators: {
                trend: trend.trend,
                rsi: rsi ? rsi.toFixed(2) : 'N/A',
                macd: macd ? macd.histogram.toFixed(4) : 'N/A',
                bb: bb ? {
                    upper: bb.upper.toFixed(2),
                    middle: bb.middle.toFixed(2),
                    lower: bb.lower.toFixed(2)
                } : 'N/A'
            }
        };
    }

    /**
     * Generate trading signal with full analysis
     */
    generateSignal(marketData) {
        const mtfAnalysis = this.analyzeMultiTimeframe(marketData);
        
        // Calculate position size and risk parameters
        const currentPrice = marketData['1m'] ? marketData['1m'][marketData['1m'].length - 1] : 0;
        const stopLoss = currentPrice * (1 - this.config.stopLossPercent);
        const takeProfit = currentPrice * (1 + this.config.takeProfitPercent);
        
        const signal = {
            timestamp: new Date().toISOString(),
            symbol: 'XAUUSD',
            direction: mtfAnalysis.overallDirection,
            strength: mtfAnalysis.confluenceScore,
            confidence: (mtfAnalysis.confluenceScore * 100).toFixed(1) + '%',
            currentPrice: currentPrice.toFixed(2),
            entry: currentPrice.toFixed(2),
            stopLoss: stopLoss.toFixed(2),
            takeProfit: takeProfit.toFixed(2),
            riskReward: (this.config.takeProfitPercent / this.config.stopLossPercent).toFixed(2),
            timeframeAnalysis: mtfAnalysis.timeframeSignals,
            shouldTrade: mtfAnalysis.confluenceScore >= this.config.minSignalStrength
        };
        
        return signal;
    }

    /**
     * Calculate position size based on account balance and risk
     */
    calculatePositionSize(accountBalance, currentPrice, stopLoss) {
        const riskAmount = accountBalance * this.config.riskPerTrade;
        const riskPerUnit = Math.abs(currentPrice - stopLoss);
        const positionSize = riskAmount / riskPerUnit;
        
        return {
            units: positionSize.toFixed(2),
            riskAmount: riskAmount.toFixed(2),
            potentialLoss: riskAmount.toFixed(2)
        };
    }
}

module.exports = GoldStrategy;
