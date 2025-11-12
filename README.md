
# AI_GOLD_MASTER

An advanced AI-powered 24/7 gold trading analysis system that continuously monitors gold markets, applies multiple trading strategies, and sends intelligent trading signals to your Telegram bot.

> **⚡ Quick Start**: New users, see [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide!

## 🌟 Features

- **24/7 Continuous Analysis**: Monitors gold markets around the clock without interruption
- **Multiple Trading Strategies**: 
  - SMA (Simple Moving Average) Crossover
  - RSI (Relative Strength Index)
  - Bollinger Bands
  - MACD (Moving Average Convergence Divergence)
- **Intelligent Strategy Selection**: Automatically selects the best strategy based on current market conditions
- **Market Trend Analysis**: Identifies bullish, bearish, or neutral market trends
- **Volatility Detection**: Adjusts strategy selection based on market volatility
- **Telegram Integration**: Sends real-time trading signals directly to your Telegram bot
- **Confidence Scoring**: Only sends high-confidence signals (configurable threshold)
- **Comprehensive Logging**: Tracks all analyses and signals for review

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Telegram Bot Token (from @BotFather on Telegram)
- Telegram Chat ID

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
   cd AI_GOLD_MASTER
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   ```env
   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
   TELEGRAM_CHAT_ID=your_actual_chat_id_here

   # Trading Network Configuration
   TRADING_NETWORK_URL=https://coach-pine-cloud.onrender.com

   # Analysis Configuration
   ANALYSIS_INTERVAL_MS=60000
   MIN_CONFIDENCE_THRESHOLD=0.75

   # Logging
   LOG_LEVEL=info
   ```

## 🔧 Configuration Guide

### Getting Telegram Credentials

1. **Create a Telegram Bot**:
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` command
   - Follow the instructions to create your bot
   - Copy the bot token provided

2. **Get Your Chat ID**:
   - Start a chat with your bot
   - Send any message to your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your chat ID in the response

### Configuration Parameters

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from BotFather
- `TELEGRAM_CHAT_ID`: Your Telegram chat ID where signals will be sent
- `TRADING_NETWORK_URL`: URL of your trading network (default: https://coach-pine-cloud.onrender.com)
- `ANALYSIS_INTERVAL_MS`: Time between analyses in milliseconds (default: 60000 = 1 minute)
- `MIN_CONFIDENCE_THRESHOLD`: Minimum confidence score to send signals (0-1, default: 0.75)
- `LOG_LEVEL`: Logging verbosity (debug, info, warn, error)

## 🎯 Usage

### Start the AI Engine

```bash
npm start
```

The system will:
1. Connect to the trading network
2. Begin collecting market data
3. Start 24/7 analysis with your configured strategies
4. Send trading signals to your Telegram bot

### Telegram Bot Commands

Once running, you can interact with your bot:

- `/start` - Activate the bot and start receiving signals
- `/status` - Check if the bot is active
- `/help` - Show available commands

### Reading Signals

Signals sent to Telegram include:

- **Action**: BUY 🟢, SELL 🔴, or HOLD 🟡
- **Strategy**: Which strategy generated the signal
- **Confidence**: Percentage confidence (0-100%)
- **Reason**: Explanation of why the signal was generated
- **Technical Indicators**: Relevant indicator values
- **Timestamp**: When the signal was generated

## 📊 Trading Strategies Explained

### SMA Crossover Strategy
Generates signals when short-term moving average crosses long-term moving average:
- **Buy Signal**: Short MA crosses above long MA (bullish crossover)
- **Sell Signal**: Short MA crosses below long MA (bearish crossover)

### RSI Strategy
Uses Relative Strength Index to identify overbought/oversold conditions:
- **Buy Signal**: RSI < 30 (oversold)
- **Sell Signal**: RSI > 70 (overbought)

### Bollinger Bands Strategy
Analyzes price movement relative to volatility bands:
- **Buy Signal**: Price touches or breaks below lower band
- **Sell Signal**: Price touches or breaks above upper band

### MACD Strategy
Uses Moving Average Convergence Divergence for momentum:
- **Buy Signal**: MACD line crosses above signal line
- **Sell Signal**: MACD line crosses below signal line

## 🧠 How It Works

1. **Data Collection**: Continuously fetches gold market data from the configured network
2. **Technical Analysis**: Calculates multiple technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands)
3. **Strategy Evaluation**: Runs all strategies in parallel and scores each signal
4. **Adaptive Selection**: Selects the best strategy based on:
   - Signal confidence
   - Historical performance
   - Market trend alignment
   - Current volatility
5. **Signal Generation**: Sends high-confidence signals to Telegram
6. **Continuous Learning**: Tracks strategy performance over time

## 📁 Project Structure

```
AI_GOLD_MASTER/
├── src/
│   ├── index.js                 # Main AI engine
│   ├── logger.js                # Logging utility
│   ├── analyzers/
│   │   └── marketData.js        # Market data analyzer
│   ├── strategies/
│   │   ├── baseStrategy.js      # Base strategy class
│   │   ├── smaCrossover.js      # SMA crossover strategy
│   │   ├── rsiStrategy.js       # RSI strategy
│   │   ├── bollingerBands.js    # Bollinger Bands strategy
│   │   ├── macdStrategy.js      # MACD strategy
│   │   └── strategySelector.js  # Strategy selection logic
│   └── telegram/
│       └── botManager.js        # Telegram bot manager
├── logs/                        # Log files (auto-created)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🔐 Security Notes

- Never commit your `.env` file with real credentials
- Keep your Telegram bot token secure
- Review and test signals before acting on them
- The system is for analysis purposes - always verify signals independently

## 🐛 Troubleshooting

### Bot not sending messages
- Verify your `TELEGRAM_BOT_TOKEN` is correct
- Ensure you've started a chat with your bot
- Check that your `TELEGRAM_CHAT_ID` is correct

### No signals being generated
- Check that market data is being fetched successfully (see logs)
- Lower the `MIN_CONFIDENCE_THRESHOLD` if needed
- Ensure enough historical data has been collected (minimum 30 data points)

### Connection errors
- Verify the `TRADING_NETWORK_URL` is accessible
- Check your internet connection
- Review error logs in `logs/error.log`

## 📝 Logging

Logs are stored in the `logs/` directory:
- `combined.log`: All log messages
- `error.log`: Error messages only

Console output shows real-time analysis progress.

## 🤝 Contributing

Feel free to contribute by submitting pull requests with improvements, new strategies, or bug fixes!

## 📜 License

This project is open source and available for educational and personal use.

## ⚠️ Disclaimer

This software is for educational and informational purposes only. It does not constitute financial advice. Always do your own research and consult with financial professionals before making investment decisions. Trading involves risk, and you may lose your capital.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the logs for error messages
3. Open an issue on GitHub with details

---

**Built with ❤️ for gold traders worldwide**
