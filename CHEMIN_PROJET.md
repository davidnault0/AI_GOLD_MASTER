# 📍 CHEMIN DU PROJET AI_GOLD_MASTER

## 🌐 Sur GitHub

**URL du Repository:**
```
https://github.com/davidnault0/AI_GOLD_MASTER
```

**Pour cloner sur votre ordinateur:**
```bash
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
```

---

## 💻 Sur Votre Ordinateur (Après Clonage)

### Windows:

**Chemin typique après clonage:**
```
C:\Users\VotreNom\AI_GOLD_MASTER
```

**Ou si cloné dans Documents:**
```
C:\Users\VotreNom\Documents\AI_GOLD_MASTER
```

**Ou si cloné dans un dossier spécifique:**
```
C:\Projets\AI_GOLD_MASTER
```

### Mac:

**Chemin typique après clonage:**
```
/Users/VotreNom/AI_GOLD_MASTER
```

**Ou dans Documents:**
```
/Users/VotreNom/Documents/AI_GOLD_MASTER
```

### Linux:

**Chemin typique:**
```
/home/VotreNom/AI_GOLD_MASTER
```

---

## 🔍 Comment Trouver Votre Chemin

### Si vous avez déjà cloné le projet:

#### Sur Windows (PowerShell):
```powershell
# Chercher le dossier
Get-ChildItem -Path C:\ -Filter "AI_GOLD_MASTER" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
```

#### Sur Windows (CMD):
```cmd
# Chercher dans tout le disque C:
dir C:\AI_GOLD_MASTER /s
```

#### Sur Mac/Linux:
```bash
# Chercher dans votre dossier home
find ~ -name "AI_GOLD_MASTER" -type d 2>/dev/null
```

### Si vous NE l'avez PAS encore cloné:

1. **Choisissez où vous voulez le mettre**
   
   **Exemple Windows:**
   ```powershell
   cd C:\Users\VotreNom\Documents
   git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
   cd AI_GOLD_MASTER
   ```

   **Exemple Mac/Linux:**
   ```bash
   cd ~/Documents
   git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
   cd AI_GOLD_MASTER
   ```

2. **Le dossier sera créé ici!**

---

## 🚀 Étapes Complètes Pour Commencer

### 1. Cloner le Projet (si pas encore fait)

**Ouvrez un terminal et allez où vous voulez mettre le projet:**

```bash
# Windows PowerShell
cd C:\Users\VotreNom\Documents

# Mac/Linux
cd ~/Documents

# Puis clonez:
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
```

### 2. Entrer dans le Dossier

```bash
cd AI_GOLD_MASTER
```

### 3. Vérifier que Vous Êtes au Bon Endroit

```bash
# Windows
dir

# Mac/Linux
ls
```

**Vous devriez voir:**
- package.json
- src/
- README.md
- START_AI.bat (Windows)
- start_ai.sh (Mac/Linux)
- etc.

### 4. Démarrer l'AI

**Windows:**
```powershell
# Méthode 1: Double-clic sur START_AI.bat

# Méthode 2: Dans PowerShell
npm install
npm start
```

**Mac/Linux:**
```bash
# Méthode 1: Script
./start_ai.sh

# Méthode 2: Manuel
npm install
npm start
```

---

## 📂 Structure du Projet

Quand vous êtes dans le bon dossier, vous verrez:

```
AI_GOLD_MASTER/
├── src/
│   ├── index.js              # Moteur principal
│   ├── logger.js
│   ├── analyzers/
│   │   └── marketData.js
│   ├── strategies/
│   │   ├── goldOptimized.js  # Stratégie principale
│   │   ├── smaCrossover.js
│   │   ├── rsiStrategy.js
│   │   └── ...
│   └── telegram/
│       └── botManager.js
├── logs/                     # Créé automatiquement
├── node_modules/             # Créé par npm install
├── package.json
├── .env                      # À créer/configurer
├── .env.example
├── START_AI.bat             # Windows
├── start_ai.sh              # Mac/Linux
├── README.md
├── GUIDE_COMPLET_SIMPLE.md
└── ...
```

---

## 🎯 Chemin Rapide Selon Votre Situation

### Situation 1: "Je n'ai RIEN fait encore"

```bash
# 1. Ouvrir terminal
# 2. Aller dans un dossier que vous connaissez
cd Documents

# 3. Cloner
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git

# 4. Entrer
cd AI_GOLD_MASTER

# 5. Voilà, vous y êtes!
```

**Chemin final:** `Documents/AI_GOLD_MASTER`

### Situation 2: "Je l'ai déjà téléchargé mais je ne sais pas où"

**Windows:**
1. Ouvrez l'Explorateur de fichiers
2. Dans la barre de recherche en haut à droite
3. Tapez: `AI_GOLD_MASTER`
4. Clic droit sur le dossier trouvé → "Ouvrir dans Terminal"

**Mac:**
1. Ouvrez Finder
2. Cmd+F pour chercher
3. Tapez: `AI_GOLD_MASTER`
4. Clic droit → "Nouveau Terminal à cet emplacement"

**Linux:**
1. Ouvrez le gestionnaire de fichiers
2. Cherchez: `AI_GOLD_MASTER`
3. Clic droit → "Ouvrir dans le terminal"

### Situation 3: "Je veux le mettre dans un endroit spécifique"

**Choisissez un dossier facile à retenir:**

```bash
# Windows - Créer un dossier Projets
mkdir C:\Projets
cd C:\Projets
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git

# Mac/Linux - Créer un dossier Projets
mkdir ~/Projets
cd ~/Projets
git clone https://github.com/davidnault0/AI_GOLD_MASTER.git
```

**Chemin final:** `Projets/AI_GOLD_MASTER`

---

## 📍 Pour Être Sûr Où Vous Êtes

Dans le terminal, une fois dans le dossier AI_GOLD_MASTER:

```bash
# Windows PowerShell
pwd

# Mac/Linux
pwd
```

**Vous verrez quelque chose comme:**
- Windows: `C:\Users\VotreNom\Documents\AI_GOLD_MASTER`
- Mac: `/Users/VotreNom/Documents/AI_GOLD_MASTER`
- Linux: `/home/VotreNom/AI_GOLD_MASTER`

---

## ✅ Résumé Simple

**GitHub (en ligne):**
```
https://github.com/davidnault0/AI_GOLD_MASTER
```

**Votre ordinateur (local):**
```
Vous choisissez où vous le clonez!
Exemple: Documents/AI_GOLD_MASTER
```

**Pour y aller:**
```bash
cd chemin/vers/AI_GOLD_MASTER
```

**Pour démarrer:**
```bash
npm start
```

---

**Le projet est sur GitHub à l'adresse ci-dessus, et vous le clonez où vous voulez sur votre ordinateur!** 🚀
