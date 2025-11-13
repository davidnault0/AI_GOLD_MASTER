/**
 * Market Analysis Engine
 * Continuous market monitoring and analysis system
 */

const EventEmitter = require('events');

class MarketAnalyzer extends EventEmitter {
    constructor(strategy, config = {}) {
        super();
        this.strategy = strategy;
        this.config = {
            updateInterval: config.updateInterval || 60000, // 1 minute
            symbol: config.symbol || 'XAUUSD',
            dataHistorySize: config.dataHistorySize || 500
        };
        this.marketData = this.initializeMarketData();
        this.isRunning = false;
        this.intervalId = null;
    }

    /**
     * Initialize market data structure for all timeframes
     */
    initializeMarketData() {
        const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
        const data = {};
        
        for (const tf of timeframes) {
            data[tf] = [];
        }
        
        return data;
    }

    /**
     * Simulate market data (in production, this would fetch real data)
     */
    generateMockMarketData() {
        // Base price for gold
        const basePrice = 1950;
        const volatility = 10;
        
        for (const tf in this.marketData) {
            // Generate price with some volatility
            const lastPrice = this.marketData[tf].length > 0 
                ? this.marketData[tf][this.marketData[tf].length - 1]
                : basePrice;
            
            const change = (Math.random() - 0.5) * volatility;
            const newPrice = lastPrice + change;
            
            this.marketData[tf].push(newPrice);
            
            // Keep only recent data
            if (this.marketData[tf].length > this.config.dataHistorySize) {
                this.marketData[tf].shift();
            }
        }
    }

    /**
     * Analyze current market conditions
     */
    async analyzeMarket() {
        try {
            // Update market data
            this.generateMockMarketData();
            
            // Generate signal using strategy
            const signal = this.strategy.generateSignal(this.marketData);
            
            // Calculate additional metrics
            const analysis = {
                ...signal,
                marketCondition: this.assessMarketCondition(),
                volatility: this.calculateVolatility(),
                volume: this.estimateVolume()
            };
            
            // Emit analysis event
            this.emit('analysis', analysis);
            
            // Emit signal event if it's a strong signal
            if (analysis.shouldTrade) {
                this.emit('signal', analysis);
            }
            
            return analysis;
        } catch (error) {
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * Assess overall market condition
     */
    assessMarketCondition() {
        const recentPrices = this.marketData['1h'].slice(-50);
        
        if (recentPrices.length < 10) {
            return 'insufficient_data';
        }
        
        const volatility = this.calculateVolatility();
        
        if (volatility > 15) {
            return 'highly_volatile';
        } else if (volatility > 8) {
            return 'volatile';
        } else if (volatility > 4) {
            return 'normal';
        } else {
            return 'low_volatility';
        }
    }

    /**
     * Calculate market volatility
     */
    calculateVolatility() {
        const prices = this.marketData['1h'].slice(-50);
        
        if (prices.length < 2) return 0;
        
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
        }
        
        const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
        const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
        const volatility = Math.sqrt(variance) * 100;
        
        return parseFloat(volatility.toFixed(2));
    }

    /**
     * Estimate trading volume (mock)
     */
    estimateVolume() {
        return Math.floor(Math.random() * 1000000) + 500000;
    }

    /**
     * Start continuous market analysis
     */
    start() {
        if (this.isRunning) {
            console.log('Market analyzer is already running');
            return;
        }
        
        console.log(`Starting market analysis for ${this.config.symbol}...`);
        this.isRunning = true;
        
        // Run initial analysis
        this.analyzeMarket();
        
        // Set up periodic analysis
        this.intervalId = setInterval(() => {
            this.analyzeMarket();
        }, this.config.updateInterval);
        
        this.emit('started');
    }

    /**
     * Stop market analysis
     */
    stop() {
        if (!this.isRunning) {
            console.log('Market analyzer is not running');
            return;
        }
        
        console.log('Stopping market analysis...');
        this.isRunning = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.emit('stopped');
    }

    /**
     * Get current market status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            symbol: this.config.symbol,
            updateInterval: this.config.updateInterval,
            dataPoints: Object.keys(this.marketData).reduce((acc, tf) => {
                acc[tf] = this.marketData[tf].length;
                return acc;
            }, {}),
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * Get latest market data
     */
    getLatestData() {
        const latest = {};
        
        for (const tf in this.marketData) {
            if (this.marketData[tf].length > 0) {
                latest[tf] = this.marketData[tf][this.marketData[tf].length - 1];
            }
        }
        
        return latest;
    }

    /**
     * Update market data manually (for testing)
     */
    updateMarketData(timeframe, priceData) {
        if (this.marketData[timeframe]) {
            this.marketData[timeframe] = priceData.slice(-this.config.dataHistorySize);
            return true;
        }
        return false;
    }
}

module.exports = MarketAnalyzer;
