const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');

async function testAGMOnTradingView() {
    console.log('🚀 AI GOLD MASTER - TradingView Compilation Test');
    console.log('================================================\n');
    
    // Load Pine Script code
    const pineCode = fs.readFileSync('AI_GOLD_MASTER_ULTRA_CORRECTED.pine', 'utf8');
    console.log(`📝 Code loaded: ${pineCode.split('\n').length} lines\n`);
    
    // Get credentials from environment
    const email = process.env.TRADINGVIEW_EMAIL || 'your-email@example.com';
    const password = process.env.TRADINGVIEW_PASSWORD || 'your-password';
    
    if (email === 'your-email@example.com') {
        console.log('⚠️  WARNING: Using placeholder credentials');
        console.log('Set TRADINGVIEW_EMAIL and TRADINGVIEW_PASSWORD environment variables\n');
    }
    
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });
    
    try {
        const page = await browser.newPage();
        
        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        console.log('🌐 Navigating to TradingView...');
        await page.goto('https://www.tradingview.com/', { 
            waitUntil: 'networkidle2',
            timeout: 60000 
        });
        
        console.log('✅ Page loaded\n');
        
        // Try to login
        console.log('🔐 Attempting login...');
        try {
            // Click "Sign in" button
            await page.waitForSelector('button:has-text("Sign in"), a:has-text("Sign in")', { timeout: 5000 });
            await page.click('button:has-text("Sign in"), a:has-text("Sign in")');
            await page.waitForTimeout(2000);
            
            // Fill email
            await page.type('input[name="username"], input[type="email"]', email);
            await page.waitForTimeout(500);
            
            // Fill password
            await page.type('input[name="password"], input[type="password"]', password);
            await page.waitForTimeout(500);
            
            // Click submit
            await page.click('button[type="submit"]');
            await page.waitForTimeout(5000);
            
            console.log('✅ Login attempted\n');
        } catch (loginError) {
            console.log('⚠️  Could not find login form, continuing anyway...\n');
        }
        
        // Navigate to chart
        console.log('📊 Opening chart...');
        await page.goto('https://www.tradingview.com/chart/', { 
            waitUntil: 'networkidle2',
            timeout: 60000 
        });
        
        await page.waitForTimeout(3000);
        console.log('✅ Chart loaded\n');
        
        // Open Pine Editor
        console.log('📝 Opening Pine Editor...');
        try {
            await page.evaluate(() => {
                const pineButton = document.querySelector('[data-name="open-pine-editor"], button[aria-label*="Pine"]');
                if (pineButton) pineButton.click();
            });
            await page.waitForTimeout(3000);
            console.log('✅ Pine Editor opened\n');
        } catch (error) {
            console.log('⚠️  Could not open Pine Editor automatically\n');
        }
        
        // Take screenshot
        await page.screenshot({ path: 'tradingview_session.png', fullPage: true });
        console.log('📸 Screenshot saved: tradingview_session.png\n');
        
        // Try to find editor and paste code
        console.log('💉 Attempting to inject code...');
        try {
            const editor = await page.$('.monaco-editor textarea, .view-lines');
            if (editor) {
                await editor.click();
                await page.keyboard.down('Control');
                await page.keyboard.press('A');
                await page.keyboard.up('Control');
                await page.keyboard.press('Backspace');
                await page.waitForTimeout(500);
                
                // Type code (this might be slow for 1489 lines)
                await page.evaluate((code) => {
                    navigator.clipboard.writeText(code);
                }, pineCode);
                
                await page.keyboard.down('Control');
                await page.keyboard.press('V');
                await page.keyboard.up('Control');
                
                console.log('✅ Code pasted\n');
                
                // Wait for compilation
                console.log('⏳ Waiting for compilation (10 seconds)...');
                await page.waitForTimeout(10000);
                
                // Check for errors
                const errors = await page.evaluate(() => {
                    const errorElements = Array.from(document.querySelectorAll('[class*="error"], [class*="Error"]'));
                    return errorElements.map(el => el.textContent).filter(text => text.length > 0);
                });
                
                if (errors.length > 0) {
                    console.log('❌ COMPILATION ERRORS FOUND:\n');
                    errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
                    fs.writeFileSync('compilation_errors.txt', errors.join('\n\n'));
                    console.log('\n📄 Errors saved to: compilation_errors.txt');
                } else {
                    console.log('✅ NO COMPILATION ERRORS DETECTED!\n');
                }
                
                await page.screenshot({ path: 'compilation_result.png', fullPage: true });
                console.log('📸 Result screenshot: compilation_result.png');
                
            } else {
                console.log('❌ Could not find editor element');
            }
        } catch (error) {
            console.log('❌ Error injecting code:', error.message);
        }
        
        console.log('\n✅ Test completed!');
        console.log('Check screenshots for visual confirmation.');
        
        // Keep browser open for manual inspection
        console.log('\n⏸️  Browser will stay open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        await page.screenshot({ path: 'test_error.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('\n🏁 Test script ended');
    }
}

testAGMOnTradingView().catch(console.error);
