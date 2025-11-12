# 🚀 Démarrage Rapide - AI Gold Master

## ⚡ En 3 Minutes

### 1️⃣ Installation (1 minute)

```bash
# Cloner le repository
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
cd AI_GOLD_MASTER

# Installer les dépendances
npm install
```

### 2️⃣ Lancement (30 secondes)

```bash
# Démarrer l'analyse en temps réel
npm start
```

Vous verrez immédiatement :
```
██████████████████████████████████████████████████████████████████████
█          🏆 AI GOLD MASTER - Analyse Or en Temps Réel 🏆           █
██████████████████████████████████████████████████████████████████████

🚀 Démarrage de l'analyse en temps réel pour XAUUSD
📊 Intervalle: 5m
⏰ Mise à jour toutes les 30s
```

### 3️⃣ Observer les Signaux (1 minute 30)

L'analyse affiche automatiquement :
- 🟢 **Signaux ACHAT** quand les conditions sont favorables
- 🔴 **Signaux VENTE** quand il faut vendre
- ⚪ **ATTENTE** quand le marché n'est pas clair

**Arrêter** : Appuyez sur `Ctrl+C`

---

## 📊 Ajouter à TradingView (5 minutes)

### Étape 1 : Copier le Script

1. Ouvrez `gold_analysis_ai.pine`
2. Copiez tout le contenu (`Ctrl+A`, `Ctrl+C`)

### Étape 2 : Ajouter à TradingView

1. Allez sur [TradingView.com](https://tradingview.com)
2. Ouvrez un graphique XAUUSD
3. Cliquez sur "Pine Editor" en bas
4. Collez le code (`Ctrl+V`)
5. Cliquez "Add to Chart"

**C'est fait !** 🎉

Vous verrez maintenant :
- Les moyennes mobiles colorées
- Les bandes de Bollinger
- Une table d'info en haut à droite
- Des labels ACHAT/VENTE automatiques

---

## 🔔 Configurer une Alerte (2 minutes)

Sur TradingView :

1. Cliquez sur l'icône 🔔 (Alerte)
2. Condition : "AI Gold Master" → "Signal ACHAT Fort"
3. Cochez "Email" ou "Notification"
4. Cliquez "Create"

Maintenant vous recevrez une alerte à chaque signal !

---

## 🎯 Commandes Utiles

```bash
# Démarrer l'analyse
npm start

# Exemple avancé avec calculs de trading
node example_advanced.js

# Voir la version
node -e "console.log(require('./package.json').version)"
```

---

## 📚 Aller Plus Loin

### Pour Comprendre le Système
- 📖 [README.md](README.md) - Vue d'ensemble
- 🇫🇷 [README_FR.md](README_FR.md) - Documentation française
- 🎬 [DEMO.md](DEMO.md) - Voir des exemples

### Pour Personnaliser
- 🔧 [API_GUIDE.md](API_GUIDE.md) - Intégrer dans votre code
- 📊 [TRADINGVIEW_GUIDE.md](TRADINGVIEW_GUIDE.md) - Guide TradingView

### Pour Modifier les Paramètres

Éditez `index.js` :

```javascript
const config = {
    interval: '5m',          // Changez en '15m', '1h', etc.
    updateFrequency: 30000,  // Plus ou moins fréquent (en ms)
    signalThreshold: 3.0     // Plus élevé = moins de signaux
};
```

---

## 💡 Conseils Rapides

### ✅ À FAIRE
- Observer d'abord sans trader
- Utiliser un compte démo
- Toujours mettre un stop-loss
- Suivre la tendance principale

### ❌ À ÉVITER
- Trader tous les signaux aveuglément
- Ignorer la gestion du risque
- Over-trader (trop de positions)
- Trader avec de l'argent qu'on ne peut perdre

---

## 🆘 Besoin d'Aide ?

### Problèmes Courants

**❓ "Cannot find module 'axios'"**
```bash
npm install axios
```

**❓ "Port déjà utilisé"**
- Le script n'utilise pas de port, vérifiez qu'aucune autre app n'interfère

**❓ "Pas de signaux"**
- Normal ! Les conditions ne sont pas toujours remplies
- Baissez `signalThreshold` à 2.5 pour plus de signaux

**❓ Script Pine ne compile pas**
- Vérifiez que vous avez copié TOUT le contenu
- Assurez-vous d'être sur TradingView (pas TV Pro)

### Support

- 📧 Ouvrir une [issue sur GitHub](https://github.com/davidnault0/AI_GOLD_MASTER/issues)
- 📖 Lire la [documentation complète](README.md)

---

## 🎉 Félicitations !

Vous êtes maintenant prêt à utiliser **AI Gold Master** !

```
🏆 Système opérationnel
📊 Analyse en temps réel
🔔 Alertes configurées
💰 Prêt à trader (prudemment!)
```

**Bon trading !** 📈✨

---

## 📖 Prochaines Étapes

1. ✅ Démarrage rapide (vous êtes ici)
2. 📚 Lire [DEMO.md](DEMO.md) pour voir des exemples
3. 🔧 Explorer [API_GUIDE.md](API_GUIDE.md) pour personnaliser
4. 🚀 Intégrer avec Telegram/Discord/Email
5. 💻 Créer votre propre système de trading

**Rappel Important** : Ce système est éducatif. Toujours faire ses propres recherches et utiliser une bonne gestion du risque. Ne jamais investir plus que ce qu'on peut se permettre de perdre.
