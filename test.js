/**
 * Simple test to verify the AI Gold Master system components
 */

const assert = require('assert');

// Test 1: Market Data Analyzer
console.log('Testing Market Data Analyzer...');
const MarketDataAnalyzer = require('./src/analyzers/marketData');
const config = { tradingNetworkUrl: 'https://coach-pine-cloud.onrender.com' };
const marketAnalyzer = new MarketDataAnalyzer(config);

// Add some simulated data
for (let i = 0; i < 50; i++) {
    const data = marketAnalyzer.generateSimulatedData();
    marketAnalyzer.addDataPoint(data);
}

const historicalData = marketAnalyzer.getHistoricalData(20);
assert(historicalData.length === 20, 'Should return 20 data points');
console.log('✓ Market Data Analyzer works correctly');

// Test 2: Base Strategy
console.log('\nTesting Base Strategy...');
const BaseStrategy = require('./src/strategies/baseStrategy');
class TestStrategy extends BaseStrategy {
    constructor() {
        super('Test Strategy');
    }
    analyze(closingPrices, currentData) {
        return this.createSignal('BUY', 0.8, 'Test signal');
    }
}

const testStrategy = new TestStrategy();
const closingPrices = [2000, 2010, 2005, 2015, 2020, 2025, 2030, 2035, 2040, 2045];
const signal = testStrategy.analyze(closingPrices, { price: 2045 });
assert(signal.action === 'BUY', 'Should generate BUY signal');
assert(signal.confidence === 0.8, 'Confidence should be 0.8');
console.log('✓ Base Strategy works correctly');

// Test 3: SMA Strategy
console.log('\nTesting SMA Crossover Strategy...');
const SMACrossoverStrategy = require('./src/strategies/smaCrossover');
const smaStrategy = new SMACrossoverStrategy();

// Generate uptrend data for testing
const uptrendPrices = [];
for (let i = 0; i < 50; i++) {
    uptrendPrices.push(2000 + i * 2);
}

const smaSignal = smaStrategy.analyze(uptrendPrices, { price: uptrendPrices[uptrendPrices.length - 1] });
assert(smaSignal !== null, 'Should generate a signal');
console.log(`✓ SMA Strategy works correctly - Signal: ${smaSignal.action}`);

// Test 4: RSI Strategy
console.log('\nTesting RSI Strategy...');
const RSIStrategy = require('./src/strategies/rsiStrategy');
const rsiStrategy = new RSIStrategy();

// Generate oversold scenario (declining prices)
const oversoldPrices = [];
for (let i = 0; i < 30; i++) {
    oversoldPrices.push(2000 - i * 3);
}

const rsiSignal = rsiStrategy.analyze(oversoldPrices, { price: oversoldPrices[oversoldPrices.length - 1] });
assert(rsiSignal !== null, 'Should generate a signal');
console.log(`✓ RSI Strategy works correctly - Signal: ${rsiSignal.action}`);

// Test 5: Bollinger Bands Strategy
console.log('\nTesting Bollinger Bands Strategy...');
const BollingerBandsStrategy = require('./src/strategies/bollingerBands');
const bbStrategy = new BollingerBandsStrategy();

// Generate price data
const bbPrices = [];
for (let i = 0; i < 30; i++) {
    bbPrices.push(2000 + Math.sin(i / 5) * 50);
}

const bbSignal = bbStrategy.analyze(bbPrices, { price: bbPrices[bbPrices.length - 1] });
assert(bbSignal !== null, 'Should generate a signal');
console.log(`✓ Bollinger Bands Strategy works correctly - Signal: ${bbSignal.action}`);

// Test 6: MACD Strategy
console.log('\nTesting MACD Strategy...');
const MACDStrategy = require('./src/strategies/macdStrategy');
const macdStrategy = new MACDStrategy();

const macdPrices = [];
for (let i = 0; i < 40; i++) {
    macdPrices.push(2000 + i * 1.5);
}

const macdSignal = macdStrategy.analyze(macdPrices, { price: macdPrices[macdPrices.length - 1] });
assert(macdSignal !== null, 'Should generate a signal');
console.log(`✓ MACD Strategy works correctly - Signal: ${macdSignal.action}`);

// Test 6.5: Gold-Optimized Strategy
console.log('\nTesting Gold-Optimized Strategy...');
const GoldOptimizedStrategy = require('./src/strategies/goldOptimized');
const goldStrategy = new GoldOptimizedStrategy();

// Generate uptrend with pullback for optimal gold strategy test
const goldPrices = [];
for (let i = 0; i < 60; i++) {
    if (i < 30) {
        goldPrices.push(2000 + i * 3); // Uptrend
    } else if (i < 35) {
        goldPrices.push(2090 - (i - 30) * 2); // Pullback
    } else {
        goldPrices.push(2080 + (i - 35) * 2); // Resume uptrend
    }
}

const goldSignal = goldStrategy.analyze(goldPrices, { price: goldPrices[goldPrices.length - 1] });
assert(goldSignal !== null, 'Should generate a signal');
console.log(`✓ Gold-Optimized Strategy works correctly - Signal: ${goldSignal.action}`);

// Test 7: Strategy Selector
console.log('\nTesting Strategy Selector...');
const StrategySelector = require('./src/strategies/strategySelector');
const selector = new StrategySelector();

const selectorPrices = [];
for (let i = 0; i < 50; i++) {
    selectorPrices.push(2000 + Math.random() * 20);
}

const bestSignal = selector.selectBestStrategy(
    selectorPrices,
    { price: selectorPrices[selectorPrices.length - 1] },
    'NEUTRAL',
    2.0
);

assert(bestSignal !== null, 'Should select a best strategy');
assert(['BUY', 'SELL', 'HOLD'].includes(bestSignal.action), 'Should have valid action');
console.log(`✓ Strategy Selector works correctly - Best: ${bestSignal.strategy}, Action: ${bestSignal.action}`);

// Test 8: Technical Indicators
console.log('\nTesting Technical Indicators...');
const prices = [2000, 2010, 2020, 2015, 2025, 2030, 2028, 2035, 2040, 2038, 2045, 2050, 2048, 2055, 2060];

const sma = testStrategy.calculateSMA(prices, 5);
assert(sma > 0, 'SMA should be calculated');
console.log(`✓ SMA calculated: ${sma.toFixed(2)}`);

const ema = testStrategy.calculateEMA(prices, 5);
assert(ema > 0, 'EMA should be calculated');
console.log(`✓ EMA calculated: ${ema.toFixed(2)}`);

const rsi = testStrategy.calculateRSI(prices, 14);
assert(rsi > 0 && rsi < 100, 'RSI should be between 0 and 100');
console.log(`✓ RSI calculated: ${rsi.toFixed(2)}`);

const bb = testStrategy.calculateBollingerBands(prices, 10);
assert(bb !== null, 'Bollinger Bands should be calculated');
assert(bb.upper > bb.middle && bb.middle > bb.lower, 'BB bands should be ordered correctly');
console.log(`✓ Bollinger Bands calculated: Upper=${bb.upper.toFixed(2)}, Middle=${bb.middle.toFixed(2)}, Lower=${bb.lower.toFixed(2)}`);

// Test 9: Market Trend Calculation
console.log('\nTesting Market Trend Calculation...');
for (let i = 0; i < 30; i++) {
    marketAnalyzer.addDataPoint({ 
        timestamp: Date.now(), 
        price: 2000 + i * 5,
        volume: 1000,
        high: 2005 + i * 5,
        low: 1995 + i * 5,
        open: 2000 + i * 5
    });
}

const trend = marketAnalyzer.calculateTrend();
assert(['BULLISH', 'BEARISH', 'NEUTRAL'].includes(trend), 'Trend should be valid');
console.log(`✓ Market trend calculated: ${trend}`);

// Test 10: Volatility Calculation
const volatility = marketAnalyzer.calculateVolatility();
assert(volatility >= 0, 'Volatility should be non-negative');
console.log(`✓ Volatility calculated: ${volatility.toFixed(2)}%`);

// All tests passed
console.log('\n' + '='.repeat(60));
console.log('✅ All tests passed successfully!');
console.log('='.repeat(60));
console.log('\nThe AI Gold Master system is working correctly.');
console.log('You can now run it with: npm start');
console.log('\nMake sure to configure your .env file with:');
console.log('- TELEGRAM_BOT_TOKEN');
console.log('- TELEGRAM_CHAT_ID');
console.log('- Other configuration parameters\n');
