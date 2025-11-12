const logger = require('../logger');
const GoldOptimizedStrategy = require('./goldOptimized');
const SMACrossoverStrategy = require('./smaCrossover');
const RSIStrategy = require('./rsiStrategy');
const BollingerBandsStrategy = require('./bollingerBands');
const MACDStrategy = require('./macdStrategy');

/**
 * Strategy Selector - Chooses the best strategy based on current market conditions
 * Now includes Gold-Optimized Trend-Pullback strategy as primary strategy
 */
class StrategySelector {
    constructor() {
        // Gold-Optimized strategy is listed first and given priority in scoring
        this.strategies = [
            new GoldOptimizedStrategy(),    // PRIMARY: Research-backed gold strategy
            new SMACrossoverStrategy(),
            new RSIStrategy(),
            new BollingerBandsStrategy(),
            new MACDStrategy()
        ];
        
        this.currentStrategy = null;
    }

    /**
     * Analyze market with all strategies and select the best one
     */
    selectBestStrategy(closingPrices, currentData, marketTrend, volatility) {
        logger.info('Analyzing market with all strategies...');

        const signals = [];

        // Get signals from all strategies
        for (const strategy of this.strategies) {
            try {
                const signal = strategy.analyze(closingPrices, currentData);
                signal.performanceScore = strategy.getPerformanceScore();
                signals.push(signal);
                
                logger.debug(`${strategy.name}: Action=${signal.action}, Confidence=${signal.confidence.toFixed(2)}, Performance=${signal.performanceScore.toFixed(2)}`);
            } catch (error) {
                logger.error(`Error in strategy ${strategy.name}: ${error.message}`);
            }
        }

        // Calculate combined score for each signal
        // Gold-Optimized strategy gets a bonus for being research-backed
        const scoredSignals = signals.map(signal => {
            const marketAlignment = this.calculateMarketAlignment(signal.action, marketTrend);
            const volatilityAdjustment = this.calculateVolatilityAdjustment(signal.action, volatility);
            
            // Base score calculation
            let score = (signal.confidence * 0.5) + 
                       (signal.performanceScore * 0.3) + 
                       (marketAlignment * 0.1) +
                       (volatilityAdjustment * 0.1);
            
            // Give 10% bonus to Gold-Optimized strategy (research-backed)
            if (signal.strategy === 'Gold-Optimized Trend-Pullback') {
                score *= 1.10;
            }
            
            return {
                ...signal,
                marketAlignment,
                volatilityAdjustment,
                totalScore: score
            };
        });

        // Sort by total score
        scoredSignals.sort((a, b) => b.totalScore - a.totalScore);

        // Select the best signal
        const bestSignal = scoredSignals[0];
        
        // Find the strategy that generated this signal
        this.currentStrategy = this.strategies.find(s => s.name === bestSignal.strategy);

        logger.info(`Best strategy selected: ${bestSignal.strategy} with score ${bestSignal.totalScore.toFixed(2)}`);
        logger.info(`Signal: ${bestSignal.action} with confidence ${bestSignal.confidence.toFixed(2)}`);

        return bestSignal;
    }

    /**
     * Calculate how well the signal aligns with market trend
     */
    calculateMarketAlignment(action, marketTrend) {
        if (marketTrend === 'BULLISH' && action === 'BUY') return 1.0;
        if (marketTrend === 'BEARISH' && action === 'SELL') return 1.0;
        if (action === 'HOLD') return 0.5;
        if (marketTrend === 'NEUTRAL') return 0.7;
        return 0.3; // Counter-trend signal
    }

    /**
     * Adjust score based on market volatility
     */
    calculateVolatilityAdjustment(action, volatility) {
        // High volatility favors cautious approach
        if (volatility > 3) {
            return action === 'HOLD' ? 0.8 : 0.5;
        }
        // Low volatility favors more aggressive signals
        if (volatility < 1) {
            return action === 'HOLD' ? 0.3 : 0.9;
        }
        return 0.7; // Normal volatility
    }

    /**
     * Get consensus signal from all strategies
     */
    getConsensusSignal(closingPrices, currentData) {
        const signals = this.strategies.map(strategy => {
            try {
                return strategy.analyze(closingPrices, currentData);
            } catch (error) {
                logger.error(`Error in strategy ${strategy.name}: ${error.message}`);
                return null;
            }
        }).filter(s => s !== null);

        // Count actions
        const actionCounts = {
            BUY: 0,
            SELL: 0,
            HOLD: 0
        };

        let totalConfidence = 0;

        signals.forEach(signal => {
            actionCounts[signal.action]++;
            totalConfidence += signal.confidence;
        });

        // Find majority action
        const majorityAction = Object.keys(actionCounts).reduce((a, b) => 
            actionCounts[a] > actionCounts[b] ? a : b
        );

        const consensusLevel = actionCounts[majorityAction] / signals.length;
        const avgConfidence = totalConfidence / signals.length;

        return {
            action: majorityAction,
            consensus: consensusLevel,
            confidence: avgConfidence,
            strategies: signals.map(s => s.strategy)
        };
    }

    /**
     * Get current strategy being used
     */
    getCurrentStrategy() {
        return this.currentStrategy;
    }
}

module.exports = StrategySelector;
