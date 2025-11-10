const fs = require('fs');
const path = require('path');
const TradingViewTester = require('./tradingview_real_tester');
const { PineScriptValidator } = require('./pine_validator');
const PineScriptKnowledge = require('./pine_knowledge_base');

/**
 * Auto-Correcting TradingView Test Runner
 * Tests scripts on TradingView, detects errors, attempts to fix them, and retries
 * Now with integrated Pine Script v6 knowledge base
 */

class AutoCorrectingTester {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.tester = null;
        this.maxRetries = 3;
        this.fixAttempts = [];
        this.knowledgeBase = new PineScriptKnowledge();
    }

    /**
     * Analyze TradingView error and suggest a fix using knowledge base
     */
    analyzeAndFixError(code, errorMessage) {
        console.log('🔍 Analyzing error:', errorMessage);
        console.log('📚 Consulting Pine Script v6 knowledge base...');
        
        let fixedCode = code;
        let fixDescription = 'Unknown error';

        // First, check knowledge base for suggestions
        const kbSuggestion = this.knowledgeBase.getSuggestionForError(errorMessage);
        if (kbSuggestion) {
            console.log(`   📖 Knowledge base suggestion: ${kbSuggestion.solution}`);
        }

        // Check for deprecated functions using knowledge base
        for (const [oldFunc, info] of Object.entries(this.knowledgeBase.knowledge.deprecatedFunctions)) {
            const pattern = new RegExp(`\\b${oldFunc}\\s*\\(`, 'gi');
            if (pattern.test(code) && errorMessage.toLowerCase().includes(oldFunc)) {
                console.log(`   → Deprecated function detected: ${oldFunc}()`);
                console.log(`   → Replacing with: ${info.replacement}()`);
                fixedCode = code.replace(pattern, `${info.replacement}(`);
                fixDescription = `Replaced deprecated ${oldFunc}() with ${info.replacement}()`;
                console.log(`   ✓ Applied fix: ${fixDescription}`);
                return { fixedCode, fixDescription };
            }
        }

        // Common Pine Script error patterns and fixes
        const errorPatterns = [
            {
                pattern: /undeclared identifier|Cannot find|variable.*not found/i,
                fix: (code, error) => {
                    // Extract variable name from error
                    const varMatch = error.match(/['"`](\w+)['"`]/);
                    if (varMatch) {
                        const varName = varMatch[1];
                        console.log(`   → Missing variable: ${varName}`);
                        // Try to declare common missing variables
                        if (varName === 'close' || varName === 'open' || varName === 'high' || varName === 'low') {
                            return { code, description: 'Built-in variable should be available' };
                        }
                    }
                    return { code, description: 'Could not auto-fix undeclared identifier' };
                }
            },
            {
                pattern: /mismatched input|Syntax error|unexpected token/i,
                fix: (code) => {
                    console.log('   → Checking for syntax errors...');
                    // Check for common syntax issues
                    
                    // Missing closing parentheses
                    const openParens = (code.match(/\(/g) || []).length;
                    const closeParens = (code.match(/\)/g) || []).length;
                    if (openParens > closeParens) {
                        console.log('   → Adding missing closing parenthesis');
                        code = code.trimEnd() + ')';
                        return { code, description: 'Added missing closing parenthesis' };
                    }
                    
                    return { code, description: 'Could not auto-fix syntax error' };
                }
            },
            {
                pattern: /deprecated|no longer supported/i,
                fix: (code, error) => {
                    console.log('   → Replacing deprecated syntax...');
                    
                    // Replace study() with indicator()
                    if (code.includes('study(')) {
                        code = code.replace(/study\s*\(/g, 'indicator(');
                        return { code, description: 'Replaced deprecated study() with indicator()' };
                    }
                    
                    // Replace security() with request.security()
                    if (code.includes('security(') && !code.includes('request.security(')) {
                        code = code.replace(/\bsecurity\s*\(/g, 'request.security(');
                        return { code, description: 'Replaced deprecated security() with request.security()' };
                    }
                    
                    return { code, description: 'Could not auto-fix deprecated function' };
                }
            },
            {
                pattern: /wrong number of arguments|too many arguments|too few arguments/i,
                fix: (code, error) => {
                    console.log('   → Checking argument count...');
                    // This is harder to fix automatically without knowing the function signature
                    return { code, description: 'Argument count mismatch - manual fix needed' };
                }
            },
            {
                pattern: /type mismatch|cannot convert|incompatible types/i,
                fix: (code, error) => {
                    console.log('   → Type conversion issue detected...');
                    // Add explicit type conversions for common cases
                    if (error.includes('float') && error.includes('int')) {
                        console.log('   → May need to convert between int and float');
                    }
                    return { code, description: 'Type mismatch - may need explicit conversion' };
                }
            }
        ];

        // Try each pattern
        for (const { pattern, fix } of errorPatterns) {
            if (pattern.test(errorMessage)) {
                const result = fix(code, errorMessage);
                fixedCode = result.code;
                fixDescription = result.description;
                console.log(`   ✓ Applied fix: ${fixDescription}`);
                break;
            }
        }

        return { fixedCode, fixDescription };
    }

    /**
     * Test a script with auto-correction loop
     */
    async testWithAutoCorrect(scriptPath, scriptName) {
        console.log('\n' + '═'.repeat(70));
        console.log(`🔄 Auto-Correcting Test: ${scriptName}`);
        console.log('═'.repeat(70));

        let currentCode = fs.readFileSync(scriptPath, 'utf8');
        let attempt = 0;
        let success = false;
        const history = [];

        while (attempt < this.maxRetries && !success) {
            attempt++;
            console.log(`\n📝 Attempt ${attempt}/${this.maxRetries}`);
            console.log('─'.repeat(70));

            // First, validate locally
            console.log('🔍 Phase 1: Local validation...');
            const validator = new PineScriptValidator();
            const localResult = validator.validateContent(currentCode, scriptName);

            if (!localResult.valid) {
                console.log('❌ Local validation failed:');
                localResult.errors.forEach(err => console.log(`   • ${err}`));
                
                // Try to fix local errors
                const firstError = localResult.errors[0] || '';
                const { fixedCode, fixDescription } = this.analyzeAndFixError(currentCode, firstError);
                
                if (fixedCode !== currentCode) {
                    console.log(`🔧 Applied fix: ${fixDescription}`);
                    currentCode = fixedCode;
                    history.push({
                        attempt,
                        phase: 'local',
                        error: firstError,
                        fix: fixDescription
                    });
                    continue; // Retry with fixed code
                } else {
                    console.log('⚠️  Could not auto-fix local validation errors');
                    break;
                }
            } else {
                console.log('✅ Local validation passed');
            }

            // Phase 2: Test on TradingView
            console.log('\n🌐 Phase 2: TradingView compilation...');
            const result = await this.tester.testPineScript(currentCode, `${scriptName}_attempt${attempt}`);

            if (result.success) {
                console.log('✅ TradingView compilation successful!');
                success = true;
                
                // Save the corrected version if changes were made
                if (history.length > 0) {
                    const correctedPath = scriptPath.replace('.pine', '_corrected.pine');
                    fs.writeFileSync(correctedPath, currentCode);
                    console.log(`💾 Corrected version saved: ${correctedPath}`);
                }
            } else if (result.errors && result.errors.length > 0) {
                console.log('❌ TradingView compilation failed:');
                result.errors.forEach(err => console.log(`   • ${err}`));

                if (attempt < this.maxRetries) {
                    // Try to fix the error
                    const tvError = result.errors[0];
                    const { fixedCode, fixDescription } = this.analyzeAndFixError(currentCode, tvError);
                    
                    if (fixedCode !== currentCode) {
                        console.log(`🔧 Applied fix: ${fixDescription}`);
                        currentCode = fixedCode;
                        history.push({
                            attempt,
                            phase: 'tradingview',
                            error: tvError,
                            fix: fixDescription
                        });
                        console.log('🔄 Retrying with corrected code...');
                    } else {
                        console.log('⚠️  Could not auto-fix TradingView error');
                        break;
                    }
                }
            }
        }

        return {
            success,
            attempts: attempt,
            history,
            finalCode: currentCode,
            originalCode: fs.readFileSync(scriptPath, 'utf8')
        };
    }

    /**
     * Test all scripts with auto-correction
     */
    async testAll() {
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║     🤖 AUTO-CORRECTING TRADINGVIEW TEST RUNNER               ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('This runner will:');
        console.log('  1. Test each script on TradingView');
        console.log('  2. Detect compilation errors');
        console.log('  3. Attempt to fix errors automatically');
        console.log('  4. Retry up to 3 times per script');
        console.log('  5. Save corrected versions');
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

        if (!email || email === 'your-email@example.com' || !password || password === 'your-password') {
            console.error('❌ TradingView credentials not configured!\n');
            console.error('Set TRADINGVIEW_EMAIL and TRADINGVIEW_PASSWORD environment variables.');
            process.exit(1);
        }

        console.log('✅ Credentials loaded');
        console.log(`📧 Email: ${email.substring(0, 3)}***${email.substring(email.indexOf('@'))}\n`);

        // Collect scripts
        const scriptsToTest = [];
        const examplesDir = path.join(__dirname, 'pine_scripts', 'examples');
        
        if (fs.existsSync(examplesDir)) {
            const files = fs.readdirSync(examplesDir);
            files.filter(f => f.endsWith('.pine') && !f.includes('_corrected')).forEach(file => {
                scriptsToTest.push({
                    name: file,
                    path: path.join(examplesDir, file)
                });
            });
        }

        console.log(`📁 Found ${scriptsToTest.length} Pine Script(s) to test\n`);

        // Initialize TradingView tester
        this.tester = new TradingViewTester(email, password);
        const results = [];

        try {
            await this.tester.initialize();
            console.log('');

            // Test each script with auto-correction
            for (let i = 0; i < scriptsToTest.length; i++) {
                const script = scriptsToTest[i];
                
                const result = await this.testWithAutoCorrect(script.path, script.name);
                results.push({
                    name: script.name,
                    ...result
                });

                // Wait between tests
                if (i < scriptsToTest.length - 1) {
                    console.log('\n⏳ Waiting 5 seconds before next test...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

        } catch (error) {
            console.error('\n❌ Fatal error:', error.message);
        } finally {
            if (this.tester) {
                await this.tester.close();
            }
        }

        // Final report
        console.log('\n\n╔════════════════════════════════════════════════════════════════╗');
        console.log('║                   📊 FINAL REPORT                              ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');

        const successful = results.filter(r => r.success).length;
        const fixed = results.filter(r => r.success && r.history.length > 0).length;
        const failed = results.length - successful;

        console.log(`\n📈 Results:`);
        console.log(`   Total Scripts: ${results.length}`);
        console.log(`   ✅ Successful: ${successful}`);
        console.log(`   🔧 Auto-Fixed: ${fixed}`);
        console.log(`   ❌ Failed: ${failed}`);

        if (fixed > 0) {
            console.log('\n🔧 AUTO-CORRECTED SCRIPTS:');
            results.filter(r => r.success && r.history.length > 0).forEach(r => {
                console.log(`\n   📝 ${r.name}:`);
                r.history.forEach(h => {
                    console.log(`      • Attempt ${h.attempt} (${h.phase}): ${h.fix}`);
                });
            });
        }

        if (failed > 0) {
            console.log('\n❌ FAILED SCRIPTS:');
            results.filter(r => !r.success).forEach(r => {
                console.log(`   - ${r.name} (${r.attempts} attempts)`);
                if (r.history.length > 0) {
                    console.log('     Attempted fixes:');
                    r.history.forEach(h => console.log(`       • ${h.fix}`));
                }
            });
        }

        console.log('\n' + '═'.repeat(70));
        
        if (successful === results.length) {
            console.log('🎉 ALL SCRIPTS COMPILED SUCCESSFULLY!');
        } else if (successful > 0) {
            console.log(`⚠️  ${successful}/${results.length} scripts compiled successfully`);
        } else {
            console.log('❌ ALL SCRIPTS FAILED TO COMPILE');
        }
        
        console.log('═'.repeat(70) + '\n');

        process.exit(failed > 0 ? 1 : 0);
    }
}

// CLI usage
if (require.main === module) {
    const tester = new AutoCorrectingTester();
    tester.testAll().catch(error => {
        console.error('❌ Unhandled error:', error);
        process.exit(1);
    });
}

module.exports = AutoCorrectingTester;
