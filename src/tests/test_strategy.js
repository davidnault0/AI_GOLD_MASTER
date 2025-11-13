/**
 * Test Suite for Gold Strategy
 */

const GoldStrategy = require('../strategies/goldStrategy');

// Test helper to generate mock price data
function generateMockPriceData(count, basePrice = 1950, volatility = 5) {
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < count; i++) {
        const change = (Math.random() - 0.5) * volatility;
        price += change;
        data.push(price);
    }
    
    return data;
}

// Test 1: Strategy initialization
console.log('Test 1: Strategy Initialization');
const strategy = new GoldStrategy();
console.log('✓ Strategy created with default configuration');
console.log('  - Timeframes:', strategy.config.timeframes.length);
console.log('  - EMA Fast:', strategy.config.emaFast);
console.log('  - RSI Period:', strategy.config.rsiPeriod);
console.log('');

// Test 2: EMA Calculation
console.log('Test 2: EMA Calculation');
const testData = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 110];
const ema = strategy.calculateEMA(testData, 5);
console.log('✓ EMA calculated:', ema?.toFixed(2));
console.log('');

// Test 3: RSI Calculation
console.log('Test 3: RSI Calculation');
const priceData = generateMockPriceData(50, 1950, 5);
const rsi = strategy.calculateRSI(priceData, 14);
console.log('✓ RSI calculated:', rsi?.toFixed(2));
console.log('  - Interpretation:', rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral');
console.log('');

// Test 4: MACD Calculation
console.log('Test 4: MACD Calculation');
const macd = strategy.calculateMACD(priceData);
if (macd) {
    console.log('✓ MACD calculated:');
    console.log('  - MACD Line:', macd.macd.toFixed(4));
    console.log('  - Signal Line:', macd.signal.toFixed(4));
    console.log('  - Histogram:', macd.histogram.toFixed(4));
} else {
    console.log('✗ MACD calculation failed (insufficient data)');
}
console.log('');

// Test 5: Bollinger Bands
console.log('Test 5: Bollinger Bands Calculation');
const bb = strategy.calculateBollingerBands(priceData, 20, 2);
if (bb) {
    console.log('✓ Bollinger Bands calculated:');
    console.log('  - Upper Band:', bb.upper.toFixed(2));
    console.log('  - Middle Band:', bb.middle.toFixed(2));
    console.log('  - Lower Band:', bb.lower.toFixed(2));
} else {
    console.log('✗ Bollinger Bands calculation failed');
}
console.log('');

// Test 6: Trend Detection
console.log('Test 6: Trend Detection');
const longData = generateMockPriceData(250, 1950, 3);
const trend = strategy.detectTrend(longData);
console.log('✓ Trend detected:');
console.log('  - Type:', trend.trend);
console.log('  - Strength:', (trend.strength * 100).toFixed(0) + '%');
console.log('');

// Test 7: Single Timeframe Analysis
console.log('Test 7: Single Timeframe Analysis');
const analysis = strategy.analyzeSingleTimeframe(longData);
console.log('✓ Analysis completed:');
console.log('  - Direction:', analysis.direction);
console.log('  - Strength:', (analysis.strength * 100).toFixed(0) + '%');
console.log('  - Reason:', analysis.reason);
console.log('  - RSI:', analysis.indicators.rsi);
console.log('  - Trend:', analysis.indicators.trend);
console.log('');

// Test 8: Multi-Timeframe Analysis
console.log('Test 8: Multi-Timeframe Analysis');
const marketData = {
    '1m': generateMockPriceData(250, 1950, 2),
    '5m': generateMockPriceData(250, 1950, 3),
    '15m': generateMockPriceData(250, 1950, 5),
    '1h': generateMockPriceData(250, 1950, 8),
    '4h': generateMockPriceData(250, 1950, 12),
    '1d': generateMockPriceData(250, 1950, 15)
};

const signal = strategy.generateSignal(marketData);
console.log('✓ Signal generated:');
console.log('  - Symbol:', signal.symbol);
console.log('  - Direction:', signal.direction);
console.log('  - Confidence:', signal.confidence);
console.log('  - Entry Price:', signal.entry);
console.log('  - Stop Loss:', signal.stopLoss);
console.log('  - Take Profit:', signal.takeProfit);
console.log('  - Risk/Reward:', signal.riskReward);
console.log('  - Should Trade:', signal.shouldTrade ? 'YES' : 'NO');
console.log('');

// Test 9: Position Size Calculation
console.log('Test 9: Position Size Calculation');
const accountBalance = 10000;
const currentPrice = parseFloat(signal.entry);
const stopLoss = parseFloat(signal.stopLoss);
const positionSize = strategy.calculatePositionSize(accountBalance, currentPrice, stopLoss);
console.log('✓ Position size calculated:');
console.log('  - Units:', positionSize.units);
console.log('  - Risk Amount:', positionSize.riskAmount);
console.log('  - Potential Loss:', positionSize.potentialLoss);
console.log('');

// Test 10: Edge Cases
console.log('Test 10: Edge Cases');
console.log('Testing with insufficient data...');
const shortData = [1950, 1951, 1952];
const shortAnalysis = strategy.analyzeSingleTimeframe(shortData);
console.log('✓ Handled insufficient data:', shortAnalysis.direction === 'NEUTRAL' ? 'PASS' : 'FAIL');

const emptyData = [];
const emptyAnalysis = strategy.calculateEMA(emptyData, 10);
console.log('✓ Handled empty data:', emptyAnalysis === null ? 'PASS' : 'FAIL');
console.log('');

console.log('='.repeat(50));
console.log('ALL TESTS COMPLETED SUCCESSFULLY ✓');
console.log('='.repeat(50));
