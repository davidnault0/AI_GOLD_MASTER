# Testing Guide - AI Gold Master 🧪

This guide will walk you through testing the AI Gold Master trading system step-by-step.

## Prerequisites

Before testing, ensure you have:
- Node.js 14.0.0 or higher installed
- Git installed
- Terminal/command line access

## Quick Test (5 minutes)

### Step 1: Clone and Install
```bash
# Clone the repository
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER

# Install dependencies (takes ~1 minute)
npm install
```

### Step 2: Run Unit Tests
```bash
# Test all trading strategies and indicators
npm test
```

**Expected Output:**
```
✓ Strategy Initialization
✓ EMA Calculation
✓ RSI Calculation
✓ MACD Calculation
✓ Bollinger Bands Calculation
✓ Trend Detection
✓ Single Timeframe Analysis
✓ Multi-Timeframe Analysis
✓ Position Size Calculation
✓ Edge Case Handling

ALL TESTS COMPLETED SUCCESSFULLY ✓
```

### Step 3: Run Integration Tests
```bash
# Test the complete system
npm run test:integration
```

**Expected Output:**
```
INTEGRATION TEST - AI GOLD MASTER SYSTEM
- Market analyzer started
- Telegram bot initialized
- AI Server running on port 3001
- Received 3 analyses
✅ INTEGRATION TEST COMPLETED SUCCESSFULLY
```

### Step 4: Test the Live System
```bash
# Start the application
npm start
```

**What happens:**
1. System initializes and starts market analysis
2. Web server starts on http://localhost:3000
3. Telegram bot initializes (works in simulation mode without credentials)
4. Market analyzer begins monitoring (updates every 60 seconds)

**Expected Console Output:**
```
==================================================
🤖 AI GOLD MASTER TRADING SYSTEM
==================================================

Telegram configuration missing. Bot will run in simulation mode.
Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env file
🚀 AI Server running on http://0.0.0.0:3000
Starting market analysis for XAUUSD...
[Time] Market analyzed: NEUTRAL (0.0%)
✅ Market analyzer started

✅ All systems initialized successfully!

System Status:
- Market Analyzer: Running
- Telegram Bot: Enabled
- AI Server: Running on port 3000

Access the web interface at: http://localhost:3000

Press Ctrl+C to stop
```

### Step 5: Test the Web Dashboard

1. **Open your browser** and go to: `http://localhost:3000`

2. **You should see:**
   - System status panel
   - Control buttons (Start, Stop, Analyze Now, Test Telegram)
   - Recent signals display
   - Real-time log viewer

3. **Try these actions:**
   - Click "🔍 Analyze Now" - triggers immediate market analysis
   - Click "📱 Test Telegram" - sends a test message (shown in console)
   - Watch the Real-time Log for updates

4. **Stop the system:** Press `Ctrl+C` in the terminal

## Complete Test Suite

### Run All Tests Together
```bash
npm run test:all
```

This runs both unit tests and integration tests sequentially.

## Testing Individual Components

### 1. Test Trading Strategy
```bash
node src/tests/test_strategy.js
```

**What it tests:**
- EMA (Exponential Moving Average) calculations
- RSI (Relative Strength Index) calculations
- MACD (Moving Average Convergence Divergence) calculations
- Bollinger Bands calculations
- Trend detection algorithm
- Multi-timeframe analysis
- Signal generation
- Position sizing
- Edge cases and error handling

### 2. Test Market Analyzer
```bash
node src/tests/test_integration.js
```

**What it tests:**
- Market data generation
- Continuous analysis loop
- Event emission (analysis, signal, status)
- Integration with strategy module
- Server initialization
- Telegram integration
- Graceful shutdown

## Testing with Telegram (Optional)

### Step 1: Set Up Telegram Bot
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
# nano .env  (or use any text editor)
```

Add your credentials:
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
PORT=3000
```

### Step 2: Get Telegram Credentials

**Create a Bot:**
1. Open Telegram app
2. Search for `@BotFather`
3. Send: `/newbot`
4. Follow prompts to create your bot
5. Copy the bot token

**Get Your Chat ID:**
1. Search for `@userinfobot` on Telegram
2. Send any message
3. Copy your chat ID (the number shown)

### Step 3: Test Telegram Integration
```bash
# Start the system
npm start
```

Now you should receive a message on Telegram:
```
ℹ️ **ALERT** ℹ️

AI Gold Master system started

_[timestamp]_
```

## API Testing

### Using curl

**Check Health:**
```bash
curl http://localhost:3000/health
```

**Get System Status:**
```bash
curl http://localhost:3000/api/status
```

**Get Latest Market Data:**
```bash
curl http://localhost:3000/api/market/latest
```

**Trigger Manual Analysis:**
```bash
curl -X POST http://localhost:3000/api/analyze
```

**Start Analyzer:**
```bash
curl -X POST http://localhost:3000/api/analyzer/start
```

**Stop Analyzer:**
```bash
curl -X POST http://localhost:3000/api/analyzer/stop
```

**Test Telegram:**
```bash
curl -X POST http://localhost:3000/api/telegram/test
```

**Get Signal History:**
```bash
curl http://localhost:3000/api/signals/history?limit=5
```

### Using Postman or Thunder Client

Import these requests:

```json
{
  "name": "AI Gold Master API",
  "requests": [
    {
      "name": "Health Check",
      "method": "GET",
      "url": "http://localhost:3000/health"
    },
    {
      "name": "System Status",
      "method": "GET",
      "url": "http://localhost:3000/api/status"
    },
    {
      "name": "Trigger Analysis",
      "method": "POST",
      "url": "http://localhost:3000/api/analyze"
    }
  ]
}
```

## WebSocket Testing

### Using JavaScript

```javascript
// Connect to WebSocket
const socket = io('http://localhost:3000');

// Listen for events
socket.on('connect', () => {
    console.log('Connected to AI Gold Master');
});

socket.on('analysis', (data) => {
    console.log('New analysis:', data);
});

socket.on('signal', (data) => {
    console.log('Trading signal:', data);
});

socket.on('status', (data) => {
    console.log('Status update:', data);
});
```

### Using Browser Console

1. Open http://localhost:3000
2. Open browser DevTools (F12)
3. Go to Console tab
4. The page already has Socket.IO loaded, check for events in the console

## Troubleshooting Tests

### Tests Fail

**Issue:** `Cannot find module`
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue:** `Port already in use`
```bash
# Solution: Kill the process using port 3000
# On Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

### Integration Test Times Out

```bash
# Run with longer timeout
timeout 30 npm run test:integration
```

### Telegram Not Working

1. **Check credentials:**
   ```bash
   cat .env
   ```

2. **Verify bot is started:**
   - Send `/start` to your bot in Telegram
   
3. **Test manually:**
   ```bash
   npm start
   # Look for: "Telegram bot initialized"
   # Not: "Telegram configuration missing"
   ```

## Performance Testing

### Load Test the API

```bash
# Install Apache Bench (if not installed)
# Ubuntu/Debian: sudo apt-get install apache2-utils
# Mac: brew install httpd

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3000/api/status
```

### Stress Test Market Analyzer

Edit `index.js` and change:
```javascript
analyzer: {
    updateInterval: 1000  // Update every second (instead of 60000)
}
```

Then run and monitor CPU/memory usage.

## Continuous Testing

### Watch Mode (Linux/Mac)

```bash
# Install watch
# Ubuntu/Debian: sudo apt-get install watch
# Mac: brew install watch

# Run tests every 2 seconds
watch -n 2 npm test
```

### Git Pre-commit Hook

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi
```

```bash
chmod +x .git/hooks/pre-commit
```

## Test Coverage

Currently tested:
- ✅ Strategy calculations (EMA, RSI, MACD, BB)
- ✅ Trend detection
- ✅ Signal generation
- ✅ Position sizing
- ✅ Market analysis engine
- ✅ Event handling
- ✅ Server startup/shutdown
- ✅ API endpoints
- ✅ Telegram integration
- ✅ WebSocket communication
- ✅ Error handling
- ✅ Edge cases

Not yet tested (requires real data):
- ⏺ Live market data integration
- ⏺ Order execution
- ⏺ Trade management
- ⏺ Performance over time
- ⏺ Backtesting with historical data

## Next Steps After Testing

1. **Configure for Production:**
   - Add real market data API (TradingView, MetaTrader)
   - Set up Telegram notifications
   - Configure risk parameters

2. **Monitor Performance:**
   - Track signal accuracy
   - Monitor system resources
   - Log all trades

3. **Backtest:**
   - Gather historical data
   - Run strategy on past data
   - Optimize parameters

## Common Test Scenarios

### Scenario 1: Basic Functionality Test (5 min)
```bash
npm install
npm test
npm start
# Open http://localhost:3000
# Ctrl+C to stop
```

### Scenario 2: Full System Test (10 min)
```bash
npm install
npm run test:all
cp .env.example .env
# Edit .env with Telegram credentials
npm start
# Check Telegram for messages
# Test web dashboard
# Test API endpoints
```

### Scenario 3: Development Test (ongoing)
```bash
npm start  # Keep running
# Make code changes
# Save files
# Restart with Ctrl+C then npm start
# Check tests: npm test
```

## Test Results Interpretation

### Unit Tests

**All Pass (✓):**
- System is functioning correctly
- All calculations are accurate
- Signal generation works as expected

**Some Fail (✗):**
- Check error messages
- Verify indicator calculations
- Review test data

### Integration Tests

**Success:**
- All components communicate properly
- Events are emitted correctly
- Server responds to requests

**Failure:**
- Check port availability
- Verify module imports
- Review event handlers

## Support

If tests fail or you encounter issues:

1. Check this guide for troubleshooting
2. Review USAGE.md for configuration
3. Check README.md for requirements
4. Open an issue on GitHub with:
   - Node.js version (`node --version`)
   - Operating system
   - Error messages
   - Steps to reproduce

---

**Ready to test? Start with the Quick Test above! 🚀**
