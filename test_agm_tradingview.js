const TradingViewTester = require('./tradingview_real_tester.js');
const fs = require('fs');
const path = require('path');

async function testAGM() {
    const email = 'davidnault0@gmail.com';
    const password = 'S4rouge!b5';
    const scriptPath = path.join(__dirname, 'pine_scripts/ai_gold_master/AI_GOLD_MASTER_COPIER_COLLER.pine');
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 TEST AI GOLD MASTER SUR TRADINGVIEW');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📧 Email:', email);
    console.log('📂 Script:', scriptPath);
    console.log('═══════════════════════════════════════════════════════\n');
    
    const tester = new TradingViewTester(email, password);
    
    try {
        // Initialize and login
        await tester.initialize();
        
        // Test the script
        console.log('🧪 Testing AI GOLD MASTER script...\n');
        const result = await tester.testScript(scriptPath);
        
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('📊 RÉSULTATS DU TEST');
        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ Succès:', result.success);
        console.log('📝 Script:', result.scriptName);
        console.log('❌ Erreurs:', result.errors.length);
        
        if (result.errors.length > 0) {
            console.log('\n🔴 ERREURS DÉTECTÉES:');
            result.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        } else {
            console.log('\n✅ AUCUNE ERREUR - COMPILATION RÉUSSIE!');
        }
        
        console.log('\n📸 Screenshot:', result.screenshotPath);
        console.log('═══════════════════════════════════════════════════════\n');
        
        // Close browser
        await tester.close();
        
        if (!result.success) {
            process.exit(1);
        }
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error.stack);
        
        if (tester.browser) {
            await tester.close();
        }
        
        process.exit(1);
    }
}

testAGM();
