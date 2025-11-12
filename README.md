
# AI_GOLD_MASTER 🏆📈

**Autonomous Gold Market Analysis AI with Telegram Integration**

An intelligent, autonomous system that continuously monitors and analyzes gold markets using multiple technical indicators and sends real-time trading signals via Telegram. Designed to run 24/7 on Render's cloud platform.

## 🌟 Features

### Autonomous Operation
- **24/7 Monitoring**: Continuously analyzes gold markets without manual intervention
- **Cloud Deployment**: Runs on Render.com for reliable, always-on operation
- **Health Monitoring**: Built-in health check endpoints for platform monitoring

### Advanced AI Analysis
- **Multi-Strategy Analysis**: Combines multiple technical indicators:
  - Moving Averages (SMA, EMA)
  - Relative Strength Index (RSI)
  - Trend Detection
  - Support/Resistance Levels
  - Volatility Analysis
- **Confidence Scoring**: Each signal includes a confidence score (0-100%)
- **Smart Filtering**: Only sends high-confidence signals to reduce noise

### Real-Time Telegram Notifications
- **Instant Signals**: Receive BUY/SELL/HOLD signals directly on Telegram
- **Detailed Analysis**: Each signal includes:
  - Signal type and confidence level
  - Current gold price
  - Technical indicators
  - Analysis reasoning
- **Status Updates**: Get notified when the bot starts/stops

### Multiple Data Sources
- Supports multiple market data APIs for reliability:
  - Alpha Vantage
  - Polygon.io
  - Finnhub
  - Free fallback sources

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Telegram account
- (Optional) API keys for market data providers

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow instructions to create your bot
3. Save the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
4. Start a chat with your new bot
5. Get your chat ID by visiting:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
   Look for the `"chat":{"id":` field

### 2. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# At minimum, set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID
nano .env  # or use your preferred editor

# Run the bot
python main.py
```

### 3. Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

1. **Create a Render Account**: Sign up at [render.com](https://render.com)

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select this repository

3. **Configure Environment Variables** in Render Dashboard:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token (required)
   - `TELEGRAM_CHAT_ID`: Your Telegram chat ID (required)
   - `ALPHA_VANTAGE_API_KEY`: (optional but recommended)
   - `POLYGON_API_KEY`: (optional)
   - `FINNHUB_API_KEY`: (optional)
   - `ANALYSIS_INTERVAL_SECONDS`: 300 (5 minutes, adjustable)
   - `CONFIDENCE_THRESHOLD`: 0.7 (70%, adjustable)

4. **Deploy**: Render will automatically deploy using `render.yaml`

5. **Verify**: Check your Telegram for the startup message!

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from BotFather | - | ✅ Yes |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID | - | ✅ Yes |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | - | Recommended |
| `POLYGON_API_KEY` | Polygon.io API key | - | Optional |
| `FINNHUB_API_KEY` | Finnhub API key | - | Optional |
| `ANALYSIS_INTERVAL_SECONDS` | Time between analysis cycles | 300 | Optional |
| `CONFIDENCE_THRESHOLD` | Minimum confidence to send signal (0-1) | 0.7 | Optional |
| `PORT` | Server port (auto-set by Render) | 8000 | Optional |

### Getting API Keys (Optional but Recommended)

While the bot can work with free data sources, having at least one API key provides more reliable data:

- **Alpha Vantage** (Free): [Get key](https://www.alphavantage.co/support/#api-key)
- **Polygon.io** (Free tier): [Sign up](https://polygon.io/)
- **Finnhub** (Free tier): [Sign up](https://finnhub.io/)

## 📊 How It Works

1. **Data Collection**: Fetches current gold prices from configured APIs
2. **Technical Analysis**: Calculates multiple indicators:
   - Simple Moving Averages (SMA 20, 50)
   - Exponential Moving Averages (EMA 12, 26)
   - Relative Strength Index (RSI)
   - Price volatility
   - Trend direction
   - Support/resistance levels
3. **Signal Generation**: Combines indicators using a scoring system
4. **Confidence Calculation**: Assigns confidence based on indicator agreement
5. **Smart Filtering**: Only sends signals above confidence threshold
6. **Telegram Notification**: Sends formatted signal with analysis

## 🔍 API Endpoints

The bot provides health check endpoints:

- `GET /` - Simple status check
- `GET /health` - Health check for monitoring (returns JSON)
- `GET /status` - Detailed status information

## 🛠️ Development

### Project Structure

```
AI_GOLD_MASTER/
├── main.py                    # Main application entry point
├── config.py                  # Configuration management
├── telegram_service.py        # Telegram bot integration
├── market_data_service.py     # Market data fetching
├── analysis_engine.py         # AI analysis engine
├── requirements.txt           # Python dependencies
├── render.yaml               # Render deployment config
├── .env.example              # Environment template
└── README.md                 # This file
```

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests (when available)
pytest
```

### Legacy Files

The repository also contains legacy TradingView Pine Script tools:
- `compile_pine_script.js` - Automated Pine Script compilation
- `package.json` - Node.js dependencies for Pine Script tools

## 📈 Signal Interpretation

### Signal Types
- 🟢 **BUY**: Multiple indicators suggest bullish conditions
- 🔴 **SELL**: Multiple indicators suggest bearish conditions  
- 🟡 **HOLD**: Mixed signals or neutral market conditions

### Confidence Levels
- **85-100%**: Very strong signal, high agreement among indicators
- **70-85%**: Good signal, majority of indicators agree
- **Below 70%**: Not sent (filtered out unless it's a significant change)

## ⚠️ Disclaimer

**This bot is for educational and informational purposes only.**

- Not financial advice
- Past performance does not guarantee future results
- Always do your own research (DYOR)
- Never invest more than you can afford to lose
- Trading and investing carry risk

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:
- New analysis strategies
- Additional data sources
- Bug fixes
- Documentation improvements

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the [Issues](https://github.com/davidnault0/AI_GOLD_MASTER/issues) page
2. Create a new issue with details about your problem
3. Include relevant logs and configuration (without sensitive data)

## 🎯 Roadmap

Future enhancements:
- [ ] Machine learning models for prediction
- [ ] Sentiment analysis from news sources
- [ ] Support for multiple trading pairs
- [ ] Backtesting framework
- [ ] Web dashboard for monitoring
- [ ] Discord integration
- [ ] Advanced pattern recognition

---

**Made with ❤️ for the trading community**