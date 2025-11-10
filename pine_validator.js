const fs = require('fs');
const path = require('path');

/**
 * Pine Script v6 Validator
 * Validates Pine Script syntax and structure without external dependencies
 */

class PineScriptValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Validate a Pine Script file
     * @param {string} filePath - Path to the Pine Script file
     * @returns {Object} - Validation results
     */
    validateFile(filePath) {
        this.errors = [];
        this.warnings = [];

        if (!fs.existsSync(filePath)) {
            this.errors.push(`File not found: ${filePath}`);
            return this.getResults();
        }

        const content = fs.readFileSync(filePath, 'utf8');
        return this.validateContent(content, filePath);
    }

    /**
     * Validate Pine Script content
     * @param {string} content - Pine Script code content
     * @param {string} filePath - Optional file path for error messages
     * @returns {Object} - Validation results
     */
    validateContent(content, filePath = 'inline') {
        this.errors = [];
        this.warnings = [];

        const lines = content.split('\n');

        // Check version declaration
        this.checkVersion(lines);

        // Check indicator/strategy declaration
        this.checkDeclaration(lines);

        // Check for common syntax issues
        this.checkSyntax(lines);

        // Check for Pine Script v6 specific features
        this.checkV6Features(content);

        return this.getResults();
    }

    checkVersion(lines) {
        const versionLine = lines.find(line => line.trim().startsWith('//@version'));
        
        if (!versionLine) {
            this.errors.push('Missing version declaration. Add //@version=6 at the top of the file.');
            return;
        }

        const versionMatch = versionLine.match(/\/\/@version\s*=\s*(\d+)/);
        if (!versionMatch) {
            this.errors.push('Invalid version declaration format.');
            return;
        }

        const version = parseInt(versionMatch[1]);
        if (version !== 6) {
            this.warnings.push(`Version ${version} detected. This validator is optimized for Pine Script v6.`);
        }
    }

    checkDeclaration(lines) {
        const hasIndicator = lines.some(line => 
            line.trim().startsWith('indicator(') || line.trim().startsWith('indicator (')
        );
        const hasStrategy = lines.some(line => 
            line.trim().startsWith('strategy(') || line.trim().startsWith('strategy (')
        );

        if (!hasIndicator && !hasStrategy) {
            this.errors.push('Missing indicator() or strategy() declaration.');
        }

        if (hasIndicator && hasStrategy) {
            this.errors.push('Script cannot have both indicator() and strategy() declarations.');
        }
    }

    checkSyntax(lines) {
        let openBrackets = 0;
        let openParens = 0;
        let openBraces = 0;

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            
            // Skip comments
            if (trimmed.startsWith('//')) return;

            // Check for unmatched brackets, parentheses, and braces
            for (const char of line) {
                if (char === '(') openParens++;
                if (char === ')') openParens--;
                if (char === '[') openBrackets++;
                if (char === ']') openBrackets--;
                if (char === '{') openBraces++;
                if (char === '}') openBraces--;
            }

            // Check for common Pine Script v6 deprecated syntax
            if (trimmed.includes('study(')) {
                this.warnings.push(`Line ${index + 1}: 'study()' is deprecated in v6. Use 'indicator()' instead.`);
            }

            if (trimmed.match(/\bsecurity\(/)) {
                this.warnings.push(`Line ${index + 1}: 'security()' is deprecated in v6. Use 'request.security()' instead.`);
            }
        });

        if (openParens !== 0) {
            this.errors.push(`Unmatched parentheses: ${openParens > 0 ? 'missing closing' : 'extra closing'} parenthesis.`);
        }

        if (openBrackets !== 0) {
            this.errors.push(`Unmatched brackets: ${openBrackets > 0 ? 'missing closing' : 'extra closing'} bracket.`);
        }

        if (openBraces !== 0) {
            this.errors.push(`Unmatched braces: ${openBraces > 0 ? 'missing closing' : 'extra closing'} brace.`);
        }
    }

    checkV6Features(content) {
        // Check for Pine Script v6 features usage
        const v6Functions = [
            'input.int', 'input.float', 'input.string', 'input.bool', 
            'input.source', 'input.timeframe', 'input.color',
            'ta.sma', 'ta.ema', 'ta.rsi', 'ta.macd', 'ta.stdev',
            'ta.crossover', 'ta.crossunder',
            'color.new', 'color.rgb',
            'plot.style_line', 'plot.style_histogram', 'plot.style_columns',
            'hline.style_solid', 'hline.style_dashed', 'hline.style_dotted',
            'strategy.entry', 'strategy.close', 'strategy.exit',
            'request.security'
        ];

        let v6FeaturesFound = 0;
        v6Functions.forEach(func => {
            if (content.includes(func)) {
                v6FeaturesFound++;
            }
        });

        if (v6FeaturesFound > 0) {
            this.warnings.push(`Found ${v6FeaturesFound} Pine Script v6 specific features.`);
        }
    }

    getResults() {
        return {
            valid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
            errorCount: this.errors.length,
            warningCount: this.warnings.length
        };
    }

    /**
     * Format validation results as a string
     * @param {Object} results - Validation results
     * @returns {string} - Formatted results
     */
    static formatResults(results) {
        let output = '\n';
        
        if (results.valid) {
            output += '✅ Validation PASSED\n';
        } else {
            output += '❌ Validation FAILED\n';
        }

        output += `\nErrors: ${results.errorCount}\n`;
        output += `Warnings: ${results.warningCount}\n`;

        if (results.errors.length > 0) {
            output += '\n❌ ERRORS:\n';
            results.errors.forEach(error => {
                output += `  - ${error}\n`;
            });
        }

        if (results.warnings.length > 0) {
            output += '\n⚠️  WARNINGS:\n';
            results.warnings.forEach(warning => {
                output += `  - ${warning}\n`;
            });
        }

        return output;
    }
}

/**
 * Validate all Pine Script files in a directory
 * @param {string} dirPath - Directory path
 * @returns {Array} - Array of validation results
 */
function validateDirectory(dirPath) {
    const results = [];
    const validator = new PineScriptValidator();

    if (!fs.existsSync(dirPath)) {
        console.error(`Directory not found: ${dirPath}`);
        return results;
    }

    const files = fs.readdirSync(dirPath);
    const pineFiles = files.filter(file => file.endsWith('.pine'));

    pineFiles.forEach(file => {
        const filePath = path.join(dirPath, file);
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Validating: ${file}`);
        console.log('='.repeat(60));

        const result = validator.validateFile(filePath);
        result.file = file;
        result.path = filePath;
        results.push(result);

        console.log(PineScriptValidator.formatResults(result));
    });

    return results;
}

// Export for use as module
module.exports = {
    PineScriptValidator,
    validateDirectory
};

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node pine_validator.js <file_or_directory>');
        console.log('\nExamples:');
        console.log('  node pine_validator.js pine_scripts/examples/simple_sma.pine');
        console.log('  node pine_validator.js pine_scripts/examples/');
        process.exit(1);
    }

    const target = args[0];
    const validator = new PineScriptValidator();

    if (fs.statSync(target).isDirectory()) {
        const results = validateDirectory(target);
        const totalFiles = results.length;
        const validFiles = results.filter(r => r.valid).length;
        
        console.log('\n' + '='.repeat(60));
        console.log('SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total files: ${totalFiles}`);
        console.log(`Valid: ${validFiles}`);
        console.log(`Invalid: ${totalFiles - validFiles}`);
        
        process.exit(validFiles === totalFiles ? 0 : 1);
    } else {
        const result = validator.validateFile(target);
        console.log(PineScriptValidator.formatResults(result));
        process.exit(result.valid ? 0 : 1);
    }
}
