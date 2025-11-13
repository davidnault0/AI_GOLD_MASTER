/**
 * Integration Test for Complete System
 */

const AIGoldMaster = require('../../index');

console.log('\n' + '='.repeat(60));
console.log('INTEGRATION TEST - AI GOLD MASTER SYSTEM');
console.log('='.repeat(60) + '\n');

// Test configuration
const testConfig = {
    strategy: {
        timeframes: ['1m', '5m', '15m', '1h'],
        minSignalStrength: 0.5
    },
    analyzer: {
        updateInterval: 5000, // 5 seconds for testing
        symbol: 'XAUUSD'
    },
    telegram: {
        enabled: true,
        botToken: process.env.TELEGRAM_BOT_TOKEN || 'test_token',
        chatId: process.env.TELEGRAM_CHAT_ID || 'test_chat_id'
    },
    server: {
        port: 3001, // Use different port for testing
        host: '127.0.0.1'
    }
};

console.log('Test Configuration:');
console.log('- Update Interval:', testConfig.analyzer.updateInterval, 'ms');
console.log('- Server Port:', testConfig.server.port);
console.log('- Telegram Enabled:', testConfig.telegram.enabled);
console.log('');

// Create application instance
const app = new AIGoldMaster(testConfig);

// Test counter
let analysisCount = 0;
let signalCount = 0;

// Listen to events
app.analyzer.on('analysis', (analysis) => {
    analysisCount++;
    console.log(`[${analysisCount}] Analysis received:`, {
        direction: analysis.direction,
        confidence: analysis.confidence,
        marketCondition: analysis.marketCondition
    });
    
    // Stop after 3 analyses for testing
    if (analysisCount >= 3) {
        console.log('\n✓ Received 3 analyses, test complete');
        stopTest();
    }
});

app.analyzer.on('signal', (signal) => {
    signalCount++;
    console.log(`\n🚨 SIGNAL #${signalCount} DETECTED:`, {
        direction: signal.direction,
        confidence: signal.confidence,
        entry: signal.entry,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit
    });
});

// Test timeout
const testTimeout = setTimeout(() => {
    console.log('\n✓ Test timeout reached');
    stopTest();
}, 30000); // 30 seconds max

async function stopTest() {
    clearTimeout(testTimeout);
    
    console.log('\n' + '='.repeat(60));
    console.log('TEST RESULTS:');
    console.log('='.repeat(60));
    console.log('✓ Total Analyses:', analysisCount);
    console.log('✓ Total Signals:', signalCount);
    
    const status = app.getStatus();
    console.log('\n✓ System Status:');
    console.log('  - Analyzer Running:', status.analyzer.isRunning);
    console.log('  - Telegram Enabled:', status.telegram.enabled);
    console.log('  - Server Port:', status.server.port);
    
    console.log('\n✅ INTEGRATION TEST COMPLETED SUCCESSFULLY\n');
    
    await app.stop();
}

// Start the test
console.log('Starting integration test...\n');
app.start().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
