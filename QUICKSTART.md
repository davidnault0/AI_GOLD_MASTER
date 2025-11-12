# Quick Start Guide

Get your AI Gold Master up and running in 5 minutes!

## Prerequisites

- Node.js (v14+) installed
- A Telegram account
- 5 minutes of your time

## Step 1: Get Telegram Credentials (2 minutes)

### Create Your Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "My Gold Trading Bot")
4. Choose a username (e.g., "my_gold_trading_bot")
5. **Copy the bot token** - you'll need this!

### Get Your Chat ID

1. Search for `@userinfobot` on Telegram
2. Start a conversation with it
3. It will send you your Chat ID
4. **Copy this number** - you'll need it!

Alternatively:
1. Start a chat with your bot (send `/start`)
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find your chat ID in the response

## Step 2: Install the System (1 minute)

```bash
# Clone the repository
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER

# Install dependencies
npm install
```

## Step 3: Configure (1 minute)

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file
nano .env   # or use any text editor
```

Add your credentials:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz   # Your bot token from @BotFather
TELEGRAM_CHAT_ID=123456789                                 # Your chat ID from @userinfobot
TRADING_NETWORK_URL=https://coach-pine-cloud.onrender.com
ANALYSIS_INTERVAL_MS=60000
MIN_CONFIDENCE_THRESHOLD=0.75
LOG_LEVEL=info
```

Save and close the file.

## Step 4: Test (30 seconds)

```bash
# Run the test suite
npm test
```

You should see:
```
✅ All tests passed successfully!
```

## Step 5: Start the System (30 seconds)

```bash
# Start the AI engine
npm start
```

You should see:
```
============================================================
AI GOLD MASTER - Starting 24/7 Analysis Engine
============================================================
```

## Step 6: Verify on Telegram

1. Open your Telegram chat with your bot
2. Send `/start` command
3. You should receive: "🤖 AI Gold Master Bot activated!"
4. Wait 1-2 minutes for the system to collect initial data
5. Trading signals will start appearing automatically

## Commands to Try

- `/start` - Activate the bot
- `/status` - Check if the bot is running
- `/help` - Get help

## What Happens Next?

The AI system will:

1. **Collect Data**: Gather market data from the trading network
2. **Analyze**: Run 4 different trading strategies every minute
3. **Select Best**: Choose the best strategy for current market conditions
4. **Send Signals**: When confidence is high (>75%), you'll receive a signal like:

```
🟢 📈 BUY SIGNAL - GOLD

Strategy: RSI Strategy
Confidence: 85% ██████████
Reason: RSI indicates oversold conditions (28.45). Strong buy signal.

Technical Indicators:
• rsi: 28.45
• currentPrice: 2045.67

⏰ 11/12/2025, 3:45:23 PM
```

## Troubleshooting

### Not receiving messages?

1. Check your bot token is correct in `.env`
2. Ensure you sent `/start` to your bot first
3. Verify your chat ID is correct
4. Check the logs: `cat logs/combined.log`

### System not starting?

1. Verify Node.js is installed: `node --version`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check the error message in the console

### Want more signals?

Lower the confidence threshold in `.env`:
```env
MIN_CONFIDENCE_THRESHOLD=0.65
```

### Want fewer signals?

Raise the confidence threshold:
```env
MIN_CONFIDENCE_THRESHOLD=0.85
```

## Running in Background

### On Linux/Mac (using PM2):

```bash
# Install PM2
npm install -g pm2

# Start the bot
pm2 start src/index.js --name "ai-gold-master"

# View logs
pm2 logs ai-gold-master

# Stop the bot
pm2 stop ai-gold-master
```

### On Windows:

Use a service manager like [node-windows](https://www.npmjs.com/package/node-windows) or run in a separate terminal window.

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review [SECURITY.md](SECURITY.md) for security best practices

## Need Help?

1. Check the [README.md](README.md) for detailed documentation
2. Review logs in `logs/` directory
3. Open an issue on GitHub

---

**Happy Trading! 🎯📈**

Remember: This is for educational purposes. Always verify signals independently before making trading decisions.
