/**
 * AI Model Integration Module
 * Supports both GPT-4o and Qwen 3 for improved network efficiency
 */

const fs = require('fs');
const path = require('path');

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'ai-config.json'), 'utf8'));

class AIModelManager {
    constructor(modelName = null) {
        this.currentModel = modelName || config.aiModels.default;
        this.modelConfig = config.aiModels.available[this.currentModel];
        
        if (!this.modelConfig) {
            throw new Error(`Model ${this.currentModel} not found in configuration`);
        }
        
        console.log(`Initialized with model: ${this.currentModel}`);
    }

    /**
     * Route task to the optimal AI model based on task type
     */
    routeTask(taskType) {
        const rule = config.taskRouting.rules.find(r => r.taskType === taskType);
        
        if (rule) {
            console.log(`Routing ${taskType} to ${rule.preferredModel}: ${rule.reason}`);
            return rule.preferredModel;
        }
        
        return this.currentModel;
    }

    /**
     * Generate Pine Script code using AI
     */
    async generatePineScript(prompt) {
        const optimalModel = this.routeTask('pine-script-generation');
        
        console.log(`Generating Pine Script using ${optimalModel}...`);
        
        if (optimalModel === 'gpt-4o') {
            return this.callGPT4o(prompt);
        } else if (optimalModel === 'qwen-3') {
            return this.callQwen3(prompt);
        }
    }

    /**
     * Analyze logs using AI
     */
    async analyzeLogs(logData) {
        const optimalModel = this.routeTask('log-analysis');
        
        console.log(`Analyzing logs using ${optimalModel}...`);
        
        if (optimalModel === 'gpt-4o') {
            return this.callGPT4o(`Analyze these logs: ${logData}`);
        } else if (optimalModel === 'qwen-3') {
            return this.callQwen3(`Analyze these logs: ${logData}`);
        }
    }

    /**
     * Call GPT-4o API
     */
    async callGPT4o(prompt) {
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY environment variable not set');
        }

        const endpoint = this.modelConfig.apiEndpoint;
        const model = this.modelConfig.model;
        
        try {
            // Simulated API call structure
            // In production, use fetch or axios
            console.log(`POST ${endpoint}/chat/completions`);
            console.log(`Model: ${model}`);
            console.log(`Prompt: ${prompt.substring(0, 100)}...`);
            
            // Example response structure
            return {
                model: 'gpt-4o',
                response: 'Generated Pine Script code...',
                tokensUsed: 150,
                latency: 1200
            };
        } catch (error) {
            console.error('GPT-4o API call failed:', error.message);
            throw error;
        }
    }

    /**
     * Call Qwen 3 local endpoint
     */
    async callQwen3(prompt) {
        const endpoint = config.networkConfiguration['qwen-3'].localEndpoint;
        
        try {
            // Simulated local API call structure
            console.log(`POST ${endpoint}/v1/chat/completions`);
            console.log(`Prompt: ${prompt.substring(0, 100)}...`);
            
            // Example response structure
            return {
                model: 'qwen-3',
                response: 'Generated response...',
                tokensUsed: 150,
                latency: 200
            };
        } catch (error) {
            console.error('Qwen 3 API call failed:', error.message);
            console.log('Tip: Make sure Qwen 3 is running locally on port 8000');
            throw error;
        }
    }

    /**
     * Compare performance between models
     */
    async compareModels(prompt) {
        console.log('\n=== Model Comparison ===\n');
        
        const results = {};
        
        // Test GPT-4o
        try {
            const startGPT = Date.now();
            results.gpt4o = await this.callGPT4o(prompt);
            results.gpt4o.totalTime = Date.now() - startGPT;
        } catch (error) {
            results.gpt4o = { error: error.message };
        }
        
        // Test Qwen 3
        try {
            const startQwen = Date.now();
            results.qwen3 = await this.callQwen3(prompt);
            results.qwen3.totalTime = Date.now() - startQwen;
        } catch (error) {
            results.qwen3 = { error: error.message };
        }
        
        console.log('Results:', JSON.stringify(results, null, 2));
        return results;
    }

    /**
     * Get model information
     */
    getModelInfo() {
        return {
            currentModel: this.currentModel,
            config: this.modelConfig,
            networkConfig: config.networkConfiguration[this.currentModel]
        };
    }

    /**
     * Switch to a different model
     */
    switchModel(modelName) {
        if (!config.aiModels.available[modelName]) {
            throw new Error(`Model ${modelName} not available`);
        }
        
        this.currentModel = modelName;
        this.modelConfig = config.aiModels.available[modelName];
        
        console.log(`Switched to model: ${modelName}`);
    }
}

// Example usage
if (require.main === module) {
    const manager = new AIModelManager();
    
    console.log('\nCurrent Model Info:');
    console.log(JSON.stringify(manager.getModelInfo(), null, 2));
    
    console.log('\n=== Task Routing Examples ===');
    console.log(`Pine Script generation → ${manager.routeTask('pine-script-generation')}`);
    console.log(`Log analysis → ${manager.routeTask('log-analysis')}`);
    console.log(`Documentation → ${manager.routeTask('documentation')}`);
    console.log(`Batch processing → ${manager.routeTask('batch-processing')}`);
    
    console.log('\n=== Recommendations ===');
    console.log(JSON.stringify(config.recommendations, null, 2));
}

module.exports = AIModelManager;
