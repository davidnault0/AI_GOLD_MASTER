const GoldAnalysisAI = require('./gold_analysis_ai');

/**
 * Exemple d'utilisation avancée de l'API GoldAnalysisAI
 * Montre comment intégrer le système dans votre propre application
 */

// Configuration personnalisée
const analyzer = new GoldAnalysisAI({
    symbol: 'XAUUSD',
    interval: '5m',
    updateFrequency: 30000,  // 30 secondes
    signalThreshold: 4.0     // Seuil plus élevé pour des signaux plus fiables
});

// Compteur de signaux
let signalCount = {
    buy: 0,
    sell: 0,
    total: 0
};

// Historique des signaux
const signalHistory = [];

// Écouter tous les signaux
analyzer.on('signal', (signal) => {
    signalHistory.push(signal);
    signalCount.total++;
    
    // Traiter selon le type de signal
    switch (signal.signal) {
        case 'ACHAT':
            signalCount.buy++;
            handleBuySignal(signal);
            break;
            
        case 'VENTE':
            signalCount.sell++;
            handleSellSignal(signal);
            break;
            
        case 'ATTENTE':
            // Pas d'action, mais on peut monitorer
            break;
    }
    
    // Afficher les statistiques toutes les 10 analyses
    if (signalCount.total % 10 === 0) {
        displayStatistics();
    }
});

// Gérer un signal d'achat
function handleBuySignal(signal) {
    console.log('\n🟢 ═══════════════════════════════════════════════════════');
    console.log('   SIGNAL D\'ACHAT DÉTECTÉ!');
    console.log('═══════════════════════════════════════════════════════');
    
    // Exemple: Calculer le prix d'entrée et les niveaux stop-loss/take-profit
    const entry = signal.price;
    const atr = signal.indicators.atr;
    const stopLoss = entry - (atr * 2);      // Stop-loss à 2 ATR
    const takeProfit1 = entry + (atr * 3);   // TP1 à 3 ATR (Risk:Reward 1:1.5)
    const takeProfit2 = entry + (atr * 4);   // TP2 à 4 ATR (Risk:Reward 1:2)
    
    console.log(`📍 Prix d'entrée: $${entry.toFixed(2)}`);
    console.log(`🛑 Stop-Loss: $${stopLoss.toFixed(2)} (${((entry - stopLoss) / entry * 100).toFixed(2)}%)`);
    console.log(`🎯 Take-Profit 1: $${takeProfit1.toFixed(2)} (${((takeProfit1 - entry) / entry * 100).toFixed(2)}%)`);
    console.log(`🎯 Take-Profit 2: $${takeProfit2.toFixed(2)} (${((takeProfit2 - entry) / entry * 100).toFixed(2)}%)`);
    console.log(`💪 Force du signal: ${signal.strength.toFixed(1)}/10`);
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Ici, vous pourriez:
    // - Envoyer une notification (email, SMS, Telegram)
    // - Enregistrer dans une base de données
    // - Passer un ordre automatique (avec prudence!)
    // - Logger dans un fichier
}

// Gérer un signal de vente
function handleSellSignal(signal) {
    console.log('\n🔴 ═══════════════════════════════════════════════════════');
    console.log('   SIGNAL DE VENTE DÉTECTÉ!');
    console.log('═══════════════════════════════════════════════════════');
    
    const entry = signal.price;
    const atr = signal.indicators.atr;
    const stopLoss = entry + (atr * 2);      // Stop-loss à 2 ATR
    const takeProfit1 = entry - (atr * 3);   // TP1 à 3 ATR
    const takeProfit2 = entry - (atr * 4);   // TP2 à 4 ATR
    
    console.log(`📍 Prix d'entrée: $${entry.toFixed(2)}`);
    console.log(`🛑 Stop-Loss: $${stopLoss.toFixed(2)} (${((stopLoss - entry) / entry * 100).toFixed(2)}%)`);
    console.log(`🎯 Take-Profit 1: $${takeProfit1.toFixed(2)} (${((entry - takeProfit1) / entry * 100).toFixed(2)}%)`);
    console.log(`🎯 Take-Profit 2: $${takeProfit2.toFixed(2)} (${((entry - takeProfit2) / entry * 100).toFixed(2)}%)`);
    console.log(`💪 Force du signal: ${signal.strength.toFixed(1)}/10`);
    console.log('═══════════════════════════════════════════════════════\n');
}

// Afficher les statistiques
function displayStatistics() {
    console.log('\n📊 ═══════════════ STATISTIQUES ═══════════════');
    console.log(`   Total d'analyses: ${signalCount.total}`);
    console.log(`   🟢 Signaux ACHAT: ${signalCount.buy}`);
    console.log(`   🔴 Signaux VENTE: ${signalCount.sell}`);
    console.log(`   ⚪ Signaux ATTENTE: ${signalCount.total - signalCount.buy - signalCount.sell}`);
    
    if (signalHistory.length > 0) {
        const lastSignal = signalHistory[signalHistory.length - 1];
        console.log(`   📈 Tendance actuelle: ${lastSignal.trend}`);
        console.log(`   💰 Prix actuel: $${lastSignal.price.toFixed(2)}`);
    }
    console.log('═══════════════════════════════════════════════════\n');
}

// Gérer les erreurs
analyzer.on('error', (error) => {
    console.error('\n❌ ERREUR:', error.message);
    console.error('   Le système va continuer à fonctionner...\n');
});

// Arrêt propre
process.on('SIGINT', () => {
    console.log('\n\n🛑 Arrêt de l\'application...');
    
    // Afficher les statistiques finales
    displayStatistics();
    
    // Afficher l'historique récent
    console.log('📜 Historique des 5 derniers signaux importants:');
    const importantSignals = signalHistory
        .filter(s => s.signal !== 'ATTENTE')
        .slice(-5);
    
    importantSignals.forEach((signal, index) => {
        const emoji = signal.signal === 'ACHAT' ? '🟢' : '🔴';
        const date = new Date(signal.timestamp).toLocaleString();
        console.log(`   ${emoji} ${signal.signal} - $${signal.price.toFixed(2)} - ${date}`);
    });
    
    analyzer.stop();
    console.log('\n✅ Application arrêtée proprement.\n');
    process.exit(0);
});

// Messages de démarrage
console.log('\n' + '═'.repeat(70));
console.log('🏆  AI GOLD MASTER - Mode API Avancé');
console.log('═'.repeat(70));
console.log('\n📖 Ce script montre comment:');
console.log('   • Écouter les signaux en temps réel');
console.log('   • Calculer automatiquement les niveaux de trading');
console.log('   • Gérer les statistiques et l\'historique');
console.log('   • Intégrer dans votre propre application');
console.log('\n💡 Utilisez ce code comme base pour votre système de trading!\n');

// Démarrer l'analyse
analyzer.start();

// Exemple: Obtenir les données à tout moment
setInterval(() => {
    const lastSignal = analyzer.getLastSignal();
    if (lastSignal) {
        // Vous pouvez accéder au dernier signal
        // const priceData = analyzer.getPriceData();
        // const indicators = analyzer.getIndicators();
    }
}, 60000); // Chaque minute
