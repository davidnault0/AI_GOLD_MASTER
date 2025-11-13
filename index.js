/**
 * AI Gold Master - Main Application
 * Complete trading system with AI analysis, Telegram integration, and web interface
 */

const GoldStrategy = require('./src/strategies/goldStrategy');
const MarketAnalyzer = require('./src/analysis/marketAnalyzer');
const TelegramBot = require('./src/telegram/telegramBot');
const AIServer = require('./src/server/aiServer');

class AIGoldMaster {
    constructor(config = {}) {
        // Initialize strategy
        this.strategy = new GoldStrategy(config.strategy);
        
        // Initialize market analyzer
        this.analyzer = new MarketAnalyzer(this.strategy, config.analyzer);
        
        // Initialize Telegram bot
        this.telegramBot = new TelegramBot(config.telegram);
        
        // Initialize AI server
        this.server = new AIServer(config.server);
        this.server.setAnalyzer(this.analyzer);
        this.server.setTelegramBot(this.telegramBot);
        
        // Set up event handlers
        this.setupEventHandlers();
    }

    /**
     * Set up event handlers for market analysis
     */
    setupEventHandlers() {
        // Handle analysis events
        this.analyzer.on('analysis', (analysis) => {
            console.log(`[${new Date().toLocaleTimeString()}] Market analyzed: ${analysis.direction} (${analysis.confidence})`);
        });

        // Handle signal events (strong signals)
        this.analyzer.on('signal', async (signal) => {
            console.log(`\n🚨 TRADING SIGNAL DETECTED 🚨`);
            console.log(`Direction: ${signal.direction}`);
            console.log(`Confidence: ${signal.confidence}`);
            console.log(`Entry: $${signal.entry}`);
            console.log(`Stop Loss: $${signal.stopLoss}`);
            console.log(`Take Profit: $${signal.takeProfit}\n`);
            
            // Send signal to Telegram
            await this.telegramBot.sendSignal(signal);
        });

        // Handle errors
        this.analyzer.on('error', (error) => {
            console.error('Market analyzer error:', error);
            this.telegramBot.sendAlert(`Error in market analyzer: ${error.message}`, 'high');
        });

        // Handle start/stop events
        this.analyzer.on('started', () => {
            console.log('✅ Market analyzer started');
            this.telegramBot.sendAlert('AI Gold Master system started', 'normal');
        });

        this.analyzer.on('stopped', () => {
            console.log('⏸️  Market analyzer stopped');
        });
    }

    /**
     * Initialize and start the system
     */
    async start() {
        try {
            console.log('\n' + '='.repeat(50));
            console.log('🤖 AI GOLD MASTER TRADING SYSTEM');
            console.log('='.repeat(50) + '\n');

            // Initialize Telegram bot
            await this.telegramBot.initialize();

            // Start AI server
            await this.server.start();

            // Start market analyzer
            this.analyzer.start();

            console.log('\n✅ All systems initialized successfully!');
            console.log('\nSystem Status:');
            console.log('- Market Analyzer: Running');
            console.log('- Telegram Bot: ' + (this.telegramBot.config.enabled ? 'Enabled' : 'Disabled'));
            console.log('- AI Server: Running on port ' + this.server.config.port);
            console.log('\nAccess the web interface at: http://localhost:' + this.server.config.port);
            console.log('\nPress Ctrl+C to stop\n');

        } catch (error) {
            console.error('Failed to start system:', error);
            process.exit(1);
        }
    }

    /**
     * Stop the system
     */
    async stop() {
        console.log('\n\nShutting down...');
        
        this.analyzer.stop();
        await this.server.stop();
        
        console.log('✅ System stopped successfully\n');
        process.exit(0);
    }

    /**
     * Get system status
     */
    getStatus() {
        return {
            analyzer: this.analyzer.getStatus(),
            telegram: {
                enabled: this.telegramBot.config.enabled,
                signalHistory: this.telegramBot.getSignalHistory()
            },
            server: {
                port: this.server.config.port,
                host: this.server.config.host
            }
        };
    }
}

// Run the application if this is the main module
if (require.main === module) {
    // Load environment variables if .env file exists
    try {
        require('dotenv').config();
    } catch (e) {
        // dotenv not installed, use process.env directly
    }

    // Configuration
    const config = {
        strategy: {
            timeframes: ['1m', '5m', '15m', '1h', '4h', '1d'],
            minSignalStrength: 0.65
        },
        analyzer: {
            updateInterval: 60000, // 1 minute
            symbol: 'XAUUSD'
        },
        telegram: {
            enabled: true,
            botToken: process.env.TELEGRAM_BOT_TOKEN,
            chatId: process.env.TELEGRAM_CHAT_ID
        },
        server: {
            port: process.env.PORT || 3000,
            host: '0.0.0.0'
        }
    };

    // Create and start the application
    const app = new AIGoldMaster(config);

    // Handle graceful shutdown
    process.on('SIGINT', () => app.stop());
    process.on('SIGTERM', () => app.stop());

    // Start the system
    app.start().catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = AIGoldMaster;
