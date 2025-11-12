require('dotenv').config();
const logger = require('./logger');
const MarketDataAnalyzer = require('./analyzers/marketData');
const StrategySelector = require('./strategies/strategySelector');
const TelegramBotManager = require('./telegram/botManager');
const fs = require('fs');
const path = require('path');

/**
 * AI Gold Master - Main Trading Analysis Engine
 * Continuously analyzes gold markets and sends signals via Telegram
 */
class AIGoldMaster {
    constructor() {
        this.config = {
            tradingNetworkUrl: process.env.TRADING_NETWORK_URL || 'https://coach-pine-cloud.onrender.com',
            analysisInterval: parseInt(process.env.ANALYSIS_INTERVAL_MS) || 60000, // 1 minute default
            minConfidenceThreshold: parseFloat(process.env.MIN_CONFIDENCE_THRESHOLD) || 0.75,
            telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
            telegramChatId: process.env.TELEGRAM_CHAT_ID
        };

        this.marketAnalyzer = new MarketDataAnalyzer(this.config);
        this.strategySelector = new StrategySelector();
        this.telegramBot = new TelegramBotManager(this.config);

        this.isRunning = false;
        this.lastSignal = null;
        this.analysisCount = 0;
        this.signalsGenerated = 0;

        // Ensure logs directory exists
        this.ensureLogDirectory();
    }

    /**
     * Ensure logs directory exists
     */
    ensureLogDirectory() {
        const logsDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    /**
     * Start the AI analysis engine
     */
    async start() {
        logger.info('='.repeat(60));
        logger.info('AI GOLD MASTER - Starting 24/7 Analysis Engine');
        logger.info('='.repeat(60));
        logger.info(`Trading Network: ${this.config.tradingNetworkUrl}`);
        logger.info(`Analysis Interval: ${this.config.analysisInterval}ms`);
        logger.info(`Min Confidence Threshold: ${this.config.minConfidenceThreshold}`);
        logger.info('='.repeat(60));

        this.isRunning = true;

        // Send startup notification
        await this.telegramBot.sendMessage('🚀 AI Gold Master started! Beginning 24/7 market analysis...');

        // Start the analysis loop
        this.runAnalysisLoop();

        // Handle graceful shutdown
        this.setupShutdownHandlers();
    }

    /**
     * Main analysis loop
     */
    async runAnalysisLoop() {
        while (this.isRunning) {
            try {
                await this.performAnalysis();
                this.analysisCount++;

                // Log status every 10 analyses
                if (this.analysisCount % 10 === 0) {
                    logger.info(`Status: Completed ${this.analysisCount} analyses, Generated ${this.signalsGenerated} signals`);
                }

                // Wait before next analysis
                await this.sleep(this.config.analysisInterval);
            } catch (error) {
                logger.error(`Error in analysis loop: ${error.message}`);
                logger.error(error.stack);

                // Notify about critical errors
                if (this.analysisCount === 0) {
                    await this.telegramBot.sendErrorNotification(`Critical error during startup: ${error.message}`);
                }

                // Wait before retry
                await this.sleep(30000); // 30 seconds
            }
        }
    }

    /**
     * Perform a single market analysis
     */
    async performAnalysis() {
        logger.info('--- Starting Market Analysis ---');

        // Step 1: Fetch current market data
        const currentData = await this.marketAnalyzer.fetchMarketData();

        if (!currentData || !currentData.price) {
            logger.warn('Unable to fetch valid market data. Skipping this analysis cycle.');
            return;
        }

        // Step 2: Get historical data
        const closingPrices = this.marketAnalyzer.getClosingPrices(100);

        if (closingPrices.length < 30) {
            logger.info('Accumulating market data... Need at least 30 data points for analysis.');
            return;
        }

        // Step 3: Calculate market conditions
        const marketTrend = this.marketAnalyzer.calculateTrend();
        const volatility = this.marketAnalyzer.calculateVolatility();

        logger.info(`Market Conditions: Trend=${marketTrend}, Volatility=${volatility.toFixed(2)}%, Price=$${currentData.price.toFixed(2)}`);

        // Step 4: Select and apply best strategy
        const signal = this.strategySelector.selectBestStrategy(
            closingPrices,
            currentData,
            marketTrend,
            volatility
        );

        // Step 5: Check if signal meets confidence threshold
        if (signal.confidence >= this.config.minConfidenceThreshold) {
            // Check if this is a different signal from the last one
            if (this.shouldSendSignal(signal)) {
                logger.info(`🎯 HIGH CONFIDENCE SIGNAL: ${signal.action} (${(signal.confidence * 100).toFixed(0)}%)`);
                await this.telegramBot.sendTradingSignal(signal);
                this.lastSignal = signal;
                this.signalsGenerated++;
            } else {
                logger.info(`Signal matches last signal, not resending: ${signal.action}`);
            }
        } else {
            logger.info(`Signal confidence too low: ${(signal.confidence * 100).toFixed(0)}% (threshold: ${(this.config.minConfidenceThreshold * 100).toFixed(0)}%)`);
        }

        // Step 6: Send periodic market summary (every hour - 60 analyses at 1min interval)
        if (this.analysisCount > 0 && this.analysisCount % 60 === 0) {
            await this.telegramBot.sendMarketSummary({
                trend: marketTrend,
                volatility: volatility,
                currentPrice: currentData.price
            });
        }

        logger.info('--- Analysis Complete ---\n');
    }

    /**
     * Determine if signal should be sent (avoid duplicate signals)
     */
    shouldSendSignal(signal) {
        if (!this.lastSignal) return true;

        // Send if action is different
        if (signal.action !== this.lastSignal.action) return true;

        // Send if enough time has passed (30 minutes)
        const timeDiff = signal.timestamp - this.lastSignal.timestamp;
        if (timeDiff > 30 * 60 * 1000) return true;

        // Send if confidence is significantly higher
        if (signal.confidence > this.lastSignal.confidence + 0.1) return true;

        return false;
    }

    /**
     * Setup graceful shutdown handlers
     */
    setupShutdownHandlers() {
        const shutdown = async (signal) => {
            logger.info(`\n${signal} received. Shutting down gracefully...`);
            await this.stop();
            process.exit(0);
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    }

    /**
     * Stop the engine
     */
    async stop() {
        logger.info('Stopping AI Gold Master...');
        this.isRunning = false;
        this.telegramBot.stop();
        
        await this.telegramBot.sendMessage('🛑 AI Gold Master stopped.');
        
        logger.info('AI Gold Master stopped successfully');
    }

    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Start the AI engine
if (require.main === module) {
    const engine = new AIGoldMaster();
    engine.start().catch(error => {
        logger.error(`Fatal error: ${error.message}`);
        logger.error(error.stack);
        process.exit(1);
    });
}

module.exports = AIGoldMaster;
