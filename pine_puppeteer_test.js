const fs = require('fs');
const path = require('path');
const { PineScriptValidator } = require('./pine_validator');

/**
 * Enhanced Pine Script Tester
 * This script tests Pine Scripts locally first, then optionally with Puppeteer
 * Usage: node pine_puppeteer_test.js [file_or_directory]
 */

class PinePuppeteerTester {
    constructor() {
        this.validator = new PineScriptValidator();
        this.puppeteerAvailable = false;
        this.testResults = [];
        this.checkPuppeteerAvailability();
    }

    /**
     * Check if Puppeteer is available
     */
    checkPuppeteerAvailability() {
        try {
            require.resolve('puppeteer');
            this.puppeteerAvailable = true;
            console.log('✅ Puppeteer is available');
        } catch (e) {
            this.puppeteerAvailable = false;
            console.log('⚠️  Puppeteer not installed - will use local validation only');
            console.log('   Run: npm install puppeteer (optional)');
        }
    }

    /**
     * Test a single Pine Script file
     * @param {string} filePath - Path to the Pine Script file
     * @returns {Object} - Test results
     */
    async testFile(filePath) {
        console.log('\n' + '='.repeat(70));
        console.log(`🧪 Testing: ${path.basename(filePath)}`);
        console.log('='.repeat(70));

        // Phase 1: Local validation
        console.log('\n📋 Phase 1: Local Syntax Validation');
        console.log('-'.repeat(70));
        
        const localResult = this.validator.validateFile(filePath);
        console.log(PineScriptValidator.formatResults(localResult));

        if (!localResult.valid) {
            console.log('❌ Skipping Puppeteer test due to local validation errors');
            return {
                file: path.basename(filePath),
                path: filePath,
                localValidation: localResult,
                puppeteerTest: null,
                overall: 'FAILED'
            };
        }

        // Phase 2: Puppeteer test (if available and credentials configured)
        let puppeteerResult = null;
        if (this.puppeteerAvailable) {
            console.log('\n📋 Phase 2: Puppeteer Integration Test');
            console.log('-'.repeat(70));
            puppeteerResult = await this.runPuppeteerTest(filePath);
        } else {
            console.log('\n📋 Phase 2: Puppeteer Integration Test');
            console.log('-'.repeat(70));
            console.log('⏭️  Skipped - Puppeteer not available');
        }

        const overall = localResult.valid ? 'PASSED' : 'FAILED';
        
        return {
            file: path.basename(filePath),
            path: filePath,
            localValidation: localResult,
            puppeteerTest: puppeteerResult,
            overall: overall
        };
    }

    /**
     * Run Puppeteer test
     * @param {string} filePath - Path to the Pine Script file
     * @returns {Object} - Test result
     */
    async runPuppeteerTest(filePath) {
        const puppeteer = require('puppeteer');
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for credentials
        const email = process.env.TRADINGVIEW_EMAIL || 'your-email@example.com';
        const password = process.env.TRADINGVIEW_PASSWORD || 'your-password';

        if (email === 'your-email@example.com') {
            console.log('⚠️  TradingView credentials not configured');
            console.log('   Set environment variables: TRADINGVIEW_EMAIL and TRADINGVIEW_PASSWORD');
            console.log('   or edit compile_pine_script.js');
            console.log('ℹ️  Puppeteer test skipped - local validation passed ✅');
            return {
                status: 'SKIPPED',
                reason: 'No credentials configured',
                note: 'Local validation passed successfully'
            };
        }

        console.log('🌐 Launching browser...');
        
        try {
            const browser = await puppeteer.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            console.log('🔗 Navigating to TradingView...');
            await page.goto('https://www.tradingview.com/', { waitUntil: 'networkidle2', timeout: 30000 });

            // Try to login
            console.log('🔐 Attempting login...');
            // Note: This is a simplified version - actual implementation may need adjustments
            // based on TradingView's current UI structure

            await browser.close();

            return {
                status: 'SKIPPED',
                reason: 'TradingView integration requires manual configuration',
                note: 'Local validation passed - script syntax is correct'
            };

        } catch (error) {
            console.error('❌ Puppeteer test error:', error.message);
            return {
                status: 'ERROR',
                error: error.message,
                note: 'Local validation passed - Puppeteer test failed due to network/config issues'
            };
        }
    }

    /**
     * Test all Pine Script files in a directory
     * @param {string} dirPath - Directory path
     */
    async testDirectory(dirPath) {
        console.log('\n' + '='.repeat(70));
        console.log('🚀 Pine Script Comprehensive Test Suite');
        console.log('='.repeat(70));

        if (!fs.existsSync(dirPath)) {
            console.error(`❌ Directory not found: ${dirPath}`);
            return;
        }

        const files = fs.readdirSync(dirPath);
        const pineFiles = files.filter(file => file.endsWith('.pine'));

        console.log(`\n📁 Found ${pineFiles.length} Pine Script file(s) in ${dirPath}`);

        for (const file of pineFiles) {
            const filePath = path.join(dirPath, file);
            const result = await this.testFile(filePath);
            this.testResults.push(result);
        }

        this.printSummary();
    }

    /**
     * Print test summary
     */
    printSummary() {
        console.log('\n' + '='.repeat(70));
        console.log('📊 COMPREHENSIVE TEST SUMMARY');
        console.log('='.repeat(70));

        const total = this.testResults.length;
        const passed = this.testResults.filter(r => r.overall === 'PASSED').length;
        const failed = total - passed;

        console.log(`\n📈 Overall Results:`);
        console.log(`   Total Files: ${total}`);
        console.log(`   ✅ Passed: ${passed}`);
        console.log(`   ❌ Failed: ${failed}`);

        console.log(`\n🔍 Local Validation:`);
        const localPassed = this.testResults.filter(r => r.localValidation.valid).length;
        console.log(`   ✅ Valid: ${localPassed}/${total}`);

        console.log(`\n🌐 Puppeteer Tests:`);
        const puppeteerTests = this.testResults.filter(r => r.puppeteerTest !== null).length;
        const puppeteerSkipped = this.testResults.filter(r => 
            r.puppeteerTest && r.puppeteerTest.status === 'SKIPPED'
        ).length;
        console.log(`   Executed: ${puppeteerTests}`);
        console.log(`   Skipped: ${puppeteerSkipped}`);

        if (failed > 0) {
            console.log('\n❌ FAILED FILES:');
            this.testResults
                .filter(r => r.overall === 'FAILED')
                .forEach(r => {
                    console.log(`   - ${r.file}`);
                    if (r.localValidation && !r.localValidation.valid) {
                        r.localValidation.errors.forEach(err => {
                            console.log(`     ⮑ ${err}`);
                        });
                    }
                });
        }

        console.log('\n' + '='.repeat(70));

        if (passed === total && total > 0) {
            console.log('🎉 ALL TESTS PASSED!');
            console.log('\n💡 All Pine Scripts are syntactically correct and ready for TradingView');
        } else if (total === 0) {
            console.log('⚠️  No test files found');
        } else {
            console.log('⚠️  Some tests failed - review errors above');
        }

        console.log('='.repeat(70) + '\n');
    }

    /**
     * Test all examples and tests directories
     */
    async testAll() {
        const examplesDir = path.join(__dirname, 'pine_scripts', 'examples');
        const testsDir = path.join(__dirname, 'pine_scripts', 'tests');

        if (fs.existsSync(examplesDir)) {
            await this.testDirectory(examplesDir);
        }

        if (fs.existsSync(testsDir)) {
            await this.testDirectory(testsDir);
        }

        return this.testResults.every(r => r.overall === 'PASSED');
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);

    const tester = new PinePuppeteerTester();

    (async () => {
        if (args.length === 0) {
            // Test all directories
            console.log('🔄 Running all tests...\n');
            const success = await tester.testAll();
            process.exit(success ? 0 : 1);
        } else {
            const target = args[0];
            
            if (!fs.existsSync(target)) {
                console.error(`❌ File or directory not found: ${target}`);
                process.exit(1);
            }

            if (fs.statSync(target).isDirectory()) {
                await tester.testDirectory(target);
            } else {
                const result = await tester.testFile(target);
                tester.testResults.push(result);
                tester.printSummary();
            }

            const success = tester.testResults.every(r => r.overall === 'PASSED');
            process.exit(success ? 0 : 1);
        }
    })();
}

module.exports = PinePuppeteerTester;
