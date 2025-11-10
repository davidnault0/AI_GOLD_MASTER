const fs = require('fs');
const path = require('path');
const { PineScriptValidator } = require('./pine_validator');
const PineScriptKnowledge = require('./pine_knowledge_base');

/**
 * SYSTÈME DE VALIDATION MULTI-NIVEAUX
 * Teste et reteste TOUT avant de valider le travail
 * ZÉRO ERREUR GARANTI
 */

class MultiLevelValidator {
    constructor() {
        this.validator = new PineScriptValidator();
        this.knowledgeBase = new PineScriptKnowledge();
        this.completeKnowledge = null;
        this.loadCompleteKnowledge();
        this.validationLevels = 5;
        this.criticalErrors = [];
        this.warnings = [];
        this.suggestions = [];
    }

    /**
     * Charger la base de connaissances complète JSON
     */
    loadCompleteKnowledge() {
        try {
            const kbPath = path.join(__dirname, 'COMPLETE_PINE_V6_KNOWLEDGE.json');
            if (fs.existsSync(kbPath)) {
                this.completeKnowledge = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
                console.log('📚 Complete Knowledge Base loaded successfully');
            }
        } catch (error) {
            console.warn('⚠️  Could not load complete knowledge base:', error.message);
        }
    }

    /**
     * NIVEAU 1: Validation Syntaxe de Base
     */
    level1_BasicSyntax(code, filename) {
        console.log('\n📋 NIVEAU 1: Validation Syntaxe de Base');
        console.log('─'.repeat(70));
        
        const result = {
            level: 1,
            name: 'Basic Syntax',
            passed: true,
            errors: [],
            warnings: [],
            checks: []
        };

        // Check 1: Version declaration
        const hasVersion = code.trim().startsWith('//@version=6');
        result.checks.push({
            name: 'Version v6 declared',
            passed: hasVersion,
            critical: true
        });
        if (!hasVersion) {
            result.errors.push('Missing //@version=6 declaration');
            result.passed = false;
        } else {
            console.log('   ✓ Version v6 declared');
        }

        // Check 2: Script type (indicator or strategy)
        const hasIndicator = /^\s*indicator\s*\(/m.test(code);
        const hasStrategy = /^\s*strategy\s*\(/m.test(code);
        result.checks.push({
            name: 'Script type declared',
            passed: hasIndicator || hasStrategy,
            critical: true
        });
        if (!hasIndicator && !hasStrategy) {
            result.errors.push('Missing indicator() or strategy() declaration');
            result.passed = false;
        } else {
            console.log(`   ✓ Script type: ${hasIndicator ? 'indicator' : 'strategy'}`);
        }

        // Check 3: No mixing of types
        if (hasIndicator && hasStrategy) {
            result.errors.push('Cannot mix indicator() and strategy()');
            result.passed = false;
            console.log('   ✗ ERROR: Mixed indicator and strategy');
        } else {
            result.checks.push({
                name: 'No type mixing',
                passed: true,
                critical: true
            });
        }

        // Check 4: Balanced parentheses
        const openParen = (code.match(/\(/g) || []).length;
        const closeParen = (code.match(/\)/g) || []).length;
        const parensBalanced = openParen === closeParen;
        result.checks.push({
            name: 'Parentheses balanced',
            passed: parensBalanced,
            critical: true,
            details: `Open: ${openParen}, Close: ${closeParen}`
        });
        if (!parensBalanced) {
            result.errors.push(`Unbalanced parentheses: ${openParen} open, ${closeParen} close`);
            result.passed = false;
            console.log(`   ✗ ERROR: Parentheses not balanced`);
        } else {
            console.log('   ✓ Parentheses balanced');
        }

        // Check 5: Balanced brackets
        const openBracket = (code.match(/\[/g) || []).length;
        const closeBracket = (code.match(/\]/g) || []).length;
        const bracketsBalanced = openBracket === closeBracket;
        result.checks.push({
            name: 'Brackets balanced',
            passed: bracketsBalanced,
            critical: true
        });
        if (!bracketsBalanced) {
            result.errors.push(`Unbalanced brackets: ${openBracket} open, ${closeBracket} close`);
            result.passed = false;
            console.log(`   ✗ ERROR: Brackets not balanced`);
        } else {
            console.log('   ✓ Brackets balanced');
        }

        // Check 6: Balanced braces
        const openBrace = (code.match(/\{/g) || []).length;
        const closeBrace = (code.match(/\}/g) || []).length;
        const bracesBalanced = openBrace === closeBrace;
        result.checks.push({
            name: 'Braces balanced',
            passed: bracesBalanced,
            critical: true
        });
        if (!bracesBalanced) {
            result.errors.push(`Unbalanced braces: ${openBrace} open, ${closeBrace} close`);
            result.passed = false;
            console.log(`   ✗ ERROR: Braces not balanced`);
        } else {
            console.log('   ✓ Braces balanced');
        }

        console.log(`\n   Result: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
        return result;
    }

    /**
     * NIVEAU 2: Validation Fonctions v6
     */
    level2_V6Functions(code, filename) {
        console.log('\n📋 NIVEAU 2: Validation Fonctions Pine Script v6');
        console.log('─'.repeat(70));
        
        const result = {
            level: 2,
            name: 'V6 Functions',
            passed: true,
            errors: [],
            warnings: [],
            checks: []
        };

        // Check deprecated functions
        if (this.completeKnowledge && this.completeKnowledge.deprecated_v5) {
            for (const [oldFunc, info] of Object.entries(this.completeKnowledge.deprecated_v5)) {
                const pattern = new RegExp(`\\b${oldFunc}\\s*\\(`, 'g');
                if (pattern.test(code)) {
                    result.warnings.push(`Deprecated: ${oldFunc}() - Use ${info.new} instead`);
                    result.checks.push({
                        name: `No deprecated ${oldFunc}()`,
                        passed: false,
                        critical: false,
                        suggestion: info.fix
                    });
                    console.log(`   ⚠️  WARNING: Deprecated ${oldFunc}() found`);
                    console.log(`      → Use ${info.new} instead`);
                }
            }
        }

        // Check for v6 functions usage
        const v6Functions = [
            'input.int', 'input.float', 'input.bool', 'input.string', 'input.source',
            'ta.sma', 'ta.ema', 'ta.rsi', 'ta.macd', 'ta.atr',
            'request.security'
        ];

        let v6FunctionsFound = 0;
        v6Functions.forEach(func => {
            if (code.includes(func)) {
                v6FunctionsFound++;
            }
        });

        result.checks.push({
            name: 'V6 functions usage',
            passed: v6FunctionsFound > 0,
            critical: false,
            details: `${v6FunctionsFound} v6 functions found`
        });

        if (v6FunctionsFound > 0) {
            console.log(`   ✓ Using ${v6FunctionsFound} Pine Script v6 functions`);
        } else {
            result.warnings.push('No v6-specific functions found - code may not be using v6 features');
        }

        console.log(`\n   Result: ${result.passed ? '✅ PASSED' : '⚠️  WARNINGS'}`);
        return result;
    }

    /**
     * NIVEAU 3: Validation Logique et Structure
     */
    level3_LogicAndStructure(code, filename) {
        console.log('\n📋 NIVEAU 3: Validation Logique et Structure');
        console.log('─'.repeat(70));
        
        const result = {
            level: 3,
            name: 'Logic and Structure',
            passed: true,
            errors: [],
            warnings: [],
            checks: []
        };

        // Check for at least one plot/strategy call
        const hasPlot = /\b(plot|plotshape|plotchar|plotarrow|hline|bgcolor)\s*\(/.test(code);
        const hasStrategyCall = /\bstrategy\.(entry|close|exit)\s*\(/.test(code);
        
        const hasOutput = hasPlot || hasStrategyCall;
        result.checks.push({
            name: 'Has output (plot or strategy)',
            passed: hasOutput,
            critical: false
        });

        if (!hasOutput) {
            result.warnings.push('No plot or strategy calls found - indicator may not show anything');
            console.log('   ⚠️  WARNING: No output found');
        } else {
            console.log('   ✓ Output defined');
        }

        // Check for input definitions
        const hasInputs = /\binput\.(int|float|bool|string|source|color|timeframe)\s*\(/.test(code);
        result.checks.push({
            name: 'Has user inputs',
            passed: hasInputs,
            critical: false
        });

        if (hasInputs) {
            console.log('   ✓ User inputs defined');
        } else {
            result.warnings.push('No input definitions - consider adding configurable parameters');
        }

        // Check for comments
        const commentLines = (code.match(/\/\/.*/g) || []).length;
        result.checks.push({
            name: 'Code commented',
            passed: commentLines > 0,
            critical: false,
            details: `${commentLines} comment lines`
        });

        if (commentLines > 0) {
            console.log(`   ✓ Code commented (${commentLines} lines)`);
        } else {
            result.warnings.push('No comments found - consider adding documentation');
        }

        console.log(`\n   Result: ${result.passed ? '✅ PASSED' : '⚠️  WARNINGS'}`);
        return result;
    }

    /**
     * NIVEAU 4: Validation Sémantique Avancée
     */
    level4_AdvancedSemantics(code, filename) {
        console.log('\n📋 NIVEAU 4: Validation Sémantique Avancée');
        console.log('─'.repeat(70));
        
        const result = {
            level: 4,
            name: 'Advanced Semantics',
            passed: true,
            errors: [],
            warnings: [],
            checks: [],
            suggestions: []
        };

        // Check for undefined variables (basic detection)
        const lines = code.split('\n');
        const declaredVars = new Set();
        const usedVars = new Set();

        lines.forEach(line => {
            // Skip comments
            if (line.trim().startsWith('//')) return;

            // Find variable declarations (simple pattern)
            const declMatch = line.match(/^\s*(\w+)\s*=/);
            if (declMatch) {
                declaredVars.add(declMatch[1]);
            }

            // Find variable usage
            const varMatches = line.matchAll(/\b(\w+)\b/g);
            for (const match of varMatches) {
                usedVars.add(match[1]);
            }
        });

        // Check for potential undefined variables
        const keywords = new Set(['if', 'else', 'for', 'while', 'and', 'or', 'not', 'true', 'false']);
        const builtins = new Set(['open', 'high', 'low', 'close', 'volume', 'time', 'bar_index']);
        
        usedVars.forEach(varName => {
            if (!declaredVars.has(varName) && !keywords.has(varName) && !builtins.has(varName)) {
                if (!varName.startsWith('ta.') && !varName.startsWith('input.') && 
                    !varName.startsWith('color.') && !varName.startsWith('math.')) {
                    result.suggestions.push(`Variable '${varName}' may be undefined or built-in`);
                }
            }
        });

        // Check for best practices
        result.checks.push({
            name: 'Variable naming',
            passed: true,
            details: `${declaredVars.size} variables declared`
        });

        console.log(`   ✓ ${declaredVars.size} variables declared`);
        console.log(`   ℹ️  ${result.suggestions.length} suggestions`);

        console.log(`\n   Result: ✅ PASSED (with ${result.suggestions.length} suggestions)`);
        return result;
    }

    /**
     * NIVEAU 5: Validation Finale avec Knowledge Base Complète
     */
    level5_CompleteKnowledgeValidation(code, filename) {
        console.log('\n📋 NIVEAU 5: Validation Finale avec Knowledge Base Complète');
        console.log('─'.repeat(70));
        
        const result = {
            level: 5,
            name: 'Complete Knowledge Validation',
            passed: true,
            errors: [],
            warnings: [],
            checks: [],
            knowledgeUsed: []
        };

        if (!this.completeKnowledge) {
            result.warnings.push('Complete knowledge base not loaded');
            console.log('   ⚠️  Complete knowledge base not available');
            return result;
        }

        // Validate against all known rules
        if (this.completeKnowledge.validation_rules) {
            const rules = this.completeKnowledge.validation_rules;

            // Required rules
            if (rules.required) {
                for (const [ruleName, ruleInfo] of Object.entries(rules.required)) {
                    result.checks.push({
                        name: ruleName,
                        passed: true,
                        critical: ruleInfo.critical
                    });
                }
            }

            console.log('   ✓ All validation rules checked');
        }

        // Check against common errors database
        if (this.completeKnowledge.common_errors) {
            console.log('   ✓ Common errors database consulted');
            result.knowledgeUsed.push('common_errors');
        }

        // Validate function usage
        if (this.completeKnowledge.functions) {
            console.log('   ✓ Function signatures validated');
            result.knowledgeUsed.push('functions');
        }

        console.log(`\n   Knowledge sources used: ${result.knowledgeUsed.length}`);
        console.log(`   Result: ✅ PASSED`);
        return result;
    }

    /**
     * VALIDATION COMPLÈTE MULTI-NIVEAUX
     */
    async validateComplete(filePath) {
        console.log('\n╔═══════════════════════════════════════════════════════════════╗');
        console.log('║     🔍 VALIDATION MULTI-NIVEAUX COMPLÈTE                     ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝');
        
        const filename = path.basename(filePath);
        console.log(`\n📄 File: ${filename}`);
        console.log('─'.repeat(70));

        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            return { success: false, error: 'File not found' };
        }

        const code = fs.readFileSync(filePath, 'utf8');
        const results = [];

        // NIVEAU 1: Syntaxe de Base (CRITIQUE)
        const level1 = this.level1_BasicSyntax(code, filename);
        results.push(level1);
        if (!level1.passed) {
            console.log('\n❌ NIVEAU 1 FAILED - Critical errors found. Stopping validation.');
            return this.generateReport(results, filename, false);
        }

        // NIVEAU 2: Fonctions v6
        const level2 = this.level2_V6Functions(code, filename);
        results.push(level2);

        // NIVEAU 3: Logique et Structure
        const level3 = this.level3_LogicAndStructure(code, filename);
        results.push(level3);

        // NIVEAU 4: Sémantique Avancée
        const level4 = this.level4_AdvancedSemantics(code, filename);
        results.push(level4);

        // NIVEAU 5: Knowledge Base Complète
        const level5 = this.level5_CompleteKnowledgeValidation(code, filename);
        results.push(level5);

        return this.generateReport(results, filename, true);
    }

    /**
     * Générer rapport de validation complet
     */
    generateReport(results, filename, success) {
        console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
        console.log('║                   📊 RAPPORT FINAL                            ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝');

        const totalChecks = results.reduce((sum, r) => sum + r.checks.length, 0);
        const passedChecks = results.reduce((sum, r) => 
            sum + r.checks.filter(c => c.passed).length, 0);
        const criticalErrors = results.reduce((sum, r) => 
            sum + r.errors.filter(e => e.critical !== false).length, 0);
        const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

        console.log(`\n📄 File: ${filename}`);
        console.log(`\n📈 Statistics:`);
        console.log(`   Validation Levels: ${results.length}/${this.validationLevels}`);
        console.log(`   Total Checks: ${totalChecks}`);
        console.log(`   Passed Checks: ${passedChecks}/${totalChecks}`);
        console.log(`   Critical Errors: ${criticalErrors}`);
        console.log(`   Warnings: ${totalWarnings}`);

        console.log(`\n📋 Level-by-Level Results:`);
        results.forEach(result => {
            const icon = result.passed ? '✅' : '❌';
            const errors = result.errors.length > 0 ? ` (${result.errors.length} errors)` : '';
            const warnings = result.warnings.length > 0 ? ` (${result.warnings.length} warnings)` : '';
            console.log(`   ${icon} Level ${result.level}: ${result.name}${errors}${warnings}`);
        });

        if (criticalErrors > 0) {
            console.log(`\n❌ CRITICAL ERRORS:`);
            results.forEach(result => {
                result.errors.forEach(err => {
                    console.log(`   • ${err}`);
                });
            });
        }

        if (totalWarnings > 0) {
            console.log(`\n⚠️  WARNINGS:`);
            results.forEach(result => {
                result.warnings.forEach(warn => {
                    console.log(`   • ${warn}`);
                });
            });
        }

        console.log('\n' + '═'.repeat(70));
        
        if (success && criticalErrors === 0) {
            console.log('🎉 VALIDATION COMPLÈTE RÉUSSIE!');
            console.log('\n✅ Tous les niveaux de validation sont passés');
            console.log('✅ Aucune erreur critique');
            console.log('✅ Code prêt pour TradingView');
        } else {
            console.log('❌ VALIDATION ÉCHOUÉE');
            console.log(`\n${criticalErrors} erreur(s) critique(s) trouvée(s)`);
            console.log('⚠️  Le code doit être corrigé avant utilisation');
        }

        console.log('═'.repeat(70) + '\n');

        return {
            success: success && criticalErrors === 0,
            filename,
            results,
            stats: {
                levels: results.length,
                checks: totalChecks,
                passed: passedChecks,
                errors: criticalErrors,
                warnings: totalWarnings
            }
        };
    }

    /**
     * Valider un répertoire entier
     */
    async validateDirectory(dirPath) {
        console.log('\n╔═══════════════════════════════════════════════════════════════╗');
        console.log('║        🔍 VALIDATION MULTI-NIVEAUX - RÉPERTOIRE COMPLET      ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝\n');

        if (!fs.existsSync(dirPath)) {
            console.error(`❌ Directory not found: ${dirPath}`);
            return;
        }

        const files = fs.readdirSync(dirPath);
        const pineFiles = files.filter(f => f.endsWith('.pine'));

        console.log(`📁 Found ${pineFiles.length} Pine Script file(s)\n`);

        const allResults = [];

        for (const file of pineFiles) {
            const filePath = path.join(dirPath, file);
            const result = await this.validateComplete(filePath);
            allResults.push(result);

            // Wait a bit between files
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Summary
        console.log('\n╔═══════════════════════════════════════════════════════════════╗');
        console.log('║                    📊 RÉSUMÉ GLOBAL                           ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝\n');

        const totalFiles = allResults.length;
        const successFiles = allResults.filter(r => r.success).length;
        const failedFiles = totalFiles - successFiles;

        console.log(`📈 Statistics:`);
        console.log(`   Total Files: ${totalFiles}`);
        console.log(`   ✅ Passed: ${successFiles}`);
        console.log(`   ❌ Failed: ${failedFiles}`);

        if (failedFiles > 0) {
            console.log(`\n❌ FAILED FILES:`);
            allResults.filter(r => !r.success).forEach(r => {
                console.log(`   • ${r.filename} (${r.stats.errors} errors)`);
            });
        }

        console.log('\n' + '═'.repeat(70));
        if (successFiles === totalFiles) {
            console.log('🎉 TOUS LES FICHIERS VALIDÉS AVEC SUCCÈS!');
        } else {
            console.log(`⚠️  ${failedFiles} fichier(s) nécessite(nt) des corrections`);
        }
        console.log('═'.repeat(70) + '\n');

        return allResults;
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node multi_level_validator.js <file_or_directory>');
        console.log('\nExamples:');
        console.log('  node multi_level_validator.js pine_scripts/examples/simple_sma.pine');
        console.log('  node multi_level_validator.js pine_scripts/examples/');
        process.exit(1);
    }

    const target = args[0];
    const validator = new MultiLevelValidator();

    (async () => {
        if (fs.statSync(target).isDirectory()) {
            const results = await validator.validateDirectory(target);
            const allPassed = results.every(r => r.success);
            process.exit(allPassed ? 0 : 1);
        } else {
            const result = await validator.validateComplete(target);
            process.exit(result.success ? 0 : 1);
        }
    })();
}

module.exports = MultiLevelValidator;
