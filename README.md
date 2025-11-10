
# AI_GOLD_MASTER

This repository includes the creation, validation, and testing of TradingView indicators in Pine Script v6. 
You will find various scripts demonstrating different functionalities, structure, and logic necessary for building effective trading indicators using Pine Script.

## Features
- **Custom Indicator Development**: Learn how to create custom indicators tailored to specific trading strategies.
- **Pine Script v6 Syntax**: Get familiar with the new features and updates in Pine Script v6.
- **Automated Validation**: Validate Pine Script syntax without external dependencies.
- **Code Generation**: Automatically generate Pine Script indicators programmatically.
- **Comprehensive Testing**: Test all Pine Script files with a single command.
- **🌐 TradingView Integration**: Test your scripts directly on TradingView with real compilation!

## 🚀 Getting Started

### Installation
```bash
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER
npm install  # Optional: only needed for TradingView integration
```

### Quick Start - Testing Pine Scripts

The repository includes a standalone validator that doesn't require any external dependencies:

```bash
# Run all tests (local validation)
npm test

# Validate a specific file
node pine_validator.js pine_scripts/examples/simple_sma.pine

# Validate all examples
npm run validate

# Generate new indicators automatically
npm run generate

# 🌐 NEW: Test on TradingView (requires credentials)
npm run test:tradingview
```

## 📁 Project Structure

```
AI_GOLD_MASTER/
├── pine_scripts/
│   ├── examples/          # Example Pine Script v6 indicators
│   │   ├── simple_sma.pine
│   │   ├── rsi_indicator.pine
│   │   ├── macd_indicator.pine
│   │   ├── bollinger_bands.pine
│   │   ├── ema_crossover_strategy.pine
│   │   ├── vwap_indicator.pine
│   │   └── atr_indicator.pine
│   ├── tests/             # Test Pine Scripts
│   └── generated/         # Auto-generated scripts
├── pine_validator.js      # Standalone Pine Script validator
├── pine_test_runner.js    # Test runner for all scripts
├── pine_generator.js      # Automatic code generator
└── compile_pine_script.js # TradingView integration (requires Puppeteer)
```

## 🧪 Testing Your Pine Scripts

### Method 1: Automatic Validation (No External Dependencies)

The Pine Script validator checks syntax, structure, and v6 compatibility without needing TradingView:

```bash
# Test all scripts
node pine_test_runner.js

# Test a single file
node pine_validator.js pine_scripts/examples/simple_sma.pine

# Test a directory
node pine_validator.js pine_scripts/examples/
```

The validator checks for:
- ✅ Version declaration (`//@version=6`)
- ✅ Indicator/Strategy declaration
- ✅ Matching brackets, parentheses, and braces
- ✅ Pine Script v6 specific features
- ✅ Deprecated syntax warnings

### Method 2: TradingView Integration (Requires Puppeteer)

For full compilation testing on TradingView:

```bash
npm run test:puppeteer
```

**Note**: This requires TradingView credentials and internet access.

## 🔧 Creating New Indicators

### Manual Creation

Create a new `.pine` file in `pine_scripts/examples/`:

```pine
//@version=6
indicator("My Custom Indicator", overlay=true)

// Your indicator code here
length = input.int(14, "Length")
value = ta.sma(close, length)
plot(value, color=color.blue)
```

Then validate it:
```bash
node pine_validator.js pine_scripts/examples/my_custom_indicator.pine
```

### Automatic Generation

Use the code generator to create indicators programmatically:

```bash
node pine_generator.js
```

This generates and validates indicators automatically. You can modify `pine_generator.js` to customize the generation logic.

## 📚 Example Indicators Included

1. **Simple SMA** - Basic moving average indicator
2. **RSI Indicator** - Relative Strength Index with overbought/oversold levels
3. **MACD** - Moving Average Convergence Divergence
4. **Bollinger Bands** - Volatility bands around price
5. **EMA Crossover Strategy** - Trading strategy based on EMA crossovers
6. **VWAP** - Volume Weighted Average Price
7. **ATR** - Average True Range volatility indicator
8. **Stochastic RSI** - Stochastic RSI momentum oscillator

All examples use Pine Script v6 syntax and best practices.

## 🎯 Usage Examples

### Validate Before Copying to TradingView

```bash
# Create your indicator
nano pine_scripts/examples/my_indicator.pine

# Validate it locally (instant)
node pine_validator.js pine_scripts/examples/my_indicator.pine

# Test on TradingView (real compilation)
npm run test:tradingview
```

### Batch Testing

```bash
# Test all examples locally
npm test

# Test all examples on TradingView
npm run test:tradingview
```

### Generate Multiple Indicators

Edit `pine_generator.js` to add more indicator configurations, then run:

```bash
npm run generate
```

## 🌐 TradingView Integration

### Setup (One-Time)

1. Copy the example configuration:
```bash
cp .env.example .env
```

2. Edit `.env` with your TradingView credentials:
```bash
nano .env
```

3. Add your credentials:
```env
TRADINGVIEW_EMAIL=your-email@example.com
TRADINGVIEW_PASSWORD=your-password
```

### Test on TradingView

```bash
# Test all scripts on TradingView
npm run test:tradingview

# Test a single script
npm run test:tradingview:single
```

This will:
- ✅ Connect to TradingView with your credentials
- ✅ Compile each script in the Pine Editor
- ✅ Capture screenshots of the results
- ✅ Report compilation success/failures

📸 Screenshots are saved in `./screenshots/`

For more details, see [TRADINGVIEW_TESTING.md](TRADINGVIEW_TESTING.md)

## 🔍 Validation Output

The validator provides clear feedback:

```
✅ Validation PASSED

Errors: 0
Warnings: 1

⚠️  WARNINGS:
  - Found 4 Pine Script v6 specific features.
```

Or if there are errors:

```
❌ Validation FAILED

Errors: 1
Warnings: 0

❌ ERRORS:
  - Unmatched parentheses: missing closing parenthesis.
```

## 🛠️ Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all Pine Script validation tests (local, fast) |
| `npm run validate` | Validate all example scripts |
| `npm run generate` | Generate new indicators automatically |
| `npm run test:puppeteer` | Run hybrid validation (local + Puppeteer fallback) |
| `npm run test:tradingview` | 🌐 **NEW:** Test all scripts on TradingView |
| `npm run test:tradingview:single` | 🌐 **NEW:** Test a single script on TradingView |
| `npm run test:full` | Run both local and Puppeteer tests |

## 🌟 Pine Script v6 Features

This repository demonstrates these Pine Script v6 features:

- `input.int()`, `input.float()`, `input.source()` - Modern input functions
- `ta.sma()`, `ta.ema()`, `ta.rsi()`, `ta.macd()` - Technical analysis functions
- `color.new()`, `color.rgb()` - Color manipulation
- `plot.style_*` and `hline.style_*` - Plotting styles
- `strategy.entry()`, `strategy.close()` - Strategy functions

## 📖 Learning Resources

- [Pine Script v6 Documentation](https://www.tradingview.com/pine-script-docs/en/v6/Introduction.html)
- [TradingView Pine Script Reference](https://www.tradingview.com/pine-script-reference/v6/)

## 🤝 Contribution

Feel free to contribute by:
- Adding new example indicators
- Improving the validator
- Enhancing the code generator
- Submitting pull requests with your scripts

## 📝 License

This project is open source and available for educational purposes.

## 🎉 Summary

This repository provides a complete testing environment for Pine Script v6:

1. **Create** Pine Scripts using examples or the generator
2. **Validate** them locally without TradingView
3. **Test** automatically with comprehensive checks
4. **Deploy** to TradingView with confidence

No more trial and error in TradingView's editor - validate your code before uploading!
