# Deployment Guide for Gold Analysis AI

## Quick Deploy to Render

### Prerequisites
- GitHub account
- Render account (free tier available at render.com)
- Telegram account

### Step 1: Create Your Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions:
   - Choose a name for your bot (e.g., "My Gold Analysis AI")
   - Choose a username (must end in 'bot', e.g., "my_gold_ai_bot")
4. **Save your bot token** - it looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
5. Start a chat with your new bot (click the link provided by BotFather)
6. Send any message to your bot (e.g., "Hello")

### Step 2: Get Your Chat ID

1. Open this URL in your browser (replace `<YOUR_BOT_TOKEN>` with your actual token):
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
2. Look for the `"chat":{"id":` field in the response
3. **Save your chat ID** - it's a number like: `123456789`

Example response:
```json
{
  "ok": true,
  "result": [{
    "message": {
      "chat": {
        "id": 123456789,  <-- This is your chat ID
        ...
      }
    }
  }]
}
```

### Step 3: Fork and Deploy to Render

1. **Fork this repository** to your GitHub account
   - Click "Fork" button at the top of the repository page

2. **Create a Render account**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account (recommended)

3. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your forked repository

4. **Configure the Service**
   - **Name**: `gold-analysis-ai` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main` or your working branch
   - **Build Command**: Leave as auto-detected or use: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`

5. **Add Environment Variables** (CRITICAL)
   Click "Advanced" and add these environment variables:
   
   **Required:**
   - `TELEGRAM_BOT_TOKEN`: Your bot token from Step 1
   - `TELEGRAM_CHAT_ID`: Your chat ID from Step 2
   
   **Optional but Recommended:**
   - `ALPHA_VANTAGE_API_KEY`: [Get free key](https://www.alphavantage.co/support/#api-key)
   - `POLYGON_API_KEY`: [Sign up at polygon.io](https://polygon.io/)
   - `FINNHUB_API_KEY`: [Sign up at finnhub.io](https://finnhub.io/)
   
   **Configuration (Optional):**
   - `ANALYSIS_INTERVAL_SECONDS`: `300` (5 minutes, adjust as needed)
   - `CONFIDENCE_THRESHOLD`: `0.7` (70% confidence minimum)

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait for the deployment to complete (usually 2-5 minutes)

### Step 4: Verify It's Working

1. Check the Render logs:
   - You should see: "🚀 Starting Gold Analysis AI Bot"
   - You should see: "✅ Telegram connection successful"

2. Check your Telegram:
   - You should receive a message: "✅ Gold Analysis AI is online and monitoring markets!"

3. Test the health endpoint:
   - Visit: `https://your-app-name.onrender.com/health`
   - You should see: `{"status": "healthy", ...}`

### Step 5: Monitor Your Bot

- **Telegram**: You'll receive trading signals directly in your chat
- **Render Dashboard**: Monitor logs and service health
- **Health Endpoint**: `https://your-app-name.onrender.com/health`
- **Status Endpoint**: `https://your-app-name.onrender.com/status`

## Troubleshooting

### Bot Not Sending Messages
- Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are correct
- Make sure you started a chat with your bot
- Check Render logs for error messages

### No Market Data
- Add at least one API key (Alpha Vantage recommended)
- The bot will use simulated data if no API keys are configured
- Check API rate limits if using free tier

### Service Not Starting
- Check Render logs for errors
- Verify all dependencies installed correctly
- Ensure Python version is 3.8+

### Rate Limiting
- Free API tiers have rate limits
- Increase `ANALYSIS_INTERVAL_SECONDS` to reduce API calls
- Consider upgrading to paid API tiers

## Cost Considerations

### Free Tier (Render + Free APIs)
- ✅ Render Free Tier: Free (with some limitations)
- ✅ Telegram: Free
- ✅ Alpha Vantage Free: 25 API calls/day
- ✅ Total: $0/month

**Note**: Render free tier may sleep after 15 minutes of inactivity. Upgrade to paid tier ($7/month) for 24/7 operation.

### Recommended Setup
- Render Starter Plan: $7/month (always-on)
- Alpha Vantage Premium: $49/month (optional, for real-time data)
- Polygon.io Basic: $29/month (optional, alternative data source)

## Customization

### Adjust Analysis Frequency
Set `ANALYSIS_INTERVAL_SECONDS` in Render environment variables:
- `180` = 3 minutes (more frequent)
- `300` = 5 minutes (default)
- `600` = 10 minutes (less frequent)

### Adjust Signal Sensitivity
Set `CONFIDENCE_THRESHOLD` (0.0 to 1.0):
- `0.6` = More signals (60% confidence)
- `0.7` = Default (70% confidence)
- `0.8` = Fewer, higher confidence signals (80%)

### Change Gold Symbol
Currently hardcoded to `XAUUSD`. Modify `config.py` to track different assets.

## Support

For issues:
1. Check [GitHub Issues](https://github.com/davidnault0/AI_GOLD_MASTER/issues)
2. Review Render logs for errors
3. Verify all environment variables are set correctly
4. Create a new issue with error details

## Updating the Bot

To update your deployed bot with new code:
1. Pull latest changes to your fork
2. Render will automatically redeploy (if auto-deploy enabled)
3. Or manually deploy from Render dashboard

---

**Good luck with your autonomous gold trading AI! 🏆📈**
