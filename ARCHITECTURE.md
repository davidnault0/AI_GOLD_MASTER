# System Architecture

## Overview

The AI Gold Master system is composed of several interconnected components that work together to provide 24/7 gold market analysis and trading signals.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AI GOLD MASTER                              │
│                    24/7 Trading Analysis System                     │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │     Main AI Engine       │
                    │    (src/index.js)        │
                    │                          │
                    │  • Orchestrates all      │
                    │    components            │
                    │  • Runs analysis loop    │
                    │  • Manages timing        │
                    └──────────────────────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 │                 │                 │
                 ▼                 ▼                 ▼
    ┌───────────────────┐ ┌──────────────┐ ┌────────────────┐
    │ Market Data       │ │  Strategy    │ │   Telegram     │
    │ Analyzer          │ │  Selector    │ │   Bot          │
    │                   │ │              │ │   Manager      │
    │ • Fetches data    │ │ • Evaluates  │ │ • Sends        │
    │ • Calculates      │ │   strategies │ │   signals      │
    │   trends          │ │ • Selects    │ │ • Handles      │
    │ • Measures        │ │   best one   │ │   commands     │
    │   volatility      │ │              │ │                │
    └───────────────────┘ └──────────────┘ └────────────────┘
             │                     │                  │
             │                     │                  │
             ▼                     ▼                  ▼
    ┌───────────────┐    ┌─────────────────┐   ┌──────────┐
    │   External    │    │   4 Trading     │   │ Telegram │
    │ Trading       │    │   Strategies:   │   │   API    │
    │ Network       │    │                 │   │          │
    │               │    │  1. SMA Cross   │   │ • Sends  │
    │ coach-pine-   │    │  2. RSI         │   │   msgs   │
    │ cloud.        │    │  3. Bollinger   │   │ • Gets   │
    │ onrender.com  │    │  4. MACD        │   │   cmds   │
    └───────────────┘    └─────────────────┘   └──────────┘
```

## Data Flow

### 1. Data Collection Phase

```
Trading Network
    │
    │ (HTTP GET Request every 60s)
    ▼
Market Data Analyzer
    │
    │ (Parse & Store)
    ▼
Historical Data Buffer
(Last 500 data points)
```

### 2. Analysis Phase

```
Historical Data
    │
    ├──▶ SMA Crossover Strategy ──▶ Signal A (action, confidence)
    │
    ├──▶ RSI Strategy ───────────▶ Signal B (action, confidence)
    │
    ├──▶ Bollinger Bands ────────▶ Signal C (action, confidence)
    │
    └──▶ MACD Strategy ──────────▶ Signal D (action, confidence)
            │
            ▼
    Strategy Selector
            │
            │ (Score & Rank)
            │
            ▼
    Best Signal Selected
    (action, confidence, indicators)
```

### 3. Signal Generation

```
Best Signal
    │
    │ (Check confidence >= 0.75)
    │
    ├─▶ [If confidence too low] ──▶ Log & Skip
    │
    └─▶ [If high confidence] ─────▶ Format Signal
                                        │
                                        ▼
                                Telegram Bot Manager
                                        │
                                        ▼
                                  Send to User
                                        │
                                        ▼
                            ┌───────────────────┐
                            │ 🟢 BUY SIGNAL     │
                            │ Strategy: RSI     │
                            │ Confidence: 85%   │
                            │ ...               │
                            └───────────────────┘
```

## Component Details

### Main AI Engine (src/index.js)

**Responsibilities:**
- Initialize all components
- Run continuous analysis loop
- Coordinate data flow
- Handle errors and logging
- Graceful shutdown

**Key Methods:**
- `start()` - Starts the engine
- `runAnalysisLoop()` - Main loop
- `performAnalysis()` - Single analysis cycle
- `stop()` - Clean shutdown

### Market Data Analyzer (src/analyzers/marketData.js)

**Responsibilities:**
- Fetch market data from trading network
- Maintain historical data buffer
- Calculate market trends (BULLISH/BEARISH/NEUTRAL)
- Measure volatility

**Key Methods:**
- `fetchMarketData()` - Gets current data
- `getHistoricalData()` - Returns historical prices
- `calculateTrend()` - Analyzes market direction
- `calculateVolatility()` - Measures price fluctuations

### Strategy Selector (src/strategies/strategySelector.js)

**Responsibilities:**
- Run all trading strategies
- Score each signal
- Select best strategy
- Adapt to market conditions

**Scoring Algorithm:**
```
Total Score = (Confidence × 0.5) 
            + (Historical Performance × 0.3)
            + (Market Alignment × 0.1)
            + (Volatility Adjustment × 0.1)
```

**Key Methods:**
- `selectBestStrategy()` - Chooses optimal strategy
- `calculateMarketAlignment()` - Checks trend alignment
- `calculateVolatilityAdjustment()` - Adjusts for volatility
- `getConsensusSignal()` - Gets majority vote

### Trading Strategies

#### Base Strategy (src/strategies/baseStrategy.js)

Provides common functionality:
- Technical indicator calculations (SMA, EMA, RSI, MACD, BB)
- Signal creation
- Performance tracking

#### Individual Strategies

1. **SMA Crossover** (smaCrossover.js)
   - Detects when short MA crosses long MA
   - Buy: Short crosses above long
   - Sell: Short crosses below long

2. **RSI** (rsiStrategy.js)
   - Identifies overbought/oversold conditions
   - Buy: RSI < 30 (oversold)
   - Sell: RSI > 70 (overbought)

3. **Bollinger Bands** (bollingerBands.js)
   - Analyzes price vs. volatility bands
   - Buy: Price touches/breaks lower band
   - Sell: Price touches/breaks upper band

4. **MACD** (macdStrategy.js)
   - Uses momentum indicators
   - Buy: MACD crosses above signal line
   - Sell: MACD crosses below signal line

### Telegram Bot Manager (src/telegram/botManager.js)

**Responsibilities:**
- Initialize Telegram bot
- Send formatted trading signals
- Handle bot commands (/start, /status, /help)
- Send error notifications
- Send periodic market summaries

**Key Methods:**
- `sendTradingSignal()` - Sends formatted signal
- `sendMarketSummary()` - Sends periodic updates
- `formatTradingSignal()` - Formats signal for display
- `sendErrorNotification()` - Alerts on errors

## Configuration Flow

```
.env File
    │
    ├─▶ TELEGRAM_BOT_TOKEN ────────▶ Telegram Bot Manager
    ├─▶ TELEGRAM_CHAT_ID ──────────▶ Telegram Bot Manager
    ├─▶ TRADING_NETWORK_URL ───────▶ Market Data Analyzer
    ├─▶ ANALYSIS_INTERVAL_MS ──────▶ Main AI Engine
    ├─▶ MIN_CONFIDENCE_THRESHOLD ──▶ Main AI Engine
    └─▶ LOG_LEVEL ─────────────────▶ Logger
```

## Logging System

```
Winston Logger
    │
    ├─▶ Console Output (colored, formatted)
    ├─▶ logs/combined.log (all messages)
    └─▶ logs/error.log (errors only)
```

**Log Levels:**
- `error` - Critical errors
- `warn` - Warnings
- `info` - General information (default)
- `debug` - Detailed debugging info

## Error Handling

```
Error Occurs
    │
    ├─▶ Log to error.log
    ├─▶ Log to console
    ├─▶ Send Telegram notification (critical errors)
    └─▶ Continue operation (graceful degradation)
```

## Performance Characteristics

- **Memory Usage**: ~50-100 MB (depends on data buffer size)
- **CPU Usage**: Low (<5% on modern systems)
- **Network Usage**: Minimal (one request per analysis interval)
- **Analysis Latency**: <100ms per cycle
- **Startup Time**: 5-10 seconds (data accumulation)

## Scalability

Current design supports:
- ✅ Single market (gold)
- ✅ Multiple strategies (4 implemented)
- ✅ One user (single Telegram chat)
- ✅ Configurable analysis frequency

Can be extended for:
- Multiple markets (add market parameter)
- More strategies (add to strategies/ directory)
- Multiple users (iterate over chat IDs)
- Real-time data (reduce interval)

## Deployment Patterns

### Pattern 1: Simple (Single Server)
```
Server (VPS/Cloud)
    │
    └─▶ AI Gold Master (node src/index.js)
            │
            └─▶ Telegram API
```

### Pattern 2: Containerized (Docker)
```
Docker Container
    │
    ├─▶ Node.js Runtime
    ├─▶ AI Gold Master
    └─▶ Volume (logs/)
```

### Pattern 3: Managed (Render.com)
```
Render.com Service
    │
    ├─▶ Auto-scaling
    ├─▶ Environment Variables
    ├─▶ Health Checks
    └─▶ Log Aggregation
```

## Security Layers

```
┌──────────────────────────────┐
│  Application Layer           │
│  • Input validation          │
│  • Error handling            │
│  • No secrets in code        │
└──────────────────────────────┘
         │
┌──────────────────────────────┐
│  Configuration Layer         │
│  • .env files (gitignored)   │
│  • Environment variables     │
│  • Secure token storage      │
└──────────────────────────────┘
         │
┌──────────────────────────────┐
│  Network Layer               │
│  • HTTPS only                │
│  • Telegram API security     │
│  • Firewall rules            │
└──────────────────────────────┘
         │
┌──────────────────────────────┐
│  Infrastructure Layer        │
│  • Server hardening          │
│  • Access controls           │
│  • Log monitoring            │
└──────────────────────────────┘
```

## Future Enhancements

Potential improvements:
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Web dashboard for monitoring
- [ ] Multiple cryptocurrency support
- [ ] Machine learning for strategy optimization
- [ ] Backtesting framework
- [ ] Portfolio management
- [ ] Risk management tools
- [ ] Multi-user support
- [ ] RESTful API
- [ ] Advanced charting

---

For implementation details, see the source code in the respective files.
