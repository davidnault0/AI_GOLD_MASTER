# Quick Start Guide - XAU/USD AI Trading Bot

## 🚀 5-Minute Setup

Follow these steps to get your bot running on Render in minutes.

## Step 1: Get Your API Keys (5 minutes)

### 1.1 Twelve Data API Key
1. Visit https://twelvedata.com/
2. Click "Get API Key" (free tier is fine)
3. Complete the signup
4. Copy your API key from the dashboard
5. **Save it**: `TWELVE_DATA_API_KEY=your_key_here`

### 1.2 Telegram Bot Token
1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Choose a name: e.g., "My Gold Trading Bot"
5. Choose a username: e.g., "mygold_trading_bot"
6. Copy the token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
7. **Save it**: `TELEGRAM_BOT_TOKEN=123456789:ABCdefGHI...`

### 1.3 Get Your Telegram Chat ID
1. Search for `@userinfobot` on Telegram
2. Start a chat with it (`/start`)
3. It will reply with your User ID (a number like `123456789`)
4. **Save it**: `TELEGRAM_CHAT_ID=123456789`

### 1.4 Start Your Bot
**Important**: Before deploying, you must start a conversation with your bot!
1. Open Telegram
2. Search for your bot by username (e.g., `@mygold_trading_bot`)
3. Click "Start" or send `/start`
4. You should see "Bot started" message (it won't respond yet, that's normal)

## Step 2: Deploy to Render (3 minutes)

### 2.1 Fork or Push to GitHub
If you haven't already:
```bash
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER

# Push to your own GitHub repo
git remote set-url origin https://github.com/YOUR_USERNAME/AI_GOLD_MASTER.git
git push
```

### 2.2 Create Render Account
1. Go to https://render.com/
2. Sign up (free)
3. Connect your GitHub account

### 2.3 Create New Web Service
1. Click "New +" → "Web Service"
2. Select your repository: `AI_GOLD_MASTER`
3. Configure:
   - **Name**: `xauusd-trading-bot`
   - **Environment**: `Docker`
   - **Plan**: Choose "Starter" ($7/mo for 24/7) or "Free" (for testing)
   - **Dockerfile Path**: `./Dockerfile`

### 2.4 Add Environment Variables
In the "Environment" section, click "Add Environment Variable" and add these **one by one**:

```
TWELVE_DATA_API_KEY → your_actual_api_key
TELEGRAM_BOT_TOKEN → your_actual_bot_token
TELEGRAM_CHAT_ID → your_actual_chat_id
ANALYSIS_INTERVAL_SECONDS → 300
STATUS_UPDATE_INTERVAL_SECONDS → 3600
PORT → 10000
```

### 2.5 Configure Health Check
Scroll to "Health Check":
- **Health Check Path**: `/health`

### 2.6 Deploy!
1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Monitor the logs for "Bot started successfully"

## Step 3: Verify It's Working (2 minutes)

### 3.1 Check Telegram
Within 1 minute, you should receive:
- ✅ "XAU/USD AI Trading Bot started successfully!"

Within 5 minutes, you should see:
- 📊 First market analysis
- 🟢/🔴 Trading signal (if confidence > 60%)

### 3.2 Check Render Logs
In Render dashboard:
1. Go to your service
2. Click "Logs"
3. Look for:
   ```
   Starting XAU/USD AI Trading Bot...
   Bot is now running
   Starting market analysis cycle...
   Current XAU/USD: $2,XXX.XX
   ```

### 3.3 Check Health Endpoint
Open in browser:
```
https://your-service-name.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "last_check": "2025-11-12T...",
  "market_data_ok": true
}
```

## 🎉 You're Done!

Your bot is now:
- ✅ Running 24/7 on Render
- ✅ Analyzing XAU/USD every 5 minutes
- ✅ Sending trading signals to your Telegram
- ✅ Providing stop-loss and take-profit levels
- ✅ Giving periodic status updates

## What Happens Next?

### Every 5 Minutes
- Bot fetches current XAU/USD price
- Analyzes 100 historical data points
- Calculates technical indicators
- Generates signal if confidence > 60%
- Sends to your Telegram

### Every Hour
- Bot sends market status update
- Shows current price, RSI, trends

### When Signal Generated
You'll receive a message like:

```
🟢 XAU/USD Trading Signal 🟢

Signal: BUY
Confidence: 78%
Current Price: $2,045.50

📊 Trading Levels:
• Stop Loss: $2,038.20
• Take Profit: $2,058.40
• Support: $2,040.00
• Resistance: $2,052.00

📈 Indicators:
• RSI: 34.50
• SMA(20): $2,043.20
• MACD: Bullish crossover

💡 Analysis:
• RSI oversold: 34.50
• Bullish trend: SMA(20) > SMA(50)
• MACD bullish crossover
```

## Troubleshooting

### ❌ No Telegram Messages
1. Did you start a chat with your bot first?
2. Is `TELEGRAM_CHAT_ID` correct? (check @userinfobot)
3. Is `TELEGRAM_BOT_TOKEN` correct? (check @BotFather)
4. Check Render logs for errors

### ❌ "Market data failed"
1. Is `TWELVE_DATA_API_KEY` correct?
2. Check your API usage at twelvedata.com (might be rate limited)
3. Add `ALPHA_VANTAGE_API_KEY` as backup (optional)

### ❌ Service won't start
1. Check Render logs for errors
2. Verify all environment variables are set
3. Make sure you selected "Docker" environment

### ❌ Getting signals but they're not accurate
- This is normal! The AI provides suggestions, not guarantees
- Market conditions vary
- Use signals as one input among many
- Always do your own research

## Customization

### Change Analysis Frequency
Set `ANALYSIS_INTERVAL_SECONDS`:
- `60` = 1 minute (very active, requires paid API)
- `300` = 5 minutes (default, balanced)
- `900` = 15 minutes (conservative)
- `3600` = 1 hour (long-term)

### Change Signal Threshold
Edit `ai_analyzer.py` line 221:
```python
self.signal_confidence_threshold = 0.7  # 70% instead of 60%
```
Higher = fewer but more reliable signals

## Support

- **Documentation**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: Open an issue on GitHub
- **API Docs**: 
  - Twelve Data: https://twelvedata.com/docs
  - Telegram: https://core.telegram.org/bots/api

## ⚠️ Important Disclaimer

This bot provides **educational trading signals** only. It is **NOT financial advice**.
- Trading involves significant risk
- Past performance ≠ future results
- Always do your own research
- Never trade with money you can't afford to lose
- Consult a licensed financial advisor

## Next Steps

1. Monitor signals for a few days
2. Track accuracy in a spreadsheet
3. Adjust confidence threshold if needed
4. Customize indicators in `ai_analyzer.py`
5. Add more instruments if desired

Happy trading! 📈🤖
