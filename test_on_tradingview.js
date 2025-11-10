const puppeteer = require('puppeteer');
const fs = require('fs');

async function quickTestOnTradingView(scriptFile = 'AI_GOLD_MASTER_ULTRA_CORRECTED.pine') {
    console.log(`🧪 Quick Test: ${scriptFile}`);
    
    const code = fs.readFileSync(scriptFile, 'utf8');
    console.log(`📝 ${code.split('\n').length} lines loaded\n`);
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🌐 Loading TradingView chart...');
        await page.goto('https://www.tradingview.com/chart/', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        await page.waitForTimeout(5000);
        console.log('✅ Chart loaded');
        
        await page.screenshot({ path: 'quick_test.png' });
        console.log('📸 Screenshot: quick_test.png');
        
    } catch (error) {
        console.error('❌', error.message);
    }
    
    await browser.close();
}

quickTestOnTradingView().catch(console.error);
