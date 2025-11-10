#!/usr/bin/env node

/**
 * Pine Script Code Generator and Tester
 * This script demonstrates how to programmatically create and test Pine Script v6 code
 */

const fs = require('fs');
const path = require('path');
const { PineScriptValidator } = require('./pine_validator');

/**
 * Generate a simple Pine Script indicator
 * @param {string} name - Indicator name
 * @param {Object} config - Configuration options
 * @returns {string} - Generated Pine Script code
 */
function generateIndicator(name, config = {}) {
    const {
        version = 6,
        overlay = true,
        length = 14,
        source = 'close',
        indicatorType = 'sma',
        color = 'color.blue'
    } = config;

    let code = `//@version=${version}\n`;
    code += `indicator("${name}", overlay=${overlay})\n\n`;
    code += `// Input parameters\n`;
    code += `lengthInput = input.int(${length}, "Length", minval=1)\n`;
    code += `sourceInput = input.source(${source}, "Source")\n\n`;
    code += `// Calculate indicator\n`;
    
    switch (indicatorType) {
        case 'sma':
            code += `indicatorValue = ta.sma(sourceInput, lengthInput)\n`;
            break;
        case 'ema':
            code += `indicatorValue = ta.ema(sourceInput, lengthInput)\n`;
            break;
        case 'rsi':
            code += `indicatorValue = ta.rsi(sourceInput, lengthInput)\n`;
            break;
        default:
            code += `indicatorValue = ta.sma(sourceInput, lengthInput)\n`;
    }
    
    code += `\n// Plot\n`;
    code += `plot(indicatorValue, "${name}", color=${color}, linewidth=2)\n`;
    
    return code;
}

/**
 * Generate and test a Pine Script file
 * @param {string} filename - Output filename
 * @param {Object} config - Configuration for the indicator
 */
function generateAndTest(filename, config = {}) {
    console.log('\n' + '='.repeat(70));
    console.log(`🔧 Generating Pine Script: ${filename}`);
    console.log('='.repeat(70));
    
    // Generate the code
    const code = generateIndicator(config.name || 'Generated Indicator', config);
    
    console.log('\n📝 Generated Code:');
    console.log('-'.repeat(70));
    console.log(code);
    console.log('-'.repeat(70));
    
    // Save to file
    const outputDir = path.join(__dirname, 'pine_scripts', 'generated');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, code);
    console.log(`\n✅ File saved: ${filePath}`);
    
    // Test the generated code
    console.log('\n🧪 Testing generated code...');
    const validator = new PineScriptValidator();
    const result = validator.validateFile(filePath);
    
    console.log(PineScriptValidator.formatResults(result));
    
    return result;
}

// Example usage: Generate and test multiple indicators
if (require.main === module) {
    console.log('🚀 Pine Script v6 Code Generator and Tester');
    console.log('='.repeat(70));
    console.log('This tool demonstrates automated Pine Script code generation and testing.');
    
    const indicators = [
        {
            filename: 'auto_sma.pine',
            config: {
                name: 'Auto Generated SMA',
                indicatorType: 'sma',
                length: 20,
                color: 'color.blue'
            }
        },
        {
            filename: 'auto_ema.pine',
            config: {
                name: 'Auto Generated EMA',
                indicatorType: 'ema',
                length: 9,
                color: 'color.red'
            }
        },
        {
            filename: 'auto_rsi.pine',
            config: {
                name: 'Auto Generated RSI',
                indicatorType: 'rsi',
                length: 14,
                color: 'color.purple',
                overlay: false
            }
        }
    ];
    
    let allPassed = true;
    const results = [];
    
    indicators.forEach(({ filename, config }) => {
        const result = generateAndTest(filename, config);
        results.push({ filename, result });
        if (!result.valid) {
            allPassed = false;
        }
    });
    
    // Final summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 GENERATION AND TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`\nTotal Indicators Generated: ${indicators.length}`);
    console.log(`✅ Valid: ${results.filter(r => r.result.valid).length}`);
    console.log(`❌ Invalid: ${results.filter(r => !r.result.valid).length}`);
    
    if (allPassed) {
        console.log('\n🎉 All generated indicators passed validation!');
        console.log('\n💡 You can now copy these indicators to TradingView and test them live.');
    } else {
        console.log('\n⚠️  Some indicators failed validation. Review the errors above.');
    }
    
    console.log('='.repeat(70) + '\n');
    
    process.exit(allPassed ? 0 : 1);
}

module.exports = {
    generateIndicator,
    generateAndTest
};
