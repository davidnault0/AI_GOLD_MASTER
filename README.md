
# 🏆 AI GOLD MASTER - Real-Time Gold Analysis AI

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Pine Script v6](https://img.shields.io/badge/Pine%20Script-v6-blue)](https://www.tradingview.com/)

> **Artificial Intelligence for real-time gold (XAUUSD) market analysis with automated buy/sell signal generation**

[🇫🇷 Documentation en Français](./README_FR.md)

## 🎯 Overview

**AI Gold Master** is a sophisticated artificial intelligence system that analyzes the gold market (XAUUSD) in real-time and automatically generates trading signals (BUY/SELL) based on multiple technical indicators.

## ✨ Key Features

### 📊 Comprehensive Technical Analysis
- **Exponential Moving Averages (EMA)**: 9, 21, 50 periods
- **Simple Moving Average (SMA)**: 200 periods
- **RSI (Relative Strength Index)**: Overbought/oversold detection
- **MACD**: Trend and momentum identification
- **Bollinger Bands**: Volatility analysis
- **ATR (Average True Range)**: Volatility measurement
- **Volume Analysis**: Movement confirmation
- **Stochastic Oscillator**: Reversal signals

### 🎯 Scoring System
The system generates a score out of 10 for BUY and SELL signals based on:
- EMA crossovers (2 points)
- RSI levels (1.5 points)
- MACD signals (1.5 points)
- Bollinger Bands position (1 point)
- Trend confirmation (2 points)
- Volume spikes (1 point)
- Stochastic signals (1 point)

### 🔔 Generated Signals
- **BUY** 🟢: Score ≥ 3.0 with bullish conditions
- **SELL** 🔴: Score ≥ 3.0 with bearish conditions
- **WAIT** ⚪: No clear signal

## 📦 Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Install Dependencies

```bash
# Clone the repository
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER

# Install dependencies
npm install
```

## 🚀 Usage

### Run Real-Time Analysis

```bash
npm start
```

### Custom Configuration

You can modify parameters in `index.js`:

```javascript
const config = {
    symbol: 'XAUUSD',               // Symbol to analyze
    interval: '5m',                  // Interval: 1m, 5m, 15m, 1h, 4h, 1d
    updateFrequency: 30000,          // Update frequency in ms
    rsiPeriod: 14,                   // RSI period
    rsiOverbought: 70,               // Overbought threshold
    rsiOversold: 30,                 // Oversold threshold
    emaFast: 9,                      // Fast EMA
    emaSlow: 21,                     // Slow EMA
    emaTrend: 50,                    // Trend EMA
    signalThreshold: 3.0             // Minimum signal threshold
};
```

## 📈 TradingView Integration

### Add Pine Script Indicator

1. Open TradingView and go to Pine Editor
2. Copy the content of `gold_analysis_ai.pine`
3. Click "Add to Chart"
4. The indicator displays with all signals

### Configure Alerts

1. Click on the alert icon (⏰) in TradingView
2. Select "AI Gold Master - Real-Time Gold Analysis"
3. Choose condition: "Strong BUY Signal" or "Strong SELL Signal"
4. Configure your notification (email, SMS, webhook)

## 📊 Example Output

```
======================================================================
📊 XAUUSD - 11/12/2025, 11:09:45 AM
======================================================================
🟢 SIGNAL: BUY (Strength: 5.5/10)
💰 Price: $2045.32
📈 Trend: BULLISH

📊 BUY Score: 5.5 | SELL Score: 1.0

📈 Indicators:
   • RSI: 28.4
   • MACD: -0.0234
   • EMA 9: $2043.21
   • EMA 21: $2041.87
   • ATR: 3.45
   • Volume Ratio: 1.35x

💡 Signal Reasons:
   ✓ RSI oversold (28.4) (+1.5)
   ✓ MACD crosses signal upward (+1.5)
   ✓ Bullish trend confirmed (+2)
   ✓ High bullish volume (+1)
======================================================================
```

## 🎛️ Programmatic Usage

```javascript
const GoldAnalysisAI = require('./gold_analysis_ai');

const analyzer = new GoldAnalysisAI({
    symbol: 'XAUUSD',
    updateFrequency: 60000
});

// Listen for signals
analyzer.on('signal', (signal) => {
    if (signal.signal === 'BUY') {
        sendNotification('BUY signal detected!');
    }
});

// Start analysis
analyzer.start();
```

## ⚠️ Disclaimer

**IMPORTANT**:
- This tool is provided for educational and informational purposes only
- Generated signals do not constitute financial advice
- Trading carries significant risk of loss
- Always do your own research before trading
- Never invest more than you can afford to lose
- Always use appropriate stop-loss orders

## 🔒 Security Note

Some dependencies (puppeteer) have known vulnerabilities. The `compile_pine_script.js` file using puppeteer is optional and not required for the main analysis functionality. For production use:
- Use the main analysis module (`gold_analysis_ai.js`) which doesn't require puppeteer
- Integrate with real market data APIs (Alpha Vantage, Twelve Data, etc.)
- Run `npm audit` regularly to check for vulnerabilities
- Keep dependencies updated

## 🔄 Roadmap

- [ ] Real API integration (Alpha Vantage, Twelve Data)
- [ ] Notification system (Email, SMS, Telegram, Discord)
- [ ] Web interface for monitoring
- [ ] Historical data backtesting
- [ ] Machine Learning for parameter optimization
- [ ] Automated trading (with simulation mode)
- [ ] Multi-asset support (silver, oil, indices)

## 📝 Production Setup

To use this system in production with real data:

1. Choose a data provider:
   - [Alpha Vantage](https://www.alphavantage.co/)
   - [Twelve Data](https://twelvedata.com/)
   - [Polygon.io](https://polygon.io/)

2. Get an API key

3. Modify `fetchPriceData()` in `gold_analysis_ai.js`

4. Add environment variables in `.env`

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Propose new features
- Improve documentation
- Submit pull requests

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**David Nault**
- GitHub: [@davidnault0](https://github.com/davidnault0)

---

**Happy Trading! 📈💰**