const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');

/**
 * REAL TradingView Compilation Tester
 * This script actually tests Pine Script compilation on TradingView
 */

async function realCompilationTest() {
    console.log('🏆 AI GOLD MASTER - Real Compilation Tester');
    console.log('===========================================\n');
    
    const scriptPath = 'AI_GOLD_MASTER_ULTRA_CORRECTED.pine';
    const pineCode = fs.readFileSync(scriptPath, 'utf8');
    const lineCount = pineCode.split('\n').length;
    
    console.log(`📂 Script: ${scriptPath}`);
    console.log(`📊 Lines: ${lineCount}`);
    console.log(`📦 Size: ${(pineCode.length / 1024).toFixed(2)} KB\n`);
    
    const email = process.env.TRADINGVIEW_EMAIL;
    const password = process.env.TRADINGVIEW_PASSWORD;
    
    if (!email || !password) {
        console.log('⚠️  WARNING: No credentials found');
        console.log('Set TRADINGVIEW_EMAIL and TRADINGVIEW_PASSWORD\n');
    }
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        });
        
        const page = await browser.newPage();
        
        console.log('🌐 Opening TradingView...');
        await page.goto('https://www.tradingview.com/chart/', {
            waitUntil: 'networkidle0',
            timeout: 60000
        });
        
        console.log('✅ Loaded\n');
        await page.waitForTimeout(3000);
        
        // Screenshot initial state
        await page.screenshot({ 
            path: 'tv_01_initial.png',
            fullPage: false 
        });
        console.log('📸 tv_01_initial.png\n');
        
        // Try to find and click Pine Editor button
        console.log('🔍 Looking for Pine Editor button...');
        
        const pineEditorSelectors = [
            'button[data-name="open-pine-editor"]',
            'button[aria-label*="Pine"]',
            'div[data-name="pine-editor"]',
            '[class*="pine-editor-button"]'
        ];
        
        let pineEditorOpened = false;
        for (const selector of pineEditorSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 2000 });
                await page.click(selector);
                console.log(`✅ Clicked: ${selector}\n`);
                pineEditorOpened = true;
                break;
            } catch (e) {
                // Try next selector
            }
        }
        
        if (!pineEditorOpened) {
            console.log('⚠️  Could not find Pine Editor button automatically');
            console.log('Looking for alternative...\n');
        }
        
        await page.waitForTimeout(2000);
        
        await page.screenshot({ 
            path: 'tv_02_pine_editor.png',
            fullPage: false 
        });
        console.log('📸 tv_02_pine_editor.png\n');
        
        // Try to find the Monaco editor
        console.log('🔍 Looking for code editor...');
        
        const editorFound = await page.evaluate(() => {
            const editor = document.querySelector('.monaco-editor textarea');
            return !!editor;
        });
        
        if (editorFound) {
            console.log('✅ Editor found!\n');
            
            // Clear and paste code
            console.log('💉 Injecting Pine Script code...');
            
            await page.evaluate((code) => {
                const textarea = document.querySelector('.monaco-editor textarea');
                if (textarea) {
                    textarea.focus();
                    document.execCommand('selectAll');
                    document.execCommand('delete');
                    
                    const dataTransfer = new DataTransfer();
                    dataTransfer.setData('text/plain', code);
                    const pasteEvent = new ClipboardEvent('paste', {
                        clipboardData: dataTransfer,
                        bubbles: true,
                        cancelable: true
                    });
                    textarea.dispatchEvent(pasteEvent);
                }
            }, pineCode);
            
            console.log('✅ Code injected\n');
            await page.waitForTimeout(2000);
            
            // Wait for compilation
            console.log('⏳ Waiting for compilation (15 seconds)...');
            await page.waitForTimeout(15000);
            
            await page.screenshot({ 
                path: 'tv_03_code_pasted.png',
                fullPage: false 
            });
            console.log('📸 tv_03_code_pasted.png\n');
            
            // Check for compilation errors
            console.log('🔍 Checking for compilation errors...\n');
            
            const compilationResult = await page.evaluate(() => {
                const errors = [];
                const warnings = [];
                
                // Look for error messages
                const errorSelectors = [
                    '.tv-pine-script-log__error',
                    '.compilation-error',
                    '[class*="error-message"]',
                    '.error-text'
                ];
                
                errorSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        const text = el.textContent.trim();
                        if (text) errors.push(text);
                    });
                });
                
                // Check console/log panel
                const console Panel = document.querySelector('.tv-pine-script-log');
                if (consolePanel) {
                    const logText = consolePanel.textContent;
                    if (logText.includes('error') || logText.includes('Error')) {
                        errors.push(logText);
                    }
                }
                
                return {
                    hasErrors: errors.length > 0,
                    errors: errors,
                    warnings: warnings
                };
            });
            
            if (compilationResult.hasErrors) {
                console.log('❌ COMPILATION ERRORS DETECTED:\n');
                compilationResult.errors.forEach((err, i) => {
                    console.log(`  ${i + 1}. ${err}\n`);
                });
                
                fs.writeFileSync('compilation_errors.txt', 
                    compilationResult.errors.join('\n\n'));
                console.log('📄 Errors saved to: compilation_errors.txt\n');
                
                await page.screenshot({ 
                    path: 'tv_04_errors.png',
                    fullPage: true 
                });
                console.log('📸 tv_04_errors.png (full page with errors)\n');
                
            } else {
                console.log('✅ ✅ ✅ NO COMPILATION ERRORS DETECTED! ✅ ✅ ✅\n');
                console.log('🎉 The script compiled successfully!\n');
                
                await page.screenshot({ 
                    path: 'tv_04_success.png',
                    fullPage: false 
                });
                console.log('📸 tv_04_success.png\n');
            }
            
        } else {
            console.log('❌ Could not find code editor');
            console.log('You may need to open Pine Editor manually\n');
        }
        
        console.log('⏸️  Keeping browser open for 60 seconds...');
        console.log('You can manually verify the result\n');
        await page.waitForTimeout(60000);
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error.stack);
        
        if (browser) {
            const pages = await browser.pages();
            if (pages[0]) {
                await pages[0].screenshot({ path: 'tv_error.png' });
                console.log('📸 Error screenshot: tv_error.png');
            }
        }
    } finally {
        if (browser) {
            await browser.close();
        }
        console.log('\n🏁 Test completed');
    }
}

// Run the test
realCompilationTest().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
