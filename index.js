const GoldAnalysisAI = require('./gold_analysis_ai');

/**
 * Point d'entrée principal pour l'IA d'analyse de l'or
 * Ce script démarre l'analyse en temps réel et affiche les signaux
 */

console.log('\n' + '█'.repeat(70));
console.log('█' + ' '.repeat(68) + '█');
console.log('█' + '          🏆 AI GOLD MASTER - Analyse Or en Temps Réel 🏆          '.padEnd(68) + '█');
console.log('█' + ' '.repeat(68) + '█');
console.log('█'.repeat(70));
console.log('\n');

// Configuration de l'analyseur
const config = {
    symbol: 'XAUUSD',               // Symbole de l'or
    interval: '5m',                  // Intervalle des bougies
    updateFrequency: 30000,          // Mise à jour toutes les 30 secondes
    rsiPeriod: 14,                   // Période RSI
    rsiOverbought: 70,               // Seuil RSI suracheté
    rsiOversold: 30,                 // Seuil RSI survendu
    emaFast: 9,                      // EMA rapide
    emaSlow: 21,                     // EMA lente
    emaTrend: 50,                    // EMA tendance
    signalThreshold: 3.0             // Seuil minimum pour générer un signal
};

// Créer l'instance de l'analyseur
const analyzer = new GoldAnalysisAI(config);

// Écouter les signaux générés
analyzer.on('signal', (signal) => {
    // Le signal est déjà affiché par la méthode displaySignal()
    // On peut ajouter ici d'autres actions comme:
    // - Envoyer une notification
    // - Enregistrer dans une base de données
    // - Envoyer un email/SMS
    // - Déclencher un trade automatique (avec précaution!)
    
    if (signal.signal === 'ACHAT' || signal.signal === 'VENTE') {
        console.log(`\n🔔 ALERTE: Nouveau signal ${signal.signal} détecté!`);
        // Ici, vous pouvez ajouter votre logique de notification
    }
});

// Écouter les erreurs
analyzer.on('error', (error) => {
    console.error('❌ Erreur détectée:', error.message);
});

// Gérer l'arrêt propre
process.on('SIGINT', () => {
    console.log('\n\n🛑 Arrêt de l\'application...');
    analyzer.stop();
    console.log('✅ Application arrêtée proprement.\n');
    process.exit(0);
});

// Afficher les instructions
console.log('📖 Instructions:');
console.log('   • L\'analyse se met à jour automatiquement');
console.log('   • Les signaux ACHAT/VENTE s\'affichent lorsque les conditions sont remplies');
console.log('   • Appuyez sur Ctrl+C pour arrêter l\'application');
console.log('\n');

// Démarrer l'analyse
analyzer.start();
