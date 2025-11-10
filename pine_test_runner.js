const { PineScriptValidator, validateDirectory } = require('./pine_validator');
const fs = require('fs');
const path = require('path');

/**
 * Pine Script Test Runner
 * Runs validation tests on all Pine Script files
 */

class PineTestRunner {
    constructor() {
        this.testResults = [];
    }

    /**
     * Run all tests in the pine_scripts directory
     */
    runAllTests() {
        console.log('🧪 Pine Script v6 Test Runner\n');
        console.log('='.repeat(70));
        
        const examplesDir = path.join(__dirname, 'pine_scripts', 'examples');
        const testsDir = path.join(__dirname, 'pine_scripts', 'tests');

        // Test examples directory
        if (fs.existsSync(examplesDir)) {
            console.log('\n📁 Testing Examples Directory');
            console.log('='.repeat(70));
            const exampleResults = validateDirectory(examplesDir);
            this.testResults.push(...exampleResults);
        }

        // Test tests directory
        if (fs.existsSync(testsDir)) {
            console.log('\n📁 Testing Tests Directory');
            console.log('='.repeat(70));
            const testResults = validateDirectory(testsDir);
            this.testResults.push(...testResults);
        }

        this.printSummary();
        return this.testResults;
    }

    /**
     * Print test summary
     */
    printSummary() {
        console.log('\n' + '='.repeat(70));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(70));

        const totalTests = this.testResults.length;
        const passed = this.testResults.filter(r => r.valid).length;
        const failed = totalTests - passed;
        const totalErrors = this.testResults.reduce((sum, r) => sum + r.errorCount, 0);
        const totalWarnings = this.testResults.reduce((sum, r) => sum + r.warningCount, 0);

        console.log(`\nTotal Files Tested: ${totalTests}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`\nTotal Errors: ${totalErrors}`);
        console.log(`Total Warnings: ${totalWarnings}`);

        if (failed > 0) {
            console.log('\n❌ FAILED FILES:');
            this.testResults
                .filter(r => !r.valid)
                .forEach(r => {
                    console.log(`  - ${r.file}`);
                    r.errors.forEach(err => console.log(`    ⮑ ${err}`));
                });
        }

        console.log('\n' + '='.repeat(70));

        if (passed === totalTests && totalTests > 0) {
            console.log('🎉 All tests passed!');
        } else if (totalTests === 0) {
            console.log('⚠️  No test files found.');
        } else {
            console.log('⚠️  Some tests failed. Please review the errors above.');
        }
        console.log('='.repeat(70) + '\n');
    }

    /**
     * Get overall test status
     * @returns {boolean} - True if all tests passed
     */
    allTestsPassed() {
        return this.testResults.length > 0 && 
               this.testResults.every(r => r.valid);
    }
}

// Run tests if executed directly
if (require.main === module) {
    const runner = new PineTestRunner();
    const results = runner.runAllTests();
    
    // Exit with appropriate code
    process.exit(runner.allTestsPassed() ? 0 : 1);
}

module.exports = PineTestRunner;
