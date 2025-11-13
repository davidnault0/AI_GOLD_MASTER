# Usage Guide - AI Gold Master

## Quick Start

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

### 2. Configure Telegram (Optional but Recommended)

#### Create a Telegram Bot:
1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### Get Your Chat ID:
1. Search for [@userinfobot](https://t.me/userinfobot) on Telegram
2. Send any message
3. Copy your chat ID (a number like: `123456789`)

#### Update .env:
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
PORT=3000
```

### 3. Start the System
```bash
npm start
```

### 4. Access the Web Dashboard
Open your browser and go to: `http://localhost:3000`

## Testing

### Run All Tests
```bash
# Strategy tests
npm test

# Integration tests
npm run test:integration

# All tests
npm run test:all
```

## Web Dashboard Features

### Main Controls
- **▶️ Start Analyzer**: Begin continuous market analysis
- **⏸️ Stop Analyzer**: Pause market analysis
- **🔍 Analyze Now**: Trigger immediate manual analysis
- **📱 Test Telegram**: Send a test message to verify Telegram setup

### Status Panel
Shows real-time status of:
- Market analyzer state
- Telegram bot configuration
- Server information
- Data points for each timeframe

### Signal Display
- Recent trading signals
- Direction (LONG/SHORT)
- Entry price
- Timestamp
- Color-coded by direction (green for LONG, red for SHORT)

### Real-time Log
- Live system events
- Analysis results
- Signal notifications
- Status updates

## API Usage

### Check System Status
```bash
curl http://localhost:3000/api/status
```

### Get Latest Market Data
```bash
curl http://localhost:3000/api/market/latest
```

### Trigger Manual Analysis
```bash
curl -X POST http://localhost:3000/api/analyze
```

### Start/Stop Analyzer
```bash
# Start
curl -X POST http://localhost:3000/api/analyzer/start

# Stop
curl -X POST http://localhost:3000/api/analyzer/stop
```

### Test Telegram
```bash
curl -X POST http://localhost:3000/api/telegram/test
```

### Get Signal History
```bash
curl http://localhost:3000/api/signals/history?limit=10
```

## Telegram Bot Commands

Once your bot is running, you can interact with it in Telegram:

- `/start` - Initialize the bot
- `/help` - Show all available commands
- `/status` - Get current bot status
- `/signals` - View recent trading signals
- `/market` - Get current market update
- `/config` - View bot configuration

## Understanding Signals

### Signal Format
Each signal includes:
- **Symbol**: Trading pair (XAUUSD)
- **Direction**: LONG (buy) or SHORT (sell)
- **Confidence**: Percentage showing signal strength
- **Entry Price**: Recommended entry point
- **Stop Loss**: Risk management exit point
- **Take Profit**: Target profit level
- **Risk/Reward Ratio**: Potential profit vs potential loss

### Example Signal
```
🟢 **GOLD TRADING SIGNAL** 🟢

**Symbol:** XAUUSD
**Direction:** LONG
**Confidence:** 75.0%
**Entry Price:** $1950.00
**Stop Loss:** $1920.75
**Take Profit:** $2009.50
**Risk/Reward:** 2.00

**Multi-Timeframe Analysis:**
📈 1m: LONG (80%)
📈 5m: LONG (75%)
📈 15m: LONG (70%)
📈 1h: LONG (85%)
📈 4h: LONG (65%)
➡️ 1d: NEUTRAL (40%)

**Market Condition:** normal
**Volatility:** 5.23%

_Timestamp: 2025-11-13T01:46:44.000Z_
```

### Signal Interpretation

#### Confidence Levels:
- **70-100%**: High confidence - Strong signal
- **50-70%**: Medium confidence - Moderate signal
- **<50%**: Low confidence - Signal not actionable

#### Multi-Timeframe Agreement:
- **All timeframes aligned**: Very strong signal
- **Most timeframes aligned**: Good signal
- **Mixed signals**: Wait for better opportunity

#### Market Conditions:
- **low_volatility**: Stable market, smaller movements
- **normal**: Regular market behavior
- **volatile**: Larger price swings expected
- **highly_volatile**: Use smaller position sizes

## Configuration

### Strategy Parameters (index.js)

```javascript
strategy: {
    timeframes: ['1m', '5m', '15m', '1h', '4h', '1d'],
    minSignalStrength: 0.7,      // 70% minimum confidence
    riskPerTrade: 0.02,           // 2% account risk per trade
    stopLossPercent: 0.015,       // 1.5% stop loss
    takeProfitPercent: 0.03,      // 3% take profit
    emaFast: 9,                   // Fast EMA period
    emaMedium: 21,                // Medium EMA period
    emaSlow: 50,                  // Slow EMA period
    emaLong: 200,                 // Long-term EMA
    rsiPeriod: 14,                // RSI calculation period
    rsiOverbought: 70,            // RSI overbought level
    rsiOversold: 30,              // RSI oversold level
    bbPeriod: 20,                 // Bollinger Bands period
    bbStdDev: 2                   // Standard deviations
}
```

### Analyzer Configuration

```javascript
analyzer: {
    updateInterval: 60000,        // Update every 60 seconds
    symbol: 'XAUUSD',            // Trading symbol
    dataHistorySize: 500          // Historical data points to keep
}
```

### Server Configuration

```javascript
server: {
    port: 3000,                   // Server port
    host: '0.0.0.0'              // Listen on all interfaces
}
```

## Monitoring

### Via Web Dashboard
- Access `http://localhost:3000`
- Monitor real-time log
- Check system status
- View recent signals

### Via Telegram
- Receive instant signal notifications
- Get market updates
- Use bot commands for status checks

### Via API
- Poll `/api/status` endpoint
- Monitor `/api/market/latest`
- Subscribe to WebSocket events

## WebSocket Events

Connect to the server using Socket.IO:

```javascript
const socket = io('http://localhost:3000');

// Listen for events
socket.on('analysis', (data) => {
    console.log('New analysis:', data);
});

socket.on('signal', (data) => {
    console.log('New signal:', data);
});

socket.on('status', (data) => {
    console.log('Status update:', data);
});
```

## Best Practices

### 1. Risk Management
- Never risk more than 2-3% per trade
- Always use stop losses
- Start with smaller position sizes
- Diversify across different strategies

### 2. Signal Validation
- Wait for high confidence signals (>70%)
- Check timeframe confluence
- Consider market conditions
- Validate with multiple indicators

### 3. Monitoring
- Check the system regularly
- Monitor Telegram for signals
- Review signal history
- Adjust parameters based on performance

### 4. Testing
- Run tests regularly
- Backtest strategies before live trading
- Use paper trading first
- Keep detailed trade logs

## Troubleshooting

### System Won't Start
```bash
# Check if port is in use
lsof -i :3000

# Try a different port
PORT=3001 npm start

# Check logs
npm start 2>&1 | tee app.log
```

### No Signals Generated
- Lower `minSignalStrength` in config
- Check analyzer is running: Visit `/api/status`
- Verify market data is updating
- Wait for sufficient data accumulation (needs 200+ points)

### Telegram Not Working
- Verify bot token and chat ID in `.env`
- Send `/start` to your bot in Telegram
- Test connection: `curl -X POST http://localhost:3000/api/telegram/test`
- Check bot has permission to send messages

### High CPU Usage
- Increase `updateInterval` (e.g., 120000 for 2 minutes)
- Reduce number of timeframes
- Lower `dataHistorySize`

## Advanced Usage

### Custom Indicators
Add new indicators in `src/strategies/goldStrategy.js`:

```javascript
calculateCustomIndicator(data) {
    // Your indicator logic
    return result;
}
```

### New Strategies
Create a new strategy file:

```javascript
// src/strategies/myStrategy.js
class MyStrategy extends GoldStrategy {
    analyzeSingleTimeframe(priceData) {
        // Your custom analysis
        return signal;
    }
}
```

### Multiple Symbols
Modify `index.js` to support multiple symbols:

```javascript
const symbols = ['XAUUSD', 'EURUSD', 'BTCUSD'];
symbols.forEach(symbol => {
    const analyzer = new MarketAnalyzer(strategy, { symbol });
    analyzer.start();
});
```

## Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/davidnault0/AI_GOLD_MASTER/issues
- Pull Requests Welcome!

## Disclaimer

**This software is for educational purposes only.**

- Trading involves significant risk
- Past performance doesn't guarantee future results
- Always do your own research
- Never trade with money you can't afford to lose
- Consider consulting a financial advisor

---

Happy Trading! 📈💰
