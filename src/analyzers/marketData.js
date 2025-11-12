const axios = require('axios');
const logger = require('../logger');

class MarketDataAnalyzer {
    constructor(config) {
        this.config = config;
        this.marketData = [];
        this.maxDataPoints = 500; // Keep last 500 data points
    }

    /**
     * Fetch current gold market data
     */
    async fetchMarketData() {
        try {
            logger.info('Fetching gold market data...');
            
            // Try to fetch from the trading network
            const response = await axios.get(this.config.tradingNetworkUrl, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'AI-Gold-Master/1.0'
                }
            });

            // Parse and structure the data
            const currentData = {
                timestamp: Date.now(),
                price: this.extractPrice(response.data),
                volume: this.extractVolume(response.data),
                high: this.extractHigh(response.data),
                low: this.extractLow(response.data),
                open: this.extractOpen(response.data)
            };

            this.addDataPoint(currentData);
            logger.info(`Market data fetched: Price=${currentData.price}`);
            
            return currentData;
        } catch (error) {
            logger.error(`Error fetching market data: ${error.message}`);
            // Return simulated data for demonstration purposes
            return this.generateSimulatedData();
        }
    }

    /**
     * Add data point to historical data
     */
    addDataPoint(data) {
        this.marketData.push(data);
        
        // Keep only the most recent data points
        if (this.marketData.length > this.maxDataPoints) {
            this.marketData.shift();
        }
    }

    /**
     * Get historical market data
     */
    getHistoricalData(count = 100) {
        const startIndex = Math.max(0, this.marketData.length - count);
        return this.marketData.slice(startIndex);
    }

    /**
     * Get closing prices for technical analysis
     */
    getClosingPrices(count = 100) {
        const data = this.getHistoricalData(count);
        return data.map(d => d.price);
    }

    /**
     * Extract price from API response (customize based on actual API)
     */
    extractPrice(data) {
        // Implement based on actual API response structure
        if (typeof data === 'object' && data.price) {
            return parseFloat(data.price);
        }
        return null;
    }

    extractVolume(data) {
        if (typeof data === 'object' && data.volume) {
            return parseFloat(data.volume);
        }
        return 0;
    }

    extractHigh(data) {
        if (typeof data === 'object' && data.high) {
            return parseFloat(data.high);
        }
        return null;
    }

    extractLow(data) {
        if (typeof data === 'object' && data.low) {
            return parseFloat(data.low);
        }
        return null;
    }

    extractOpen(data) {
        if (typeof data === 'object' && data.open) {
            return parseFloat(data.open);
        }
        return null;
    }

    /**
     * Generate simulated data for demonstration/testing
     */
    generateSimulatedData() {
        const basePrice = 2000;
        const volatility = 20;
        const trend = Math.random() > 0.5 ? 1 : -1;
        
        const price = basePrice + (Math.random() * volatility * trend);
        
        return {
            timestamp: Date.now(),
            price: price,
            volume: Math.random() * 10000,
            high: price + Math.random() * 5,
            low: price - Math.random() * 5,
            open: price + (Math.random() - 0.5) * 3
        };
    }

    /**
     * Calculate current market trend
     */
    calculateTrend() {
        if (this.marketData.length < 20) {
            return 'NEUTRAL';
        }

        const recentPrices = this.getClosingPrices(20);
        const firstHalf = recentPrices.slice(0, 10);
        const secondHalf = recentPrices.slice(10);

        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;

        if (percentChange > 0.5) return 'BULLISH';
        if (percentChange < -0.5) return 'BEARISH';
        return 'NEUTRAL';
    }

    /**
     * Calculate market volatility
     */
    calculateVolatility() {
        if (this.marketData.length < 20) {
            return 0;
        }

        const prices = this.getClosingPrices(20);
        const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
        const stdDev = Math.sqrt(variance);

        return (stdDev / mean) * 100; // Return as percentage
    }
}

module.exports = MarketDataAnalyzer;
