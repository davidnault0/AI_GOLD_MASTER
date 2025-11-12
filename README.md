
# AI_GOLD_MASTER

This repository includes the creation and integration of TradingView indicators in Pine Script v6. 
You will find various scripts demonstrating different functionalities, structure, and logic necessary for building effective trading indicators using Pine Script.

## Features
- **Custom Indicator Development**: Learn how to create custom indicators tailored to specific trading strategies.
- **Pine Script v6 Syntax**: Get familiar with the new features and updates in Pine Script v6.
- **Integration with TradingView**: Understand how to integrate your scripts with TradingView for real-time data and analysis.

## Getting Started
1. Clone the repository: `git clone https://github.com/davidnault0/AI_GOLD_MASTER.git`
2. Open the scripts in TradingView and start customizing your indicators!

## AI Model Integration

This repository now includes support for AI-powered enhancements using either **GPT-4o** or **Qwen 3** (Gwen 3).

### Choosing the Right Model

For detailed comparison and recommendations, see [AI_MODEL_COMPARISON.md](./AI_MODEL_COMPARISON.md).

**Quick Decision Guide:**
- 🚀 **GPT-4o**: Best for code quality, multimodal tasks, and ease of use
- 🔒 **Qwen 3**: Best for privacy, local deployment, and high-volume usage

### Configuration

See `ai-config.json` for model configuration and task routing settings.

### Usage

```javascript
const AIModelManager = require('./ai-integration');

// Initialize with default model (GPT-4o)
const ai = new AIModelManager();

// Generate Pine Script
await ai.generatePineScript('Create a moving average crossover indicator');

// Analyze logs
await ai.analyzeLogs(compilationLogs);

// Switch models
ai.switchModel('qwen-3');
```

For network efficiency recommendations, refer to the comparison document.

## Contribution
Feel free to contribute by submitting pull requests with your indicators or scripts!