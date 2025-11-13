# Guide de Démarrage Rapide - AI Integration

## Question: GPT-4o ou Qwen 3 pour une efficacité accrue?

**Réponse courte**: Cela dépend de vos besoins spécifiques!

## Démarrage en 3 étapes

### Étape 1: Choisir votre modèle

Utilisez ce tableau de décision rapide:

| Critère | Recommandation |
|---------|----------------|
| Vous débutez | **GPT-4o** ✓ |
| Budget limité initial | **GPT-4o** ✓ |
| Qualité maximale | **GPT-4o** ✓ |
| Données confidentielles | **Qwen 3** ✓ |
| Volume élevé (>1M tokens/mois) | **Qwen 3** ✓ |
| Infrastructure GPU disponible | **Qwen 3** ✓ |
| Latence ultra-faible requise | **Qwen 3** ✓ |

### Étape 2: Configuration

#### Option A: GPT-4o (Recommandé pour débuter)

```bash
# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Éditer .env et ajouter votre clé API OpenAI
# OPENAI_API_KEY=sk-...

# 3. Tester
node ai-integration.js
```

Coût: ~$2.50-10 par million de tokens

#### Option B: Qwen 3 (Pour infrastructure locale)

```bash
# 1. Installer Ollama (le plus simple)
curl -fsSL https://ollama.com/install.sh | sh

# 2. Télécharger Qwen 3
ollama pull qwen2.5:7b

# 3. Lancer le serveur
ollama serve

# 4. Configurer l'endpoint
cp .env.example .env
# Modifier DEFAULT_AI_MODEL=qwen-3
```

Voir [QWEN3_DEPLOYMENT.md](./QWEN3_DEPLOYMENT.md) pour plus de détails.

### Étape 3: Utilisation

```javascript
const AIModelManager = require('./ai-integration');

// Initialiser
const ai = new AIModelManager();

// Exemple: Générer du code Pine Script
const result = await ai.generatePineScript(
  'Créer un indicateur RSI avec alertes'
);

console.log(result);
```

## Approche Hybride (Optimal)

Pour une **efficacité maximale**, utilisez les deux:

```javascript
// Tâches simples → Qwen 3 (local, rapide, gratuit)
const localAI = new AIModelManager('qwen-3');
await localAI.analyzeLogs(logs);

// Tâches complexes → GPT-4o (cloud, haute qualité)
const cloudAI = new AIModelManager('gpt-4o');
await cloudAI.generatePineScript('Indicateur complexe...');
```

**Avantages**:
- 💰 Économies: 40-60% sur les coûts
- ⚡ Vitesse: Réponses instantanées pour tâches courantes
- 🎯 Qualité: Meilleurs résultats pour tâches critiques

## Métriques de Performance

### GPT-4o
- Latence: 500-2000ms
- Qualité: ★★★★★ (Excellente)
- Coût: $2.50-10 / 1M tokens
- Setup: 5 minutes

### Qwen 3 Local
- Latence: 50-200ms
- Qualité: ★★★★☆ (Très bonne)
- Coût: ~$0 après setup
- Setup: 30-60 minutes

## Ressources Supplémentaires

- 📊 [Comparaison détaillée](./AI_MODEL_COMPARISON.md)
- 🚀 [Guide déploiement Qwen 3](./QWEN3_DEPLOYMENT.md)
- 📝 [Documentation complète](./README.md)

## Support

Pour questions ou problèmes, voir la documentation ou ouvrir une issue sur GitHub.

---

**Conclusion**: Commencez avec GPT-4o pour sa simplicité, évaluez Qwen 3 si vos besoins évoluent vers plus de volume ou de confidentialité.
