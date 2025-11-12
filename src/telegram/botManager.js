const TelegramBot = require('node-telegram-bot-api');
const logger = require('../logger');

/**
 * Telegram Bot Manager - Sends trading signals to Telegram
 */
class TelegramBotManager {
    constructor(config) {
        this.token = config.telegramBotToken;
        this.chatId = config.telegramChatId;
        this.bot = null;
        this.isEnabled = false;

        if (this.token && this.chatId && this.token !== 'your_telegram_bot_token_here') {
            this.initializeBot();
        } else {
            logger.warn('Telegram bot credentials not configured. Signals will be logged only.');
        }
    }

    /**
     * Initialize Telegram bot
     */
    initializeBot() {
        try {
            this.bot = new TelegramBot(this.token, { polling: true });
            this.isEnabled = true;

            // Setup command handlers
            this.bot.onText(/\/start/, (msg) => {
                this.sendMessage('🤖 AI Gold Master Bot activated!\n\nYou will receive trading signals for gold market analysis.');
            });

            this.bot.onText(/\/status/, (msg) => {
                this.sendMessage('✅ Bot is active and monitoring gold markets 24/7');
            });

            this.bot.onText(/\/help/, (msg) => {
                this.sendMessage(
                    '📊 AI Gold Master Bot Commands:\n\n' +
                    '/start - Activate the bot\n' +
                    '/status - Check bot status\n' +
                    '/help - Show this help message\n\n' +
                    'The bot will automatically send trading signals based on advanced market analysis.'
                );
            });

            logger.info('Telegram bot initialized successfully');
        } catch (error) {
            logger.error(`Error initializing Telegram bot: ${error.message}`);
            this.isEnabled = false;
        }
    }

    /**
     * Send a trading signal to Telegram
     */
    async sendTradingSignal(signal) {
        const message = this.formatTradingSignal(signal);
        
        logger.info(`Trading Signal: ${signal.action} - ${signal.reason}`);
        
        if (this.isEnabled) {
            try {
                await this.bot.sendMessage(this.chatId, message, { parse_mode: 'HTML' });
                logger.info('Signal sent to Telegram successfully');
            } catch (error) {
                logger.error(`Error sending signal to Telegram: ${error.message}`);
            }
        } else {
            logger.warn('Telegram not enabled. Signal logged only.');
        }
    }

    /**
     * Format trading signal for Telegram
     */
    formatTradingSignal(signal) {
        const emoji = {
            'BUY': '🟢 📈',
            'SELL': '🔴 📉',
            'HOLD': '🟡 ⏸️'
        };

        const confidenceBar = this.createConfidenceBar(signal.confidence);

        let message = `${emoji[signal.action]} <b>${signal.action} SIGNAL - GOLD</b>\n\n`;
        message += `<b>Strategy:</b> ${signal.strategy}\n`;
        message += `<b>Confidence:</b> ${(signal.confidence * 100).toFixed(0)}% ${confidenceBar}\n`;
        message += `<b>Reason:</b> ${signal.reason}\n\n`;

        if (signal.indicators && Object.keys(signal.indicators).length > 0) {
            message += `<b>Technical Indicators:</b>\n`;
            for (const [key, value] of Object.entries(signal.indicators)) {
                if (typeof value === 'number') {
                    message += `• ${key}: ${value.toFixed(2)}\n`;
                }
            }
            message += '\n';
        }

        if (signal.totalScore) {
            message += `<b>Overall Score:</b> ${(signal.totalScore * 100).toFixed(0)}%\n`;
        }

        message += `\n<i>⏰ ${new Date(signal.timestamp).toLocaleString()}</i>`;

        return message;
    }

    /**
     * Create a visual confidence bar
     */
    createConfidenceBar(confidence) {
        const length = 10;
        const filled = Math.round(confidence * length);
        const empty = length - filled;
        return '█'.repeat(filled) + '░'.repeat(empty);
    }

    /**
     * Send a general message to Telegram
     */
    async sendMessage(text) {
        if (this.isEnabled) {
            try {
                await this.bot.sendMessage(this.chatId, text);
            } catch (error) {
                logger.error(`Error sending message to Telegram: ${error.message}`);
            }
        }
    }

    /**
     * Send market summary
     */
    async sendMarketSummary(summary) {
        const message = `📊 <b>Market Summary</b>\n\n` +
                       `<b>Trend:</b> ${summary.trend}\n` +
                       `<b>Volatility:</b> ${summary.volatility.toFixed(2)}%\n` +
                       `<b>Current Price:</b> $${summary.currentPrice.toFixed(2)}\n` +
                       `<b>Analysis Time:</b> ${new Date().toLocaleString()}`;

        if (this.isEnabled) {
            try {
                await this.bot.sendMessage(this.chatId, message, { parse_mode: 'HTML' });
            } catch (error) {
                logger.error(`Error sending market summary: ${error.message}`);
            }
        } else {
            logger.info(`Market Summary: ${summary.trend}, Volatility: ${summary.volatility.toFixed(2)}%`);
        }
    }

    /**
     * Send error notification
     */
    async sendErrorNotification(errorMsg) {
        const message = `⚠️ <b>Error Alert</b>\n\n${errorMsg}`;
        
        if (this.isEnabled) {
            try {
                await this.bot.sendMessage(this.chatId, message, { parse_mode: 'HTML' });
            } catch (error) {
                logger.error(`Error sending error notification: ${error.message}`);
            }
        }
    }

    /**
     * Stop the bot
     */
    stop() {
        if (this.bot && this.isEnabled) {
            this.bot.stopPolling();
            logger.info('Telegram bot stopped');
        }
    }
}

module.exports = TelegramBotManager;
