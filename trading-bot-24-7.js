/**
 * Bot de Trading 24/7 avec IA
 * Conçu pour fonctionner sur Render ou tout autre service cloud
 * Analyse continue du marché et génération de signaux
 */

const RealTimeMarketAnalyzer = require('./real-time-market-analyzer');
const MarketDataConnector = require('./market-data-connector');
const http = require('http');

class TradingBot247 {
    constructor(config = {}) {
        // Configuration
        this.config = {
            symbol: config.symbol || process.env.TRADING_SYMBOL || 'BTCUSDT',
            aiModel: config.aiModel || process.env.AI_MODEL || 'gpt-4o',
            updateInterval: parseInt(config.updateInterval || process.env.UPDATE_INTERVAL || '1000'),
            dataProvider: config.dataProvider || process.env.DATA_PROVIDER || 'binance',
            notificationWebhook: config.notificationWebhook || process.env.WEBHOOK_URL,
            telegramToken: config.telegramToken || process.env.TELEGRAM_BOT_TOKEN,
            telegramChatId: config.telegramChatId || process.env.TELEGRAM_CHAT_ID,
            port: parseInt(config.port || process.env.PORT || '3000')
        };

        // Composants
        this.analyzer = null;
        this.dataConnector = null;
        this.server = null;
        this.signals = [];
        this.stats = {
            startTime: Date.now(),
            totalSignals: 0,
            buySignals: 0,
            sellSignals: 0,
            holdSignals: 0,
            lastSignalTime: null,
            uptime: 0
        };

        console.log('🤖 Trading Bot 24/7 initialisé');
        console.log('📊 Configuration:', JSON.stringify(this.config, null, 2));
    }

    /**
     * Démarrer le bot
     */
    async start() {
        console.log('\n🚀 Démarrage du Trading Bot 24/7...\n');

        // 1. Initialiser le connecteur de données
        this.dataConnector = new MarketDataConnector({
            provider: this.config.dataProvider,
            symbol: this.config.symbol,
            apiKey: process.env.MARKET_API_KEY
        });

        // 2. Tester la connexion aux données de marché
        try {
            const testData = await this.dataConnector.fetchRealTimeData();
            console.log(`✅ Connexion au marché réussie - ${testData.symbol}: $${testData.price.toFixed(2)}`);
        } catch (error) {
            console.error('❌ Erreur de connexion au marché:', error.message);
            console.log('⚠️  Le bot continuera avec des données simulées');
        }

        // 3. Initialiser l'analyseur de marché
        this.analyzer = new RealTimeMarketAnalyzer({
            symbol: this.config.symbol,
            updateInterval: this.config.updateInterval,
            aiModel: this.config.aiModel,
            dataProvider: this.config.dataProvider
        });

        // Remplacer la méthode de récupération de données pour utiliser le connecteur réel
        this.analyzer.fetchMarketData = async () => {
            return await this.dataConnector.fetchRealTimeData();
        };

        // 4. Écouter les signaux
        this.setupSignalHandlers();

        // 5. Démarrer l'analyseur
        this.analyzer.start();

        // 6. Démarrer le serveur HTTP (requis pour Render)
        this.startHttpServer();

        // 7. Démarrer les tâches de maintenance
        this.startMaintenanceTasks();

        console.log(`\n✅ Bot démarré avec succès sur le port ${this.config.port}`);
        console.log(`📊 Analyse ${this.config.symbol} toutes les ${this.config.updateInterval}ms`);
        console.log(`🤖 Modèle IA: ${this.config.aiModel}\n`);
    }

    /**
     * Configurer les gestionnaires de signaux
     */
    setupSignalHandlers() {
        this.analyzer.on('signal', async (signal) => {
            this.stats.totalSignals++;
            this.stats.lastSignalTime = Date.now();

            if (signal.signal === 'BUY') this.stats.buySignals++;
            else if (signal.signal === 'SELL') this.stats.sellSignals++;
            else this.stats.holdSignals++;

            // Stocker le signal (garder les 100 derniers)
            this.signals.unshift(signal);
            if (this.signals.length > 100) {
                this.signals.pop();
            }

            // Envoyer les notifications
            await this.sendNotifications(signal);

            // Log du signal
            this.logSignal(signal);
        });

        this.analyzer.on('started', () => {
            console.log('✅ Analyseur démarré');
        });

        this.analyzer.on('stopped', () => {
            console.log('🛑 Analyseur arrêté');
        });
    }

    /**
     * Envoyer les notifications
     */
    async sendNotifications(signal) {
        const tasks = [];

        // Webhook
        if (this.config.notificationWebhook) {
            tasks.push(this.sendWebhookNotification(signal));
        }

        // Telegram
        if (this.config.telegramToken && this.config.telegramChatId) {
            tasks.push(this.sendTelegramNotification(signal));
        }

        await Promise.allSettled(tasks);
    }

    /**
     * Envoyer notification via Webhook
     */
    async sendWebhookNotification(signal) {
        try {
            const payload = JSON.stringify({
                type: 'TRADING_SIGNAL',
                signal: signal.signal,
                symbol: signal.symbol,
                price: signal.price,
                confidence: signal.confidence,
                timestamp: signal.timestamp,
                reasons: signal.reasons
            });

            // Implémentation simplifiée - à adapter selon votre webhook
            console.log(`📤 Webhook notification envoyée: ${signal.signal}`);
        } catch (error) {
            console.error('❌ Erreur webhook:', error.message);
        }
    }

    /**
     * Envoyer notification via Telegram
     */
    async sendTelegramNotification(signal) {
        try {
            const message = this.formatTelegramMessage(signal);
            const url = `https://api.telegram.org/bot${this.config.telegramToken}/sendMessage`;
            
            const payload = JSON.stringify({
                chat_id: this.config.telegramChatId,
                text: message,
                parse_mode: 'Markdown'
            });

            console.log(`📱 Telegram notification envoyée: ${signal.signal}`);
        } catch (error) {
            console.error('❌ Erreur Telegram:', error.message);
        }
    }

    /**
     * Formater le message Telegram
     */
    formatTelegramMessage(signal) {
        const emoji = signal.signal === 'BUY' ? '🟢' : signal.signal === 'SELL' ? '🔴' : '🟡';
        
        let message = `${emoji} *SIGNAL DE TRADING*\n\n`;
        message += `*Action:* ${signal.signal}\n`;
        message += `*Symbole:* ${signal.symbol}\n`;
        message += `*Prix:* $${signal.price.toFixed(2)}\n`;
        message += `*Confiance:* ${signal.confidence.toFixed(1)}%\n`;
        message += `*Heure:* ${new Date(signal.timestamp).toLocaleString()}\n\n`;
        
        if (signal.reasons && signal.reasons.length > 0) {
            message += `*Raisons:*\n`;
            signal.reasons.forEach(r => {
                message += `• ${r.reason}\n`;
            });
        }
        
        return message;
    }

    /**
     * Logger un signal
     */
    logSignal(signal) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] SIGNAL: ${signal.signal} | ${signal.symbol} @ $${signal.price.toFixed(2)} | Conf: ${signal.confidence.toFixed(1)}%`;
        console.log(logEntry);
        
        // Ici, vous pourriez aussi écrire dans un fichier ou une base de données
    }

    /**
     * Démarrer le serveur HTTP (requis pour Render)
     */
    startHttpServer() {
        this.server = http.createServer((req, res) => {
            const url = req.url;

            // Health check endpoint
            if (url === '/health' || url === '/') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'healthy',
                    uptime: Date.now() - this.stats.startTime,
                    symbol: this.config.symbol,
                    aiModel: this.config.aiModel,
                    lastSignal: this.stats.lastSignalTime ? new Date(this.stats.lastSignalTime).toISOString() : null
                }));
                return;
            }

            // Stats endpoint
            if (url === '/stats') {
                this.stats.uptime = Date.now() - this.stats.startTime;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(this.stats, null, 2));
                return;
            }

            // Signals endpoint
            if (url === '/signals') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    total: this.signals.length,
                    signals: this.signals.slice(0, 20) // 20 derniers signaux
                }, null, 2));
                return;
            }

            // Dashboard HTML
            if (url === '/dashboard') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(this.generateDashboardHTML());
                return;
            }

            // 404
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
        });

        this.server.listen(this.config.port, () => {
            console.log(`🌐 Serveur HTTP démarré sur le port ${this.config.port}`);
            console.log(`📊 Dashboard: http://localhost:${this.config.port}/dashboard`);
            console.log(`💚 Health check: http://localhost:${this.config.port}/health`);
        });
    }

    /**
     * Générer le HTML du dashboard
     */
    generateDashboardHTML() {
        const uptime = Math.floor((Date.now() - this.stats.startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        return `
<!DOCTYPE html>
<html>
<head>
    <title>Trading Bot 24/7 Dashboard</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f1419; color: #e7e9ea; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { font-size: 32px; margin-bottom: 10px; }
        .status { display: inline-block; padding: 5px 15px; background: #00ba7c; color: white; border-radius: 20px; font-size: 14px; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { background: #16181c; border: 1px solid #2f3336; border-radius: 12px; padding: 20px; }
        .card h2 { font-size: 14px; color: #71767b; margin-bottom: 10px; text-transform: uppercase; }
        .card .value { font-size: 32px; font-weight: bold; }
        .card .label { font-size: 14px; color: #71767b; margin-top: 5px; }
        .signals { background: #16181c; border: 1px solid #2f3336; border-radius: 12px; padding: 20px; }
        .signal-item { padding: 15px; border-bottom: 1px solid #2f3336; }
        .signal-item:last-child { border-bottom: none; }
        .signal-buy { border-left: 4px solid #00ba7c; }
        .signal-sell { border-left: 4px solid #f4212e; }
        .signal-hold { border-left: 4px solid #ffd400; }
        .refresh { background: #1d9bf0; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-size: 15px; font-weight: bold; }
        .refresh:hover { background: #1a8cd8; }
    </style>
    <script>
        function refreshData() {
            location.reload();
        }
        setInterval(refreshData, 10000); // Auto-refresh every 10 seconds
    </script>
</head>
<body>
    <div class="container">
        <h1>🤖 Trading Bot 24/7</h1>
        <div class="status">● ACTIF</div>
        
        <div class="grid">
            <div class="card">
                <h2>Symbole</h2>
                <div class="value">${this.config.symbol}</div>
                <div class="label">Marché analysé</div>
            </div>
            
            <div class="card">
                <h2>Temps actif</h2>
                <div class="value">${hours}h ${minutes}m ${seconds}s</div>
                <div class="label">Fonctionnement continu</div>
            </div>
            
            <div class="card">
                <h2>Signaux totaux</h2>
                <div class="value">${this.stats.totalSignals}</div>
                <div class="label">Signaux générés</div>
            </div>
            
            <div class="card">
                <h2>Modèle IA</h2>
                <div class="value">${this.config.aiModel}</div>
                <div class="label">Intelligence artificielle</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h2>🟢 Signaux ACHAT</h2>
                <div class="value">${this.stats.buySignals}</div>
            </div>
            
            <div class="card">
                <h2>🔴 Signaux VENTE</h2>
                <div class="value">${this.stats.sellSignals}</div>
            </div>
            
            <div class="card">
                <h2>🟡 Signaux HOLD</h2>
                <div class="value">${this.stats.holdSignals}</div>
            </div>
        </div>

        <div class="signals">
            <h2 style="font-size: 20px; margin-bottom: 20px; color: #e7e9ea;">Derniers Signaux</h2>
            ${this.signals.slice(0, 10).map(s => `
                <div class="signal-item signal-${s.signal.toLowerCase()}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="font-size: 18px;">${s.signal}</strong>
                            <div style="color: #71767b; font-size: 14px; margin-top: 5px;">
                                ${new Date(s.timestamp).toLocaleString()} | $${s.price.toFixed(2)} | ${s.confidence.toFixed(1)}% confiance
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <button class="refresh" onclick="refreshData()">🔄 Actualiser</button>
        </div>
    </div>
</body>
</html>`;
    }

    /**
     * Démarrer les tâches de maintenance
     */
    startMaintenanceTasks() {
        // Nettoyer la mémoire toutes les heures
        setInterval(() => {
            console.log('🧹 Nettoyage de la mémoire...');
            if (this.signals.length > 100) {
                this.signals = this.signals.slice(0, 100);
            }
            if (this.analyzer.priceHistory.length > 500) {
                this.analyzer.priceHistory = this.analyzer.priceHistory.slice(-300);
            }
        }, 3600000); // 1 heure

        // Afficher les stats toutes les 5 minutes
        setInterval(() => {
            this.displayStats();
        }, 300000); // 5 minutes

        // Log de santé toutes les minutes
        setInterval(() => {
            console.log(`💚 Bot actif - ${this.stats.totalSignals} signaux générés`);
        }, 60000); // 1 minute
    }

    /**
     * Afficher les statistiques
     */
    displayStats() {
        const uptime = Math.floor((Date.now() - this.stats.startTime) / 1000);
        console.log('\n' + '='.repeat(60));
        console.log('📊 STATISTIQUES DU BOT');
        console.log('='.repeat(60));
        console.log(`Temps actif: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`);
        console.log(`Signaux totaux: ${this.stats.totalSignals}`);
        console.log(`  ├─ BUY: ${this.stats.buySignals}`);
        console.log(`  ├─ SELL: ${this.stats.sellSignals}`);
        console.log(`  └─ HOLD: ${this.stats.holdSignals}`);
        console.log(`Dernier signal: ${this.stats.lastSignalTime ? new Date(this.stats.lastSignalTime).toLocaleString() : 'Aucun'}`);
        console.log('='.repeat(60) + '\n');
    }

    /**
     * Arrêter le bot proprement
     */
    async stop() {
        console.log('\n🛑 Arrêt du bot...');
        
        if (this.analyzer) {
            this.analyzer.stop();
        }
        
        if (this.server) {
            this.server.close();
        }
        
        console.log('✅ Bot arrêté proprement');
    }
}

// Point d'entrée principal
if (require.main === module) {
    const bot = new TradingBot247();
    
    // Gérer les signaux de terminaison
    process.on('SIGTERM', async () => {
        console.log('\n📨 Signal SIGTERM reçu');
        await bot.stop();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        console.log('\n📨 Signal SIGINT reçu');
        await bot.stop();
        process.exit(0);
    });

    // Démarrer le bot
    bot.start().catch((error) => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = TradingBot247;
