const fs = require('fs');
const path = require('path');

/**
 * Pine Script v6 Knowledge Base
 * Référence complète pour validation et correction automatique
 */

class PineScriptKnowledge {
    constructor() {
        this.loadKnowledge();
    }

    /**
     * Charge la base de connaissance Pine Script v6
     */
    loadKnowledge() {
        this.knowledge = {
            // Fonctions dépréciées et leurs remplacements
            deprecatedFunctions: {
                'study': {
                    replacement: 'indicator',
                    example: 'indicator("Mon Indicateur", overlay=true)',
                    description: 'study() est déprécié en v6, utilisez indicator()'
                },
                'security': {
                    replacement: 'request.security',
                    example: 'request.security(syminfo.tickerid, "D", close)',
                    description: 'security() est déprécié en v6, utilisez request.security()'
                }
            },

            // Fonctions input v6
            inputFunctions: {
                patterns: ['input.int', 'input.float', 'input.bool', 'input.string', 'input.source', 'input.color', 'input.timeframe'],
                oldPattern: /\binput\s*\(/,
                newPattern: /\binput\.(int|float|bool|string|source|color|timeframe)\s*\(/
            },

            // Fonctions techniques (ta.*)
            technicalFunctions: [
                'ta.sma', 'ta.ema', 'ta.wma', 'ta.vwma', 'ta.alma',
                'ta.rsi', 'ta.macd', 'ta.stoch', 'ta.cci', 'ta.mfi',
                'ta.atr', 'ta.bb', 'ta.stdev',
                'ta.vwap',
                'ta.crossover', 'ta.crossunder', 'ta.cross',
                'ta.highest', 'ta.lowest', 'ta.highestbars', 'ta.lowestbars',
                'ta.change', 'ta.mom', 'ta.roc',
                'ta.cum'
            ],

            // Variables intégrées
            builtInVariables: [
                'open', 'high', 'low', 'close', 'volume',
                'hl2', 'hlc3', 'ohlc4', 'hlcc4',
                'time', 'time_close', 'bar_index',
                'barstate.isfirst', 'barstate.islast', 'barstate.isrealtime', 'barstate.isnew', 'barstate.isconfirmed',
                'syminfo.ticker', 'syminfo.currency', 'syminfo.basecurrency', 'syminfo.type', 'syminfo.timezone',
                'timeframe.period', 'timeframe.isdaily', 'timeframe.isweekly', 'timeframe.ismonthly', 'timeframe.isintraday'
            ],

            // Fonctions de plot
            plotFunctions: {
                'plot': {
                    signature: 'plot(series, title, color, linewidth, style, ...)',
                    styles: ['plot.style_line', 'plot.style_stepline', 'plot.style_histogram', 'plot.style_cross', 
                             'plot.style_area', 'plot.style_columns', 'plot.style_circles', 'plot.style_linebr']
                },
                'plotshape': {
                    signature: 'plotshape(series, title, style, location, color, size, ...)',
                    shapes: ['shape.triangleup', 'shape.triangledown', 'shape.circle', 'shape.cross', 'shape.xcross',
                             'shape.diamond', 'shape.square', 'shape.flag', 'shape.arrowup', 'shape.arrowdown']
                },
                'hline': {
                    signature: 'hline(price, title, color, linestyle, ...)',
                    styles: ['hline.style_solid', 'hline.style_dashed', 'hline.style_dotted']
                }
            },

            // Couleurs
            colors: [
                'color.red', 'color.green', 'color.blue', 'color.yellow', 'color.orange', 'color.purple',
                'color.white', 'color.black', 'color.gray', 'color.silver', 'color.maroon', 'color.lime',
                'color.navy', 'color.teal', 'color.aqua', 'color.fuchsia'
            ],
            colorFunctions: ['color.new', 'color.rgb'],

            // Fonctions strategy
            strategyFunctions: {
                'strategy.entry': 'strategy.entry(id, direction, qty, ...)',
                'strategy.close': 'strategy.close(id, when, ...)',
                'strategy.exit': 'strategy.exit(id, from_entry, profit, loss, ...)',
                'strategy.long': 'Direction longue (achat)',
                'strategy.short': 'Direction courte (vente)'
            },

            // Opérateurs
            operators: {
                arithmetic: ['+', '-', '*', '/', '%'],
                comparison: ['==', '!=', '>', '<', '>=', '<='],
                logical: ['and', 'or', 'not']
            },

            // Structures de contrôle
            controlStructures: ['if', 'else', 'for', 'while'],

            // Règles de syntaxe
            syntaxRules: {
                versionDeclaration: '//@version=6',
                scriptTypes: ['indicator', 'strategy'],
                noMixingTypes: 'Ne pas mélanger indicator() et strategy()',
                closeParentheses: 'Toujours fermer les parenthèses',
                closeBrackets: 'Toujours fermer les crochets',
                closeBraces: 'Toujours fermer les accolades'
            },

            // Erreurs courantes et solutions
            commonErrors: {
                'undeclared identifier': {
                    description: 'Variable non déclarée',
                    solution: 'Déclarer la variable avant utilisation',
                    example: 'myVar = 0'
                },
                'mismatched input': {
                    description: 'Syntaxe incorrecte',
                    solution: 'Vérifier parenthèses et virgules',
                    example: 'plot(ta.sma(close, 14))'
                },
                'study is deprecated': {
                    description: 'Fonction study() dépréciée',
                    solution: 'Utiliser indicator() à la place',
                    example: 'indicator("Mon Indicateur", overlay=true)'
                },
                'security is deprecated': {
                    description: 'Fonction security() dépréciée',
                    solution: 'Utiliser request.security() à la place',
                    example: 'request.security(syminfo.tickerid, "D", close)'
                }
            }
        };
    }

    /**
     * Obtenir la fonction de remplacement pour une fonction dépréciée
     */
    getReplacementFunction(deprecatedName) {
        return this.knowledge.deprecatedFunctions[deprecatedName];
    }

    /**
     * Vérifier si une fonction est une fonction technique valide
     */
    isValidTechnicalFunction(funcName) {
        return this.knowledge.technicalFunctions.includes(funcName);
    }

    /**
     * Vérifier si une variable est une variable intégrée
     */
    isBuiltInVariable(varName) {
        return this.knowledge.builtInVariables.includes(varName);
    }

    /**
     * Obtenir des suggestions pour corriger une erreur
     */
    getSuggestionForError(errorMessage) {
        const errorLower = errorMessage.toLowerCase();
        
        for (const [errorType, info] of Object.entries(this.knowledge.commonErrors)) {
            if (errorLower.includes(errorType.toLowerCase())) {
                return info;
            }
        }
        
        return null;
    }

    /**
     * Valider que le code utilise la syntaxe v6
     */
    validateV6Syntax(code) {
        const issues = [];

        // Vérifier version
        if (!code.includes('//@version=6')) {
            issues.push({
                type: 'version',
                message: 'Version declaration missing or incorrect. Use: //@version=6',
                fix: 'Add //@version=6 at the top of the file'
            });
        }

        // Vérifier fonctions dépréciées
        for (const [oldFunc, info] of Object.entries(this.knowledge.deprecatedFunctions)) {
            const pattern = new RegExp(`\\b${oldFunc}\\s*\\(`, 'g');
            if (pattern.test(code)) {
                issues.push({
                    type: 'deprecated',
                    function: oldFunc,
                    message: info.description,
                    fix: `Replace ${oldFunc}() with ${info.replacement}()`,
                    example: info.example
                });
            }
        }

        // Vérifier ancienne syntaxe input()
        if (this.knowledge.inputFunctions.oldPattern.test(code) && 
            !this.knowledge.inputFunctions.newPattern.test(code)) {
            issues.push({
                type: 'deprecated_input',
                message: 'Old input() syntax detected',
                fix: 'Use input.int(), input.float(), input.bool(), etc. instead of input()',
                example: 'length = input.int(14, "Length", minval=1)'
            });
        }

        return issues;
    }

    /**
     * Obtenir un template de base pour un indicateur
     */
    getIndicatorTemplate(name = "My Indicator") {
        return `//@version=6
indicator("${name}", overlay=true)

// === INPUTS ===
lengthInput = input.int(14, "Length", minval=1)
sourceInput = input.source(close, "Source")

// === CALCULATIONS ===
value = ta.sma(sourceInput, lengthInput)

// === PLOTS ===
plot(value, "Value", color=color.blue, linewidth=2)
`;
    }

    /**
     * Obtenir un template de base pour une stratégie
     */
    getStrategyTemplate(name = "My Strategy") {
        return `//@version=6
strategy("${name}", overlay=true)

// === INPUTS ===
fastLength = input.int(9, "Fast Length", minval=1)
slowLength = input.int(21, "Slow Length", minval=1)

// === CALCULATIONS ===
fastMA = ta.ema(close, fastLength)
slowMA = ta.ema(close, slowLength)

// === LOGIC ===
longCondition = ta.crossover(fastMA, slowMA)
shortCondition = ta.crossunder(fastMA, slowMA)

// === TRADES ===
if longCondition
    strategy.entry("Long", strategy.long)

if shortCondition
    strategy.close("Long")

// === PLOTS ===
plot(fastMA, "Fast MA", color=color.blue)
plot(slowMA, "Slow MA", color=color.red)
`;
    }

    /**
     * Obtenir des informations sur une fonction
     */
    getFunctionInfo(funcName) {
        // Vérifier si c'est une fonction technique
        if (this.isValidTechnicalFunction(funcName)) {
            return {
                type: 'technical',
                name: funcName,
                description: `Pine Script v6 technical analysis function`,
                category: 'ta'
            };
        }

        // Vérifier si c'est une fonction de plot
        for (const [name, info] of Object.entries(this.knowledge.plotFunctions)) {
            if (funcName === name) {
                return {
                    type: 'plot',
                    name: name,
                    ...info
                };
            }
        }

        // Vérifier si c'est une fonction strategy
        if (this.knowledge.strategyFunctions[funcName]) {
            return {
                type: 'strategy',
                name: funcName,
                signature: this.knowledge.strategyFunctions[funcName]
            };
        }

        return null;
    }

    /**
     * Générer un rapport de connaissances
     */
    generateKnowledgeReport() {
        const report = {
            version: 'Pine Script v6',
            totalFunctions: this.knowledge.technicalFunctions.length,
            builtInVariables: this.knowledge.builtInVariables.length,
            deprecatedFunctions: Object.keys(this.knowledge.deprecatedFunctions).length,
            commonErrors: Object.keys(this.knowledge.commonErrors).length
        };

        return report;
    }
}

module.exports = PineScriptKnowledge;

// Test si exécuté directement
if (require.main === module) {
    const kb = new PineScriptKnowledge();
    
    console.log('📚 Pine Script v6 Knowledge Base Loaded');
    console.log('');
    
    const report = kb.generateKnowledgeReport();
    console.log('📊 Knowledge Report:');
    console.log(`   Version: ${report.version}`);
    console.log(`   Technical Functions: ${report.totalFunctions}`);
    console.log(`   Built-in Variables: ${report.builtInVariables}`);
    console.log(`   Deprecated Functions: ${report.deprecatedFunctions}`);
    console.log(`   Common Errors: ${report.commonErrors}`);
    console.log('');
    
    // Exemple de validation
    const exampleCode = `
study("Old Style")
value = security(syminfo.tickerid, "D", close)
plot(value)
`;
    
    console.log('🔍 Validating example code...');
    const issues = kb.validateV6Syntax(exampleCode);
    
    if (issues.length > 0) {
        console.log('⚠️  Issues found:');
        issues.forEach((issue, i) => {
            console.log(`\n   ${i + 1}. ${issue.message}`);
            console.log(`      Fix: ${issue.fix}`);
            if (issue.example) {
                console.log(`      Example: ${issue.example}`);
            }
        });
    } else {
        console.log('✅ No issues found!');
    }
}
