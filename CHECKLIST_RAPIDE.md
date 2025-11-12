# ✅ Checklist Rapide - Configuration du Bot

## 📋 Avant de Commencer

Vérifiez que vous avez:

- [ ] ✅ Clé OpenAI API (commence par `sk-proj-` ou `sk-`)
- [ ] ✅ Telegram Bot Token (format: `123456789:ABC-DEF...`)
- [ ] ✅ Telegram Chat ID (juste des chiffres)
- [ ] ✅ Twelve Data API Key (pour l'or)
- [ ] ✅ Compte GitHub (pour fork le repo)
- [ ] ✅ Compte Render (pour déployer)

## 🎯 Configuration sur Render (Cochez au fur et à mesure)

### Étape 1: Créer le Service
- [ ] Aller sur https://render.com
- [ ] Cliquer "New +" → "Web Service"
- [ ] Trouver "AI_GOLD_MASTER" dans la liste
- [ ] Cliquer "Connect"

### Étape 2: Variables d'Environnement (7 variables)

Ajouter chaque variable en cliquant "Add Environment Variable":

#### Variable 1: OpenAI
- [ ] Key: `OPENAI_API_KEY`
- [ ] Value: Votre clé OpenAI (sk-proj-...)
- [ ] ✅ Ajoutée

#### Variable 2: Telegram Token
- [ ] Key: `TELEGRAM_BOT_TOKEN`
- [ ] Value: Votre token (123456789:ABC...)
- [ ] ✅ Ajoutée

#### Variable 3: Telegram Chat ID
- [ ] Key: `TELEGRAM_CHAT_ID`
- [ ] Value: Votre chat ID (juste les chiffres)
- [ ] ✅ Ajoutée

#### Variable 4: Twelve Data
- [ ] Key: `TWELVE_DATA_API_KEY`
- [ ] Value: Votre clé Twelve Data
- [ ] ✅ Ajoutée

#### Variable 5: Symbole (Or)
- [ ] Key: `TRADING_SYMBOL`
- [ ] Value: `XAUUSD`
- [ ] ✅ Ajoutée

#### Variable 6: Provider
- [ ] Key: `DATA_PROVIDER`
- [ ] Value: `twelvedata`
- [ ] ✅ Ajoutée

#### Variable 7: Modèle IA
- [ ] Key: `AI_MODEL`
- [ ] Value: `gpt-4o`
- [ ] ✅ Ajoutée

### Étape 3: Lancement
- [ ] Vérifier que les 7 variables sont bien là
- [ ] Cliquer "Create Web Service" (en bas)
- [ ] Attendre 2-3 minutes
- [ ] Le statut devient "Live" ✅

## 🔍 Vérification (Une fois "Live")

### Logs
- [ ] Cliquer sur "Logs" dans le menu
- [ ] Voir: "🤖 Trading Bot 24/7 initialisé"
- [ ] Voir: "✅ Connexion au marché réussie - XAUUSD: $2XXX.XX"
- [ ] Voir: "🌐 Serveur HTTP démarré sur le port 3000"

### Dashboard Web
- [ ] Copier l'URL du service (en haut)
- [ ] Ajouter `/dashboard` à la fin
- [ ] Ouvrir dans le navigateur
- [ ] Voir le dashboard avec "XAUUSD" et "● ACTIF"

### Telegram
- [ ] Ouvrir Telegram
- [ ] Aller dans la conversation avec votre bot
- [ ] Envoyer /start (si pas déjà fait)
- [ ] Attendre 5-10 minutes pour le premier signal
- [ ] Recevoir un message quand signal BUY/SELL (pas HOLD)

## 🆘 Si Quelque Chose Ne Marche Pas

### Le bot ne démarre pas
- [ ] Vérifier que TOUTES les 7 variables sont configurées
- [ ] Vérifier qu'il n'y a pas d'espace avant/après les valeurs
- [ ] Vérifier que les clés API sont valides
- [ ] Regarder les logs pour l'erreur exacte

### "Invalid API Key"
- [ ] OpenAI: Vérifier sur https://platform.openai.com/api-keys
- [ ] Twelve Data: Vérifier sur https://twelvedata.com/account
- [ ] Telegram: Parler à @BotFather pour vérifier le token

### Pas de signaux
- [ ] C'est normal si le marché est calme
- [ ] Les signaux HOLD ne sont pas envoyés sur Telegram
- [ ] Attendre 15-30 minutes
- [ ] Vérifier le dashboard pour voir l'activité

### Dashboard ne charge pas
- [ ] Vérifier que le bot est "Live"
- [ ] Vérifier l'URL (doit finir par /dashboard)
- [ ] Attendre 1-2 minutes après le démarrage
- [ ] Essayer de rafraîchir la page

## 📊 Indicateurs de Succès

Vous saurez que tout fonctionne quand:

✅ **Statut Render**: "Live" (vert)
✅ **Logs**: Messages de connexion et analyse
✅ **Dashboard**: Affiche XAUUSD avec prix actuel
✅ **Telegram**: Reçoit des notifications (quand signal >70% confiance)
✅ **Temps actif**: Augmente dans le dashboard

## 💡 Conseils

### Économiser de l'Argent
Si vous voulez réduire les coûts OpenAI:
- [ ] Ajouter/modifier `UPDATE_INTERVAL=5000` (5 secondes au lieu de 1)
- [ ] Réduction de ~80% des coûts
- [ ] Toujours efficace pour l'or (moins volatil)

### Upgrader Plus Tard
Quand vous êtes prêt pour 24/7 sans interruption:
- [ ] Render: Upgrader vers Standard ($7/mois)
- [ ] Twelve Data: Upgrader si besoin (>800 req/jour)

## 📞 Besoin d'Aide?

Si une étape ne fonctionne pas:

1. 📖 Consultez [GUIDE_CONFIGURATION_COMPLETE.md](./GUIDE_CONFIGURATION_COMPLETE.md)
2. 👀 Vérifiez les logs Render pour l'erreur exacte
3. 💬 Commentez sur la PR avec votre problème
4. 📸 Joignez une capture d'écran si possible

## 🎉 Félicitations!

Une fois que tout est coché, votre bot:
- ✅ Fonctionne 24/7 sur Render
- ✅ Analyse l'or en temps réel
- ✅ Vous envoie des signaux sur Telegram
- ✅ Est surveillable via le dashboard

**Bon trading! 📈✨**

---

**Temps estimé total**: 20-30 minutes pour tout configurer
