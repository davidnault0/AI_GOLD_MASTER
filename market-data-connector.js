/**
 * Connecteur de Données de Marché en Temps Réel
 * Support pour plusieurs fournisseurs: Binance, Coinbase, Alpha Vantage, etc.
 */

const https = require('https');
const http = require('http');

class MarketDataConnector {
    constructor(config = {}) {
        this.provider = config.provider || 'binance';
        this.apiKey = config.apiKey || process.env.MARKET_API_KEY;
        this.symbol = config.symbol || 'BTCUSDT';
        this.cache = {};
        this.websocket = null;
        
        console.log(`📡 Connecteur de marché initialisé: ${this.provider}`);
    }

    /**
     * Obtenir les données de marché en temps réel
     */
    async fetchRealTimeData() {
        switch (this.provider) {
            case 'binance':
                return await this.fetchBinanceData();
            case 'coinbase':
                return await this.fetchCoinbaseData();
            case 'alphavantage':
                return await this.fetchAlphaVantageData();
            case 'polygon':
                return await this.fetchPolygonData();
            case 'twelvedata':
                return await this.fetchTwelveDataData();
            default:
                throw new Error(`Provider non supporté: ${this.provider}`);
        }
    }

    /**
     * Obtenir les données de Binance (Crypto)
     */
    async fetchBinanceData() {
        const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${this.symbol}`;
        
        try {
            const data = await this.makeHttpRequest(url);
            
            // Vérifier si les données sont valides
            if (!data || !data.lastPrice) {
                throw new Error('Données Binance invalides');
            }
            
            const marketData = {
                symbol: data.symbol || this.symbol,
                price: parseFloat(data.lastPrice),
                timestamp: Date.now(),
                volume: parseFloat(data.volume || 0),
                bid: parseFloat(data.bidPrice || data.lastPrice),
                ask: parseFloat(data.askPrice || data.lastPrice),
                high24h: parseFloat(data.highPrice || data.lastPrice),
                low24h: parseFloat(data.lowPrice || data.lastPrice),
                change24h: parseFloat(data.priceChangePercent || 0),
                trades24h: parseInt(data.count || 0)
            };
            
            // Mettre en cache
            this.cache.lastData = marketData;
            
            return marketData;
        } catch (error) {
            console.error('❌ Erreur Binance:', error.message);
            return this.getFallbackData();
        }
    }

    /**
     * Obtenir les données de Coinbase (Crypto)
     */
    async fetchCoinbaseData() {
        const productId = this.symbol.replace('USDT', '-USD');
        const url = `https://api.coinbase.com/v2/prices/${productId}/spot`;
        
        try {
            const data = await this.makeHttpRequest(url);
            
            return {
                symbol: productId,
                price: parseFloat(data.data.amount),
                timestamp: Date.now(),
                volume: 0, // Nécessite un appel supplémentaire
                bid: parseFloat(data.data.amount) * 0.999,
                ask: parseFloat(data.data.amount) * 1.001,
                high24h: 0,
                low24h: 0,
                change24h: 0
            };
        } catch (error) {
            console.error('❌ Erreur Coinbase:', error.message);
            return this.getFallbackData();
        }
    }

    /**
     * Obtenir les données d'Alpha Vantage (Actions, Forex)
     */
    async fetchAlphaVantageData() {
        if (!this.apiKey) {
            console.warn('⚠️  Clé API Alpha Vantage manquante');
            return this.getFallbackData();
        }

        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.symbol}&apikey=${this.apiKey}`;
        
        try {
            const data = await this.makeHttpRequest(url);
            const quote = data['Global Quote'];
            
            return {
                symbol: quote['01. symbol'],
                price: parseFloat(quote['05. price']),
                timestamp: Date.now(),
                volume: parseFloat(quote['06. volume']),
                bid: parseFloat(quote['05. price']) * 0.999,
                ask: parseFloat(quote['05. price']) * 1.001,
                high24h: parseFloat(quote['03. high']),
                low24h: parseFloat(quote['04. low']),
                change24h: parseFloat(quote['10. change percent'].replace('%', ''))
            };
        } catch (error) {
            console.error('❌ Erreur Alpha Vantage:', error.message);
            return this.getFallbackData();
        }
    }

    /**
     * Obtenir les données de Polygon.io (Actions, Crypto)
     */
    async fetchPolygonData() {
        if (!this.apiKey) {
            console.warn('⚠️  Clé API Polygon manquante');
            return this.getFallbackData();
        }

        const url = `https://api.polygon.io/v2/last/trade/${this.symbol}?apiKey=${this.apiKey}`;
        
        try {
            const data = await this.makeHttpRequest(url);
            
            return {
                symbol: this.symbol,
                price: data.results.p,
                timestamp: data.results.t,
                volume: data.results.s,
                bid: data.results.p * 0.999,
                ask: data.results.p * 1.001,
                high24h: 0,
                low24h: 0,
                change24h: 0
            };
        } catch (error) {
            console.error('❌ Erreur Polygon:', error.message);
            return this.getFallbackData();
        }
    }

    /**
     * Obtenir les données de Twelve Data (Or, Actions, Crypto, Forex)
     */
    async fetchTwelveDataData() {
        if (!this.apiKey) {
            console.warn('⚠️  Clé API Twelve Data manquante');
            return this.getFallbackData();
        }

        // Twelve Data utilise un format différent pour les symboles
        // XAUUSD pour l'or, BTC/USD pour Bitcoin, AAPL pour Apple, etc.
        const url = `https://api.twelvedata.com/price?symbol=${this.symbol}&apikey=${this.apiKey}`;
        
        try {
            const data = await this.makeHttpRequest(url);
            
            // Vérifier si l'API retourne une erreur
            if (data.status === 'error' || data.code) {
                console.error('❌ Erreur API Twelve Data:', data.message || data.code);
                console.log('💡 Vérifiez: 1) Votre clé API, 2) Le symbole (XAUUSD pour l\'or), 3) Les limites du plan gratuit (800 req/jour)');
                throw new Error(data.message || 'Erreur API Twelve Data');
            }
            
            if (!data || !data.price) {
                console.error('❌ Réponse Twelve Data invalide:', JSON.stringify(data).substring(0, 200));
                throw new Error('Données Twelve Data invalides - pas de prix');
            }
            
            const price = parseFloat(data.price);
            
            // Récupérer également les statistiques de la journée
            const quoteUrl = `https://api.twelvedata.com/quote?symbol=${this.symbol}&apikey=${this.apiKey}`;
            let quoteData = null;
            
            try {
                quoteData = await this.makeHttpRequest(quoteUrl);
                if (quoteData.status === 'error' || quoteData.code) {
                    console.warn('⚠️  Impossible de récupérer les stats complètes:', quoteData.message || quoteData.code);
                    quoteData = null;
                }
            } catch (err) {
                console.warn('⚠️  Impossible de récupérer les stats complètes');
            }
            
            const marketData = {
                symbol: this.symbol,
                price: price,
                timestamp: Date.now(),
                volume: quoteData ? parseFloat(quoteData.volume || 0) : 0,
                bid: price * 0.9999,
                ask: price * 1.0001,
                high24h: quoteData ? parseFloat(quoteData.high || price * 1.01) : price * 1.01,
                low24h: quoteData ? parseFloat(quoteData.low || price * 0.99) : price * 0.99,
                change24h: quoteData ? parseFloat(quoteData.percent_change || 0) : 0,
                open: quoteData ? parseFloat(quoteData.open || price) : price
            };
            
            // Mettre en cache
            this.cache.lastData = marketData;
            
            console.log(`✅ Prix ${this.symbol}: $${price.toFixed(2)}`);
            
            return marketData;
        } catch (error) {
            console.error('❌ Erreur Twelve Data:', error.message);
            return this.getFallbackData();
        }
    }

    /**
     * Faire une requête HTTP
     */
    makeHttpRequest(url) {
        return new Promise((resolve, reject) => {
            const isHttps = url.startsWith('https');
            const lib = isHttps ? https : http;
            
            lib.get(url, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error('Erreur de parsing JSON'));
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    /**
     * Données de secours en cas d'erreur
     */
    getFallbackData() {
        console.log('⚠️  Utilisation des données de secours');
        
        // Utiliser les dernières données en cache si disponibles
        if (this.cache.lastData && Date.now() - this.cache.lastData.timestamp < 300000) { // 5 minutes
            console.log('📦 Cache valide trouvé, utilisation des dernières données connues');
            return this.cache.lastData;
        }
        
        // Sinon, générer des données simulées basées sur le symbole
        let basePrice = 50000; // Par défaut pour crypto
        
        // Adapter le prix de base selon le symbole
        if (this.symbol.includes('XAU') || this.symbol.toLowerCase().includes('gold')) {
            basePrice = 2650; // Prix approximatif de l'or en USD/once
        } else if (this.symbol.includes('XAG') || this.symbol.toLowerCase().includes('silver')) {
            basePrice = 31; // Prix approximatif de l'argent
        } else if (this.symbol.includes('BTC')) {
            basePrice = 95000; // Prix approximatif Bitcoin
        } else if (this.symbol.includes('ETH')) {
            basePrice = 3500; // Prix approximatif Ethereum
        }
        
        const price = basePrice + (Math.random() - 0.5) * (basePrice * 0.002); // Variation de 0.2%
        
        return {
            symbol: this.symbol,
            price: price,
            timestamp: Date.now(),
            volume: 1000 + Math.random() * 500,
            bid: price * 0.9999,
            ask: price * 1.0001,
            high24h: price * 1.01,
            low24h: price * 0.99,
            change24h: (Math.random() - 0.5) * 2,
            isFallback: true
        };
    }

    /**
     * Connecter via WebSocket pour les mises à jour en temps réel
     * (Optionnel mais recommandé pour de meilleures performances)
     */
    connectWebSocket() {
        console.log('🔌 WebSocket non implémenté dans cette version');
        console.log('💡 Utilisation du polling HTTP pour les données en temps réel');
        // À implémenter avec ws ou socket.io pour de meilleures performances
    }

    /**
     * Obtenir les données historiques
     */
    async fetchHistoricalData(interval = '1h', limit = 100) {
        if (this.provider === 'binance') {
            const url = `https://api.binance.com/api/v3/klines?symbol=${this.symbol}&interval=${interval}&limit=${limit}`;
            
            try {
                const data = await this.makeHttpRequest(url);
                
                return data.map(candle => ({
                    timestamp: candle[0],
                    open: parseFloat(candle[1]),
                    high: parseFloat(candle[2]),
                    low: parseFloat(candle[3]),
                    close: parseFloat(candle[4]),
                    volume: parseFloat(candle[5])
                }));
            } catch (error) {
                console.error('❌ Erreur historique Binance:', error.message);
                return [];
            }
        }
        
        return [];
    }
}

module.exports = MarketDataConnector;
