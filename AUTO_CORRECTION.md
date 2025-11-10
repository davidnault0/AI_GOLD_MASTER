# 🤖 Auto-Correction de Code Pine Script v6

## Vue d'ensemble

Le système d'**auto-correction** teste automatiquement vos scripts Pine sur TradingView, détecte les erreurs de compilation, tente de les corriger automatiquement, et réessaie jusqu'à ce que la compilation réussisse.

## 🎯 Fonctionnalités

### Boucle Automatique de Correction
1. **Test sur TradingView** - Compile le script sur la plateforme réelle
2. **Détection d'erreurs** - Capture les erreurs de compilation
3. **Analyse intelligente** - Identifie le type d'erreur
4. **Correction automatique** - Applique les correctifs appropriés
5. **Re-test** - Vérifie que la correction fonctionne
6. **Boucle** - Répète jusqu'à 3 fois si nécessaire

### Types d'Erreurs Corrigées Automatiquement

#### 1. Syntaxe Dépréciée
```pine
// AVANT (erreur)
study("Mon Indicateur", overlay=true)

// APRÈS (corrigé automatiquement)
indicator("Mon Indicateur", overlay=true)
```

#### 2. Fonctions Dépréciées
```pine
// AVANT (erreur)
value = security(syminfo.tickerid, "D", close)

// APRÈS (corrigé automatiquement)
value = request.security(syminfo.tickerid, "D", close)
```

#### 3. Parenthèses Manquantes
```pine
// AVANT (erreur)
plot(ta.sma(close, 14)

// APRÈS (corrigé automatiquement)
plot(ta.sma(close, 14))
```

#### 4. Autres Corrections
- Identifiants non déclarés
- Erreurs de syntaxe courantes
- Problèmes de types
- Nombre d'arguments incorrect

## 🚀 Utilisation

### Commande Simple
```bash
npm run test:auto-correct
```

Cette commande va:
1. ✅ Charger vos credentials TradingView
2. ✅ Tester chaque script dans `pine_scripts/examples/`
3. ✅ Détecter les erreurs
4. ✅ Tenter de les corriger automatiquement
5. ✅ Sauvegarder les versions corrigées
6. ✅ Fournir un rapport détaillé

### Workflow Complet

```bash
# 1. Test local d'abord (rapide)
npm test

# 2. Si des erreurs, lancer l'auto-correction
npm run test:auto-correct

# 3. Les versions corrigées sont dans *_corrected.pine
```

## 📊 Exemple de Sortie

```
╔════════════════════════════════════════════════════════════════╗
║     🤖 AUTO-CORRECTING TRADINGVIEW TEST RUNNER               ║
╚════════════════════════════════════════════════════════════════╝

This runner will:
  1. Test each script on TradingView
  2. Detect compilation errors
  3. Attempt to fix errors automatically
  4. Retry up to 3 times per script
  5. Save corrected versions

✅ Credentials loaded
📧 Email: joh***@example.com

📁 Found 8 Pine Script(s) to test

═══════════════════════════════════════════════════════════════════
🔄 Auto-Correcting Test: simple_sma.pine
═══════════════════════════════════════════════════════════════════

📝 Attempt 1/3
──────────────────────────────────────────────────────────────────
🔍 Phase 1: Local validation...
✅ Local validation passed

🌐 Phase 2: TradingView compilation...
❌ TradingView compilation failed:
   • Line 2: 'study' is deprecated. Use 'indicator' instead.

🔍 Analyzing error: Line 2: 'study' is deprecated...
   → Replacing deprecated syntax...
   ✓ Applied fix: Replaced deprecated study() with indicator()
🔧 Applied fix: Replaced deprecated study() with indicator()
🔄 Retrying with corrected code...

📝 Attempt 2/3
──────────────────────────────────────────────────────────────────
🔍 Phase 1: Local validation...
✅ Local validation passed

🌐 Phase 2: TradingView compilation...
✅ TradingView compilation successful!
💾 Corrected version saved: pine_scripts/examples/simple_sma_corrected.pine

═══════════════════════════════════════════════════════════════════

╔════════════════════════════════════════════════════════════════╗
║                   📊 FINAL REPORT                              ║
╚════════════════════════════════════════════════════════════════╝

📈 Results:
   Total Scripts: 8
   ✅ Successful: 8
   🔧 Auto-Fixed: 3
   ❌ Failed: 0

🔧 AUTO-CORRECTED SCRIPTS:

   📝 simple_sma.pine:
      • Attempt 1 (tradingview): Replaced deprecated study() with indicator()

   📝 old_script.pine:
      • Attempt 1 (tradingview): Replaced deprecated security() with request.security()

   📝 buggy_script.pine:
      • Attempt 1 (local): Added missing closing parenthesis

═══════════════════════════════════════════════════════════════════
🎉 ALL SCRIPTS COMPILED SUCCESSFULLY!
═══════════════════════════════════════════════════════════════════
```

## 🔧 Configuration

### Paramètres de Retry
Par défaut, le système essaie jusqu'à **3 fois** par script. Vous pouvez modifier cela dans le code:

```javascript
// Dans auto_correcting_tester.js
this.maxRetries = 3; // Changer ici
```

### Types d'Erreurs Supportées

Le système peut corriger automatiquement:
- ✅ Syntaxe dépréciée (`study` → `indicator`)
- ✅ Fonctions dépréciées (`security` → `request.security`)
- ✅ Parenthèses manquantes
- ✅ Crochets manquants
- ⚠️  Problèmes de types (diagnostic seulement)
- ⚠️  Arguments incorrects (diagnostic seulement)

## 📁 Fichiers Corrigés

Les versions corrigées sont sauvegardées avec le suffixe `_corrected.pine`:

```
pine_scripts/examples/
├── simple_sma.pine              (original)
├── simple_sma_corrected.pine    (version corrigée)
├── rsi_indicator.pine           (original)
└── rsi_indicator_corrected.pine (version corrigée si erreurs)
```

## 🎯 Workflow Recommandé

### Développement Quotidien
```bash
# Créer un script
nano pine_scripts/examples/mon_script.pine

# Test local
npm test

# Si erreurs, auto-correction
npm run test:auto-correct
```

### Avant un Commit
```bash
# Auto-correction complète
npm run test:auto-correct

# Si tout passe, commit
git add .
git commit -m "Add corrected Pine scripts"
```

## 💡 Avantages

1. **Gain de Temps** ⏱️
   - Pas besoin de corriger manuellement
   - Tests et corrections automatiques

2. **Apprentissage** 📚
   - Voir les corrections appliquées
   - Comprendre les erreurs courantes

3. **Fiabilité** ✅
   - Tests jusqu'à la réussite
   - Validation sur TradingView réel

4. **Traçabilité** 📊
   - Historique des corrections
   - Rapport détaillé

## ⚠️ Limitations

### Corrections Non Automatiques
Certaines erreurs nécessitent une intervention manuelle:
- Logique métier incorrecte
- Erreurs complexes de types
- Problèmes d'algorithme
- Erreurs de conception

### Nombre de Tentatives
- Maximum 3 tentatives par script
- Si échec après 3 fois, intervention manuelle nécessaire

## 🔍 Diagnostic

### Script Échoue Après 3 Tentatives
```bash
# Voir le rapport détaillé
npm run test:auto-correct

# Vérifier l'historique des corrections tentées
# Le rapport affiche toutes les tentatives
```

### Correction Automatique Incorrecte
Si une correction automatique cause un nouveau problème:
1. Utilisez la version `_corrected.pine`
2. Comparez avec l'original
3. Corrigez manuellement
4. Commitez la version manuelle

## 📚 Intégration avec Autres Outils

### Workflow Complet
```bash
# 1. Validation locale (rapide)
npm test

# 2. Génération automatique (si besoin)
npm run generate

# 3. Auto-correction TradingView (complet)
npm run test:auto-correct

# 4. Test final
npm run test:tradingview
```

### CI/CD
```yaml
# Dans .github/workflows/ci.yml
- name: Auto-correct Pine Scripts
  run: npm run test:auto-correct
  env:
    TRADINGVIEW_EMAIL: ${{ secrets.TRADINGVIEW_EMAIL }}
    TRADINGVIEW_PASSWORD: ${{ secrets.TRADINGVIEW_PASSWORD }}
```

## 🎉 Résumé

Le système d'auto-correction:
- ✅ Teste automatiquement sur TradingView
- ✅ Détecte les erreurs de compilation
- ✅ Applique des corrections automatiques
- ✅ Réessaie jusqu'à 3 fois
- ✅ Sauvegarde les versions corrigées
- ✅ Fournit un rapport détaillé
- ✅ Garde tous les modules opérationnels

**Commande principale:**
```bash
npm run test:auto-correct
```

🚀 **Testé, corrigé, validé automatiquement!**
