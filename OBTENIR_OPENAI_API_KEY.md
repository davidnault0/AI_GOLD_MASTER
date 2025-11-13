# 🔑 Comment Obtenir Votre Clé API OpenAI

## Étape 1: Créer un Compte OpenAI

1. **Allez sur le site OpenAI**
   - Visitez: [https://platform.openai.com](https://platform.openai.com)
   - Cliquez sur "Sign Up" (S'inscrire) en haut à droite

2. **Créer votre compte**
   - Utilisez votre email
   - Ou connectez-vous avec Google/Microsoft
   - Vérifiez votre email

3. **Ajouter un numéro de téléphone**
   - OpenAI demande un numéro pour vérification
   - Vous recevrez un code SMS

## Étape 2: Obtenir Votre Clé API

### Option A: Via le Dashboard (Nouveau système)

1. **Accédez au Dashboard**
   - Allez sur [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Ou cliquez sur votre profil → "API keys"

2. **Créer une nouvelle clé**
   - Cliquez sur **"Create new secret key"** (Créer une nouvelle clé secrète)
   - Donnez-lui un nom (ex: "Trading Bot")
   - Choisissez les permissions (laissez par défaut)
   - Cliquez sur **"Create secret key"**

3. **IMPORTANT: Copiez immédiatement votre clé!**
   ```
   sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   - ⚠️ **Vous ne pourrez la voir qu'une seule fois!**
   - Copiez-la et sauvegardez-la en lieu sûr
   - Ne la partagez JAMAIS avec personne

### Option B: Via l'ancien Dashboard

Si vous voyez l'ancien interface:

1. Allez sur [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
2. Cliquez sur **"Create new secret key"**
3. Nommez votre clé
4. Copiez-la immédiatement

## Étape 3: Ajouter du Crédit

### Crédits Gratuits

OpenAI offre parfois des crédits gratuits pour les nouveaux comptes:
- $5 USD pour tester (selon disponibilité)
- Valables 3 mois

### Ajouter un Moyen de Paiement

Si vous n'avez pas de crédits gratuits:

1. **Allez dans Billing**
   - [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)

2. **Ajouter une carte de crédit**
   - Cliquez sur "Add payment method"
   - Entrez vos informations de carte
   - Ajoutez du crédit (minimum $5)

3. **Configurer les limites** (Recommandé!)
   - Allez dans "Usage limits"
   - Définissez une limite mensuelle (ex: $20)
   - Cela évite les dépenses imprévues

## Étape 4: Utiliser Votre Clé avec le Bot

### Sur Render (Déploiement Cloud)

1. **Accédez à votre service Render**
   - Allez sur [https://dashboard.render.com](https://dashboard.render.com)

2. **Ajouter la variable d'environnement**
   - Cliquez sur votre service
   - Allez dans "Environment"
   - Cliquez sur "Add Environment Variable"
   - Nom: `OPENAI_API_KEY`
   - Valeur: `sk-proj-votre-clé-ici`
   - Cliquez "Save Changes"

3. **Redémarrer le service**
   - Le bot redémarre automatiquement avec la nouvelle clé

### En Local (Test sur votre ordinateur)

1. **Créer le fichier .env**
   ```bash
   cd AI_GOLD_MASTER
   cp .env.example .env
   ```

2. **Éditer le fichier .env**
   ```bash
   nano .env
   # ou utilisez n'importe quel éditeur de texte
   ```

3. **Ajouter votre clé**
   ```env
   OPENAI_API_KEY=sk-proj-votre-clé-ici
   AI_MODEL=gpt-4o
   TRADING_SYMBOL=BTCUSDT
   UPDATE_INTERVAL=1000
   DATA_PROVIDER=binance
   ```

4. **Sauvegarder et démarrer**
   ```bash
   npm start
   ```

## 💰 Coûts GPT-4o

### Prix par Token
- **Input**: $2.50 par million de tokens
- **Output**: $10.00 par million de tokens

### Estimation Mensuelle
Avec le bot analysant chaque seconde:
- **Utilisation légère**: $5-10/mois
- **Utilisation normale**: $10-20/mois
- **Utilisation intensive**: $20-50/mois

### Comment Réduire les Coûts

1. **Augmenter l'intervalle**
   ```env
   UPDATE_INTERVAL=5000  # 5 secondes au lieu de 1
   ```

2. **Utiliser l'IA seulement pour signaux importants**
   - Le bot utilise déjà les indicateurs techniques d'abord
   - L'IA n'intervient que pour confirmation

3. **Alternative: Qwen 3 Local**
   - GRATUIT après installation
   - Voir [QWEN3_DEPLOYMENT.md](./QWEN3_DEPLOYMENT.md)
   - Nécessite un GPU

## 🔒 Sécurité de Votre Clé API

### ✅ À FAIRE

- ✅ Gardez votre clé secrète
- ✅ Utilisez des variables d'environnement
- ✅ Définissez des limites de dépenses
- ✅ Surveillez votre utilisation régulièrement
- ✅ Régénérez votre clé si compromise

### ❌ À NE PAS FAIRE

- ❌ Ne partagez jamais votre clé
- ❌ Ne la commitez pas dans Git
- ❌ Ne la postez pas sur des forums/Discord
- ❌ Ne l'envoyez pas par email
- ❌ Ne la mettez pas sur GitHub public

### Si Votre Clé est Compromise

1. **Allez immédiatement sur** [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Révoquez la clé compromise** (icône poubelle)
3. **Créez une nouvelle clé**
4. **Mettez à jour vos environnements** (Render, local)

## 📊 Surveiller Votre Utilisation

1. **Dashboard OpenAI**
   - [https://platform.openai.com/usage](https://platform.openai.com/usage)
   - Voir l'utilisation quotidienne/mensuelle

2. **Configurer des Alertes**
   - Billing → Usage limits
   - Email notification quand seuil atteint

3. **Analyser les Coûts**
   - Voir quels modèles coûtent le plus
   - Ajuster votre utilisation

## 🆘 Problèmes Courants

### "Invalid API Key"

**Solutions:**
- Vérifiez que vous avez bien copié toute la clé
- Pas d'espaces avant/après
- Vérifiez qu'elle commence par `sk-`
- Régénérez une nouvelle clé si nécessaire

### "Insufficient Credits"

**Solutions:**
- Ajoutez du crédit dans Billing
- Vérifiez que votre carte est valide
- Attendez que les crédits gratuits s'activent (24h parfois)

### "Rate Limit Exceeded"

**Solutions:**
- Augmentez `UPDATE_INTERVAL` à 5000 ou plus
- Attendez quelques minutes
- Vérifiez vos limites dans le dashboard

### "Organization Quota Exceeded"

**Solutions:**
- Votre compte a atteint sa limite
- Augmentez votre quota dans Billing
- Contactez le support OpenAI

## 🎓 Ressources Utiles

- **Documentation OpenAI**: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- **Pricing**: [https://openai.com/api/pricing](https://openai.com/api/pricing)
- **Support**: [https://help.openai.com](https://help.openai.com)
- **Status**: [https://status.openai.com](https://status.openai.com)

## 📞 Besoin d'Aide Supplémentaire?

1. **Consultez** [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) pour le déploiement complet
2. **Lisez** [SOLUTION_COMPLETE.md](./SOLUTION_COMPLETE.md) pour la vue d'ensemble
3. **Ouvrez une issue** sur GitHub si vous avez des problèmes

## ✅ Checklist Rapide

- [ ] Compte OpenAI créé
- [ ] Numéro de téléphone vérifié
- [ ] Clé API créée et copiée
- [ ] Crédit ajouté (gratuit ou payant)
- [ ] Limite de dépense configurée ($20 recommandé)
- [ ] Clé ajoutée sur Render (variable `OPENAI_API_KEY`)
- [ ] Bot démarré et fonctionnel

---

**Vous êtes maintenant prêt à utiliser votre bot de trading IA! 🚀**

Si vous avez des questions, n'hésitez pas à demander de l'aide sur GitHub!
