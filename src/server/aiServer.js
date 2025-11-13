/**
 * AI Interaction Server
 * Express server for AI interactions and real-time communication
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

class AIServer {
    constructor(config = {}) {
        this.config = {
            port: config.port || process.env.PORT || 3000,
            host: config.host || '0.0.0.0'
        };
        
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.analyzer = null;
        this.telegramBot = null;
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
    }

    /**
     * Set up Express middleware
     */
    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        // CORS
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

    /**
     * Set up API routes
     */
    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });

        // Get server status
        this.app.get('/api/status', (req, res) => {
            res.json({
                server: 'AI Gold Master',
                version: '1.0.0',
                analyzer: this.analyzer ? this.analyzer.getStatus() : null,
                telegram: {
                    enabled: this.telegramBot?.config.enabled || false
                }
            });
        });

        // Get latest market data
        this.app.get('/api/market/latest', (req, res) => {
            if (!this.analyzer) {
                return res.status(503).json({ error: 'Market analyzer not initialized' });
            }
            
            res.json({
                latest: this.analyzer.getLatestData(),
                status: this.analyzer.getStatus()
            });
        });

        // Trigger manual analysis
        this.app.post('/api/analyze', async (req, res) => {
            if (!this.analyzer) {
                return res.status(503).json({ error: 'Market analyzer not initialized' });
            }
            
            try {
                const analysis = await this.analyzer.analyzeMarket();
                res.json({ success: true, analysis });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Start/stop analyzer
        this.app.post('/api/analyzer/:action', (req, res) => {
            if (!this.analyzer) {
                return res.status(503).json({ error: 'Market analyzer not initialized' });
            }
            
            const { action } = req.params;
            
            if (action === 'start') {
                this.analyzer.start();
                res.json({ success: true, message: 'Analyzer started' });
            } else if (action === 'stop') {
                this.analyzer.stop();
                res.json({ success: true, message: 'Analyzer stopped' });
            } else {
                res.status(400).json({ error: 'Invalid action' });
            }
        });

        // Send test signal
        this.app.post('/api/telegram/test', async (req, res) => {
            if (!this.telegramBot) {
                return res.status(503).json({ error: 'Telegram bot not initialized' });
            }
            
            try {
                const result = await this.telegramBot.testConnection();
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Get signal history
        this.app.get('/api/signals/history', (req, res) => {
            if (!this.telegramBot) {
                return res.status(503).json({ error: 'Telegram bot not initialized' });
            }
            
            const limit = parseInt(req.query.limit) || 10;
            res.json({
                signals: this.telegramBot.getSignalHistory(limit)
            });
        });

        // Handle Telegram commands
        this.app.post('/api/telegram/command', async (req, res) => {
            if (!this.telegramBot) {
                return res.status(503).json({ error: 'Telegram bot not initialized' });
            }
            
            const { command, args } = req.body;
            
            try {
                const response = await this.telegramBot.handleCommand(command, args);
                res.json({ success: true, response });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Serve simple web interface
        this.app.get('/', (req, res) => {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>AI Gold Master</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            max-width: 1200px;
                            margin: 0 auto;
                            padding: 20px;
                            background: #1a1a1a;
                            color: #fff;
                        }
                        h1 { color: #ffd700; }
                        .status-card {
                            background: #2a2a2a;
                            padding: 20px;
                            margin: 10px 0;
                            border-radius: 8px;
                            border-left: 4px solid #ffd700;
                        }
                        button {
                            background: #ffd700;
                            color: #000;
                            border: none;
                            padding: 10px 20px;
                            margin: 5px;
                            cursor: pointer;
                            border-radius: 4px;
                            font-weight: bold;
                        }
                        button:hover { background: #ffed4e; }
                        .signal { margin: 10px 0; padding: 10px; background: #333; border-radius: 4px; }
                        .long { border-left: 4px solid #00ff00; }
                        .short { border-left: 4px solid #ff0000; }
                        #log {
                            background: #000;
                            padding: 15px;
                            border-radius: 4px;
                            max-height: 400px;
                            overflow-y: auto;
                            font-family: monospace;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <h1>🤖 AI Gold Master Trading System</h1>
                    
                    <div class="status-card">
                        <h2>System Status</h2>
                        <div id="status">Loading...</div>
                        <button onclick="checkStatus()">Refresh Status</button>
                    </div>
                    
                    <div class="status-card">
                        <h2>Controls</h2>
                        <button onclick="startAnalyzer()">▶️ Start Analyzer</button>
                        <button onclick="stopAnalyzer()">⏸️ Stop Analyzer</button>
                        <button onclick="triggerAnalysis()">🔍 Analyze Now</button>
                        <button onclick="testTelegram()">📱 Test Telegram</button>
                    </div>
                    
                    <div class="status-card">
                        <h2>Recent Signals</h2>
                        <div id="signals">No signals yet</div>
                    </div>
                    
                    <div class="status-card">
                        <h2>Real-time Log</h2>
                        <div id="log"></div>
                    </div>
                    
                    <script src="/socket.io/socket.io.js"></script>
                    <script>
                        const socket = io();
                        
                        socket.on('analysis', (data) => {
                            addLog('📊 New analysis: ' + data.direction + ' (' + data.confidence + ')');
                            loadSignals();
                        });
                        
                        socket.on('signal', (data) => {
                            addLog('🚨 SIGNAL: ' + data.direction + ' @ $' + data.entry);
                        });
                        
                        socket.on('status', (data) => {
                            addLog('ℹ️ Status update: ' + data.message);
                        });
                        
                        function addLog(message) {
                            const log = document.getElementById('log');
                            const time = new Date().toLocaleTimeString();
                            log.innerHTML = '<div>[' + time + '] ' + message + '</div>' + log.innerHTML;
                        }
                        
                        async function checkStatus() {
                            const res = await fetch('/api/status');
                            const data = await res.json();
                            document.getElementById('status').innerHTML = 
                                '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                        }
                        
                        async function startAnalyzer() {
                            const res = await fetch('/api/analyzer/start', { method: 'POST' });
                            const data = await res.json();
                            addLog(data.message);
                            checkStatus();
                        }
                        
                        async function stopAnalyzer() {
                            const res = await fetch('/api/analyzer/stop', { method: 'POST' });
                            const data = await res.json();
                            addLog(data.message);
                            checkStatus();
                        }
                        
                        async function triggerAnalysis() {
                            addLog('Triggering manual analysis...');
                            const res = await fetch('/api/analyze', { method: 'POST' });
                            const data = await res.json();
                            addLog('Analysis complete');
                        }
                        
                        async function testTelegram() {
                            addLog('Testing Telegram connection...');
                            const res = await fetch('/api/telegram/test', { method: 'POST' });
                            const data = await res.json();
                            addLog('Telegram test: ' + data.message);
                        }
                        
                        async function loadSignals() {
                            const res = await fetch('/api/signals/history?limit=5');
                            const data = await res.json();
                            const signalsDiv = document.getElementById('signals');
                            
                            if (data.signals.length === 0) {
                                signalsDiv.innerHTML = 'No signals yet';
                                return;
                            }
                            
                            signalsDiv.innerHTML = data.signals.map(s => 
                                '<div class="signal ' + s.direction.toLowerCase() + '">' +
                                '<strong>' + s.direction + '</strong> @ $' + s.price +
                                '<br><small>' + s.timestamp + '</small>' +
                                '</div>'
                            ).join('');
                        }
                        
                        // Initial load
                        checkStatus();
                        loadSignals();
                        setInterval(checkStatus, 10000); // Update every 10 seconds
                    </script>
                </body>
                </html>
            `);
        });
    }

    /**
     * Set up WebSocket communication
     */
    setupWebSocket() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
            
            socket.on('get_status', () => {
                socket.emit('status', this.analyzer ? this.analyzer.getStatus() : null);
            });
        });
    }

    /**
     * Set analyzer instance
     */
    setAnalyzer(analyzer) {
        this.analyzer = analyzer;
        
        // Forward analyzer events to WebSocket
        analyzer.on('analysis', (data) => {
            this.io.emit('analysis', data);
        });
        
        analyzer.on('signal', (data) => {
            this.io.emit('signal', data);
        });
        
        analyzer.on('started', () => {
            this.io.emit('status', { message: 'Analyzer started' });
        });
        
        analyzer.on('stopped', () => {
            this.io.emit('status', { message: 'Analyzer stopped' });
        });
    }

    /**
     * Set Telegram bot instance
     */
    setTelegramBot(bot) {
        this.telegramBot = bot;
    }

    /**
     * Start the server
     */
    start() {
        return new Promise((resolve) => {
            this.server.listen(this.config.port, this.config.host, () => {
                console.log(`🚀 AI Server running on http://${this.config.host}:${this.config.port}`);
                resolve();
            });
        });
    }

    /**
     * Stop the server
     */
    stop() {
        return new Promise((resolve) => {
            this.server.close(() => {
                console.log('Server stopped');
                resolve();
            });
        });
    }
}

module.exports = AIServer;
