const fs = require('fs');
const path = require('path');
const TradingViewTester = require('./tradingview_real_tester');
const { PineScriptValidator } = require('./pine_validator');

/**
 * Full Integration Test Runner
 * Tests all Pine Scripts on TradingView with real credentials
 */

async function testAllScripts() {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║     🌐 TRADINGVIEW REAL INTEGRATION TEST RUNNER              ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('');

    // Load credentials
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

    // Check credentials
    if (!email || email === 'your-email@example.com' || !password || password === 'your-password') {
        console.error('❌ TradingView credentials not configured!\n');
        console.error('📋 Setup Instructions:\n');
        console.error('1. Copy .env.example to .env:');
        console.error('   cp .env.example .env\n');
        console.error('2. Edit .env with your TradingView credentials:');
        console.error('   nano .env\n');
        console.error('3. Add your real email and password\n');
        console.error('⚠️  Alternative: Set environment variables:');
        console.error('   export TRADINGVIEW_EMAIL="your-email@example.com"');
        console.error('   export TRADINGVIEW_PASSWORD="your-password"\n');
        process.exit(1);
    }

    console.log('✅ Credentials loaded');
    console.log(`📧 Email: ${email.substring(0, 3)}***${email.substring(email.indexOf('@'))}`);
    console.log('');

    // Collect all Pine Script files
    const scriptsToTest = [];
    const examplesDir = path.join(__dirname, 'pine_scripts', 'examples');
    
    if (fs.existsSync(examplesDir)) {
        const files = fs.readdirSync(examplesDir);
        files.filter(f => f.endsWith('.pine')).forEach(file => {
            scriptsToTest.push({
                name: file,
                path: path.join(examplesDir, file)
            });
        });
    }

    console.log(`📁 Found ${scriptsToTest.length} Pine Script(s) to test\n`);

    // Phase 1: Local validation
    console.log('═'.repeat(70));
    console.log('PHASE 1: LOCAL VALIDATION');
    console.log('═'.repeat(70));
    console.log('');

    const validator = new PineScriptValidator();
    const validScripts = [];

    for (const script of scriptsToTest) {
        const result = validator.validateFile(script.path);
        
        if (result.valid) {
            console.log(`✅ ${script.name} - Valid`);
            validScripts.push(script);
        } else {
            console.log(`❌ ${script.name} - Invalid`);
            result.errors.forEach(err => console.log(`   ⮑ ${err}`));
        }
    }

    console.log('');
    console.log(`📊 Local Validation: ${validScripts.length}/${scriptsToTest.length} valid`);
    console.log('');

    if (validScripts.length === 0) {
        console.log('❌ No valid scripts to test on TradingView');
        process.exit(1);
    }

    // Phase 2: TradingView testing
    console.log('═'.repeat(70));
    console.log('PHASE 2: TRADINGVIEW INTEGRATION TESTING');
    console.log('═'.repeat(70));
    console.log('');

    const tester = new TradingViewTester(email, password);
    const results = [];

    try {
        await tester.initialize();
        console.log('');

        // Test each valid script
        for (let i = 0; i < validScripts.length; i++) {
            const script = validScripts[i];
            console.log(`\n[${i + 1}/${validScripts.length}] Testing: ${script.name}`);
            console.log('─'.repeat(70));

            const content = fs.readFileSync(script.path, 'utf8');
            const result = await tester.testPineScript(content, script.name);
            
            results.push({
                name: script.name,
                ...result
            });

            // Wait between tests to avoid rate limiting
            if (i < validScripts.length - 1) {
                console.log('⏳ Waiting 5 seconds before next test...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

    } catch (error) {
        console.error('\n❌ Fatal error during testing:', error.message);
        await tester.close();
        process.exit(1);
    } finally {
        await tester.close();
    }

    // Summary
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                      📊 FINAL SUMMARY                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('');

    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    console.log(`📈 Results:`);
    console.log(`   Total Tested: ${results.length}`);
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log('');

    if (failed > 0) {
        console.log('❌ FAILED SCRIPTS:');
        results.filter(r => !r.success).forEach(r => {
            console.log(`   - ${r.name}`);
            if (r.errors && r.errors.length > 0) {
                r.errors.forEach(err => console.log(`     ⮑ ${err}`));
            }
        });
        console.log('');
    }

    console.log('📸 Screenshots saved in: ./screenshots/');
    console.log('');

    if (successful === results.length) {
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║           🎉 ALL TESTS PASSED ON TRADINGVIEW! 🎉             ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');
        process.exit(0);
    } else {
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║              ⚠️  SOME TESTS FAILED - SEE ABOVE                ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');
        process.exit(1);
    }
}

// Run tests
if (require.main === module) {
    testAllScripts().catch(error => {
        console.error('❌ Unhandled error:', error);
        process.exit(1);
    });
}

module.exports = { testAllScripts };
