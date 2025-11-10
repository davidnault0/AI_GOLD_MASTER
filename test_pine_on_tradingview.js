const puppeteer = require('puppeteer');
const fs = require('fs');

async function testPineScriptOnTradingView() {
    console.log('🚀 Démarrage du test sur TradingView...');
    
    // Lire le code Pine Script
    const pineCode = fs.readFileSync('AI_GOLD_MASTER_ULTRA_FIXED.pine', 'utf8');
    console.log(`📝 Code chargé: ${pineCode.split('\n').length} lignes`);
    
    const browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('🌐 Accès à TradingView...');
        await page.goto('https://www.tradingview.com/chart/', { 
            waitUntil: 'networkidle2',
            timeout: 60000 
        });
        
        console.log('✅ Page chargée!');
        
        // Attendre et cliquer sur Pine Editor
        console.log('📂 Ouverture Pine Editor...');
        await page.waitForTimeout(5000);
        
        // Chercher le bouton Pine Editor
        const pineEditorButton = await page.$('button[aria-label*="Pine"]');
        if (pineEditorButton) {
            await pineEditorButton.click();
            console.log('✅ Pine Editor ouvert!');
        } else {
            console.log('⚠️ Bouton Pine Editor non trouvé, recherche alternative...');
        }
        
        await page.waitForTimeout(3000);
        
        // Prendre screenshot
        await page.screenshot({ path: 'tradingview_test.png', fullPage: true });
        console.log('📸 Screenshot sauvegardé: tradingview_test.png');
        
        // Essayer de trouver l'éditeur de code
        const editor = await page.$('.tv-script-editor, .monaco-editor, textarea');
        if (editor) {
            console.log('✅ Éditeur trouvé!');
            await editor.click();
            await page.keyboard.type(pineCode);
            console.log('✅ Code collé!');
            
            // Attendre compilation
            await page.waitForTimeout(5000);
            
            // Chercher erreurs
            const errors = await page.evaluate(() => {
                const errorElements = document.querySelectorAll('.error, .compilation-error, [class*="error"]');
                return Array.from(errorElements).map(e => e.textContent);
            });
            
            if (errors.length > 0) {
                console.log('❌ ERREURS DE COMPILATION:');
                errors.forEach((err, i) => console.log(`  ${i+1}. ${err}`));
                fs.writeFileSync('compilation_errors.txt', errors.join('\n\n'));
            } else {
                console.log('✅ AUCUNE ERREUR DÉTECTÉE!');
            }
            
            await page.screenshot({ path: 'tradingview_result.png', fullPage: true });
            console.log('📸 Screenshot résultat: tradingview_result.png');
        } else {
            console.log('❌ Éditeur non trouvé');
        }
        
    } catch (error) {
        console.error('❌ ERREUR:', error.message);
        await page.screenshot({ path: 'tradingview_error.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('🏁 Test terminé!');
    }
}

testPineScriptOnTradingView().catch(console.error);
