
# AI_GOLD_MASTER 🤖💰

Advanced AI-powered Gold Trading System with Multi-Timeframe Analysis, Telegram Integration, and Real-time Web Interface.

## Features

### 🎯 Advanced Trading Strategies
- **Multi-Timeframe Analysis (MTF)**: Analyzes 6 timeframes (1m, 5m, 15m, 1h, 4h, 1d) simultaneously
- **Complex Technical Indicators**:
  - Multiple EMA (9, 21, 50, 200) for trend detection
  - RSI (Relative Strength Index) for momentum
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands for volatility
- **Smart Signal Generation**: Confluence-based signals with confidence scoring
- **Risk Management**: Automatic position sizing, stop-loss, and take-profit calculations

### 📊 Continuous Market Analysis
- Real-time market monitoring
- Automatic signal detection
- Volatility assessment
- Market condition analysis
- Opportunity identification across all timeframes

### 📱 Telegram Integration
- Instant trading signals with detailed analysis
- Market updates and alerts
- Interactive bot commands
- Signal history tracking
- Real-time notifications

### 🖥️ AI Interaction Server
- Web-based dashboard for system control
- Real-time data visualization
- WebSocket support for live updates
- RESTful API for programmatic access
- Start/stop analyzer controls
- Manual analysis triggers

### 🧪 Comprehensive Testing
- Unit tests for all strategies
- Integration tests for full system
- Environment validation
- Mock data generation for testing

## Installation

1. Clone the repository:
```bash
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env file with your Telegram credentials
```

## Configuration

### Telegram Setup

1. Create a Telegram bot:
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Send `/newbot` and follow instructions
   - Copy the bot token

2. Get your chat ID:
   - Message [@userinfobot](https://t.me/userinfobot)
   - Copy your chat ID

3. Update `.env` file:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
PORT=3000
```

### Strategy Configuration

Edit `index.js` to customize trading parameters:
```javascript
const config = {
    strategy: {
        timeframes: ['1m', '5m', '15m', '1h', '4h', '1d'],
        minSignalStrength: 0.7,  // 70% confidence threshold
        riskPerTrade: 0.02,       // 2% risk per trade
        stopLossPercent: 0.015,   // 1.5% stop loss
        takeProfitPercent: 0.03   // 3% take profit
    },
    analyzer: {
        updateInterval: 60000,    // Update every 60 seconds
        symbol: 'XAUUSD'
    }
};
```

## Usage

### Start the System

```bash
npm start
```

The system will:
1. Initialize the AI trading engine
2. Start market analysis
3. Enable Telegram notifications
4. Launch the web interface at http://localhost:3000

### Run Tests

```bash
# Run strategy tests
npm test

# Run integration tests
npm run test:integration

# Run all tests
npm run test:all
```

### Web Interface

Access the dashboard at `http://localhost:3000`

Features:
- System status monitoring
- Real-time signal display
- Start/stop analyzer controls
- Manual analysis triggers
- Live log viewer
- Signal history

### API Endpoints

- `GET /health` - Health check
- `GET /api/status` - System status
- `GET /api/market/latest` - Latest market data
- `POST /api/analyze` - Trigger manual analysis
- `POST /api/analyzer/start` - Start analyzer
- `POST /api/analyzer/stop` - Stop analyzer
- `POST /api/telegram/test` - Test Telegram connection
- `GET /api/signals/history` - Get signal history

### Telegram Commands

Once the bot is running, you can interact with it:
- `/start` - Welcome message
- `/help` - Show available commands
- `/status` - Get bot status
- `/signals` - View recent signals
- `/market` - Get market update
- `/config` - View configuration

## Architecture

```
AI_GOLD_MASTER/
├── src/
│   ├── strategies/
│   │   └── goldStrategy.js      # Advanced trading strategy
│   ├── analysis/
│   │   └── marketAnalyzer.js    # Market analysis engine
│   ├── telegram/
│   │   └── telegramBot.js       # Telegram integration
│   ├── server/
│   │   └── aiServer.js          # Express server & WebSocket
│   └── tests/
│       ├── test_strategy.js     # Strategy unit tests
│       └── test_integration.js  # Integration tests
├── index.js                     # Main application
├── compile_pine_script.js       # Pine Script compiler
├── package.json                 # Dependencies
├── .env.example                 # Environment template
└── README.md                    # This file
```

## Technical Indicators Explained

### EMA (Exponential Moving Average)
- Fast EMA (9): Short-term trend
- Medium EMA (21): Medium-term trend
- Slow EMA (50): Long-term trend
- Long EMA (200): Major trend

### RSI (Relative Strength Index)
- Above 70: Overbought (potential reversal)
- Below 30: Oversold (potential reversal)
- 50: Neutral

### MACD
- Histogram > 0: Bullish momentum
- Histogram < 0: Bearish momentum

### Bollinger Bands
- Price at upper band: Potentially overbought
- Price at lower band: Potentially oversold

## Signal Confidence

Signals are generated with a confluence score based on:
- Trend alignment across timeframes (30%)
- RSI conditions (20%)
- MACD momentum (15%)
- Bollinger Bands position (15%)
- Overall timeframe agreement (20%)

Minimum confidence threshold: 70% (configurable)

## Risk Management

- **Position Sizing**: Automatic calculation based on account balance
- **Risk Per Trade**: Default 2% of account
- **Stop Loss**: Default 1.5% from entry
- **Take Profit**: Default 3% from entry
- **Risk/Reward Ratio**: 2:1

## Development

### Adding New Strategies

1. Create a new file in `src/strategies/`
2. Implement the strategy class
3. Update `index.js` to use the new strategy

### Adding New Indicators

1. Add calculation method to `goldStrategy.js`
2. Integrate into `analyzeSingleTimeframe()`
3. Update signal strength calculation

### Testing

All tests are in `src/tests/`. Run them frequently to ensure stability.

## Troubleshooting

### Telegram Not Working
- Verify bot token and chat ID in `.env`
- Check bot was started in Telegram (send `/start` to your bot)
- Ensure bot has permission to send messages

### Server Won't Start
- Check if port 3000 is available
- Try changing PORT in `.env`
- Check firewall settings

### No Signals Generated
- Lower `minSignalStrength` threshold
- Ensure market data is updating
- Check analyzer status in web interface

## Security Notes

- Never commit `.env` file with real credentials
- Keep API keys and tokens secure
- Use environment variables for sensitive data
- Regularly update dependencies

## Contribution

Feel free to contribute by submitting pull requests with improvements, new strategies, or bug fixes!

## License

MIT License - feel free to use and modify for your needs.

## Disclaimer

This software is for educational purposes only. Trading involves risk. Always do your own research and never trade with money you cannot afford to lose. Past performance does not guarantee future results.

---

**Built with ❤️ for algorithmic trading enthusiasts**
