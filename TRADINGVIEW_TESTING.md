# 🧪 TradingView Testing Guide

## Configuration

### Environment Variables Needed
```bash
export TRADINGVIEW_EMAIL="your-email@example.com"
export TRADINGVIEW_PASSWORD="your-password"
```

### Or use .env file
Create `.env` file in project root:
```
TRADINGVIEW_EMAIL=your-email@example.com
TRADINGVIEW_PASSWORD=your-password
```

## Test Scripts

### 1. test_agm_tradingview.js
Full automated test with login and compilation check

### 2. test_on_tradingview.js
Quick test without login (for public scripts)

### 3. tradingview_real_tester.js
Real-time compilation validator with screenshot capture

## Usage

```bash
# Install dependencies
npm install puppeteer dotenv

# Run test
node test_agm_tradingview.js
```

## Expected Output

```
🚀 Connecting to TradingView...
✅ Logged in successfully
📝 Loading Pine Script code (1489 lines)
✅ Code pasted into editor
⏳ Waiting for compilation...
✅ Compilation successful! No errors.
📸 Screenshot saved: compilation_success.png
```

## Troubleshooting

### If TradingView is blocked
The domain might be blocked by security policies. In that case:
1. Test manually by copy/paste
2. Report errors found
3. Agent will fix and you re-test

### If compilation fails
The script will:
1. Capture error messages
2. Save to `compilation_errors.txt`
3. Take screenshot of errors
4. Exit with details

## Files Created During Testing

- `compilation_success.png` - Screenshot if successful
- `compilation_errors.txt` - Error messages if failed
- `tradingview_session.png` - Session state screenshot
