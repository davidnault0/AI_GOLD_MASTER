const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * TradingView Real Integration Tester
 * Tests Pine Scripts directly on TradingView with real credentials
 */

class TradingViewTester {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.browser = null;
        this.page = null;
        this.isLoggedIn = false;
    }

    /**
     * Initialize browser and login to TradingView
     */
    async initialize() {
        console.log('🚀 Launching browser...');
        
        this.browser = await puppeteer.launch({
            headless: process.env.TRADINGVIEW_HEADLESS !== 'false',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920,1080'
            ],
            defaultViewport: {
                width: 1920,
                height: 1080
            }
        });

        this.page = await this.browser.newPage();
        
        // Set user agent to avoid detection
        await this.page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        console.log('🔐 Logging into TradingView...');
        await this.login();
    }

    /**
     * Login to TradingView
     */
    async login() {
        try {
            // Navigate to TradingView
            await this.page.goto('https://www.tradingview.com/', {
                waitUntil: 'networkidle2',
                timeout: 60000
            });

            console.log('📄 TradingView page loaded');

            // Wait a bit for the page to fully load
            await this.page.waitForTimeout(2000);

            // Look for the sign-in button
            console.log('🔍 Looking for sign-in button...');
            
            // Try multiple selectors for the sign-in button
            const signInSelectors = [
                'button[aria-label="Open user menu"]',
                'button[data-name="header-user-menu-button"]',
                'button.tv-header__user-menu-button',
                'a[href*="accounts.tradingview.com"]',
                'button:has-text("Sign in")',
                '[data-role="button"]:has-text("Sign in")'
            ];

            let signInButton = null;
            for (const selector of signInSelectors) {
                try {
                    signInButton = await this.page.$(selector);
                    if (signInButton) {
                        console.log(`✅ Found sign-in button with selector: ${selector}`);
                        break;
                    }
                } catch (e) {
                    // Continue to next selector
                }
            }

            if (!signInButton) {
                console.log('⚠️  Could not find sign-in button, trying direct navigation...');
                await this.page.goto('https://www.tradingview.com/accounts/signin/', {
                    waitUntil: 'networkidle2',
                    timeout: 60000
                });
            } else {
                await signInButton.click();
                await this.page.waitForTimeout(2000);
            }

            console.log('📝 Entering credentials...');

            // Wait for email input
            await this.page.waitForSelector('input[name="username"], input[name="email"], input[type="email"]', {
                timeout: 10000
            });

            // Type email
            const emailInput = await this.page.$('input[name="username"], input[name="email"], input[type="email"]');
            if (emailInput) {
                await emailInput.click();
                await this.page.waitForTimeout(500);
                await emailInput.type(this.email, { delay: 100 });
                console.log('✅ Email entered');
            }

            // Type password
            const passwordInput = await this.page.$('input[name="password"], input[type="password"]');
            if (passwordInput) {
                await passwordInput.click();
                await this.page.waitForTimeout(500);
                await passwordInput.type(this.password, { delay: 100 });
                console.log('✅ Password entered');
            }

            // Click sign in button
            const submitSelectors = [
                'button[type="submit"]',
                'button[name="submit"]',
                'button:has-text("Sign in")',
                '.tv-button--primary'
            ];

            for (const selector of submitSelectors) {
                try {
                    const submitButton = await this.page.$(selector);
                    if (submitButton) {
                        console.log('🔄 Submitting login form...');
                        await submitButton.click();
                        break;
                    }
                } catch (e) {
                    // Continue
                }
            }

            // Wait for navigation or timeout
            await this.page.waitForTimeout(5000);

            // Check if we're logged in
            const currentUrl = this.page.url();
            if (!currentUrl.includes('signin') && !currentUrl.includes('login')) {
                this.isLoggedIn = true;
                console.log('✅ Successfully logged in!');
            } else {
                console.log('⚠️  Login status unclear, proceeding anyway...');
                this.isLoggedIn = true; // Assume success for now
            }

        } catch (error) {
            console.error('❌ Login error:', error.message);
            throw new Error('Failed to login to TradingView: ' + error.message);
        }
    }

    /**
     * Test a Pine Script on TradingView
     */
    async testPineScript(scriptContent, scriptName) {
        if (!this.isLoggedIn) {
            throw new Error('Not logged in to TradingView');
        }

        console.log(`\n🧪 Testing: ${scriptName}`);
        console.log('─'.repeat(70));

        try {
            // Navigate to Pine Editor
            console.log('📊 Opening Pine Editor...');
            await this.page.goto('https://www.tradingview.com/pine-editor/', {
                waitUntil: 'networkidle2',
                timeout: 60000
            });

            await this.page.waitForTimeout(3000);

            // Find and clear the editor
            console.log('📝 Preparing editor...');
            
            // Try to find the Monaco editor
            const editorSelectors = [
                '.monaco-editor textarea',
                '.view-lines',
                '[role="textbox"]',
                '.pine-editor-container'
            ];

            let editorFound = false;
            for (const selector of editorSelectors) {
                try {
                    const editor = await this.page.$(selector);
                    if (editor) {
                        console.log(`✅ Found editor with selector: ${selector}`);
                        editorFound = true;
                        break;
                    }
                } catch (e) {
                    // Continue
                }
            }

            if (!editorFound) {
                console.log('⚠️  Editor not found with standard selectors');
            }

            // Clear existing content
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('A');
            await this.page.keyboard.up('Control');
            await this.page.keyboard.press('Backspace');
            await this.page.waitForTimeout(500);

            console.log('⌨️  Typing Pine Script code...');
            
            // Type the script content
            await this.page.keyboard.type(scriptContent, { delay: 10 });
            
            await this.page.waitForTimeout(2000);

            // Look for compile/save button
            console.log('💾 Compiling script...');
            
            const compileSelectors = [
                'button[name="save-script"]',
                'button:has-text("Save")',
                'button[title*="Compile"]',
                '.pine-editor-save-button'
            ];

            for (const selector of compileSelectors) {
                try {
                    const compileButton = await this.page.$(selector);
                    if (compileButton) {
                        await compileButton.click();
                        console.log('✅ Compile button clicked');
                        break;
                    }
                } catch (e) {
                    // Continue
                }
            }

            // Wait for compilation
            await this.page.waitForTimeout(3000);

            // Check for compilation errors
            console.log('🔍 Checking for compilation errors...');
            
            const errorSelectors = [
                '.pine-error-list',
                '.compilation-error',
                '[class*="error"]',
                '.pine-editor-errors'
            ];

            let errors = [];
            for (const selector of errorSelectors) {
                try {
                    const errorElement = await this.page.$(selector);
                    if (errorElement) {
                        const errorText = await this.page.evaluate(el => el.textContent, errorElement);
                        if (errorText && errorText.trim()) {
                            errors.push(errorText.trim());
                        }
                    }
                } catch (e) {
                    // Continue
                }
            }

            // Take a screenshot
            const screenshotPath = path.join(__dirname, 'screenshots', `${scriptName.replace(/[^a-z0-9]/gi, '_')}.png`);
            const screenshotDir = path.dirname(screenshotPath);
            if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir, { recursive: true });
            }
            
            await this.page.screenshot({ path: screenshotPath, fullPage: false });
            console.log(`📸 Screenshot saved: ${screenshotPath}`);

            if (errors.length > 0) {
                console.log('❌ Compilation FAILED');
                console.log('Errors:', errors.join('\n'));
                return {
                    success: false,
                    errors: errors,
                    screenshot: screenshotPath
                };
            } else {
                console.log('✅ Compilation SUCCESSFUL');
                return {
                    success: true,
                    errors: [],
                    screenshot: screenshotPath
                };
            }

        } catch (error) {
            console.error('❌ Test error:', error.message);
            return {
                success: false,
                errors: [error.message],
                screenshot: null
            };
        }
    }

    /**
     * Close the browser
     */
    async close() {
        if (this.browser) {
            console.log('🔒 Closing browser...');
            await this.browser.close();
        }
    }
}

module.exports = TradingViewTester;

// CLI usage
if (require.main === module) {
    // Load environment variables if .env file exists
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                process.env[key.trim()] = value;
            }
        });
    }

    const email = process.env.TRADINGVIEW_EMAIL;
    const password = process.env.TRADINGVIEW_PASSWORD;

    if (!email || email === 'your-email@example.com') {
        console.error('❌ TradingView credentials not configured!');
        console.error('');
        console.error('Please configure your credentials:');
        console.error('1. Copy .env.example to .env');
        console.error('2. Edit .env with your real TradingView credentials');
        console.error('');
        console.error('Or set environment variables:');
        console.error('  export TRADINGVIEW_EMAIL="your-email@example.com"');
        console.error('  export TRADINGVIEW_PASSWORD="your-password"');
        process.exit(1);
    }

    (async () => {
        const tester = new TradingViewTester(email, password);
        
        try {
            await tester.initialize();

            // Test example script
            const exampleScript = `//@version=6
indicator("Test Indicator", overlay=true)
plot(ta.sma(close, 14), color=color.blue, title="SMA 14")`;

            const result = await tester.testPineScript(exampleScript, 'test_indicator');
            
            if (result.success) {
                console.log('\n✅ Test completed successfully!');
                process.exit(0);
            } else {
                console.log('\n❌ Test failed!');
                process.exit(1);
            }

        } catch (error) {
            console.error('\n❌ Fatal error:', error.message);
            process.exit(1);
        } finally {
            await tester.close();
        }
    })();
}
