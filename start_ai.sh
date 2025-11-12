#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

clear

echo "========================================================"
echo ""
echo "         AI GOLD MASTER - DEMARRAGE"
echo ""
echo "========================================================"
echo ""

# Vérifier Node.js
echo -e "${YELLOW}[1/3] Vérification de Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERREUR] Node.js n'est pas installé!${NC}"
    echo ""
    echo "Téléchargez Node.js sur: https://nodejs.org/"
    echo "Installez-le puis relancez ce script."
    echo ""
    exit 1
fi
echo -e "${GREEN}Node.js détecté! [OK]${NC}"
echo ""

# Installation des dépendances
echo -e "${YELLOW}[2/3] Installation des dépendances...${NC}"
echo "(Cela peut prendre 3-5 minutes la première fois)"
echo ""
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERREUR] Installation échouée!${NC}"
    echo "Vérifiez votre connexion internet."
    echo ""
    exit 1
fi
echo -e "${GREEN}Installation terminée! [OK]${NC}"
echo ""

# Vérifier .env
echo -e "${YELLOW}[3/3] Vérification du fichier .env...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}[ATTENTION] Le fichier .env n'existe pas!${NC}"
    echo "Création du fichier .env..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Ouvrez le fichier .env et ajoutez:"
    echo "- Votre TELEGRAM_BOT_TOKEN"
    echo "- Votre TELEGRAM_CHAT_ID"
    echo ""
    read -p "Appuyez sur Entrée quand c'est fait..."
fi
echo -e "${GREEN}Fichier .env présent! [OK]${NC}"
echo ""

echo "========================================================"
echo ""
echo "       L'AI VA MAINTENANT DEMARRER"
echo ""
echo " IMPORTANT: NE FERMEZ PAS CETTE FENETRE!"
echo " L'AI doit rester active pour fonctionner."
echo ""
echo " Pour arrêter l'AI: Appuyez sur Ctrl+C"
echo ""
echo "========================================================"
echo ""
echo "Démarrage dans 3 secondes..."
sleep 3

npm start

echo ""
echo "========================================================"
echo "L'AI s'est arrêtée."
echo "Pour la relancer, exécutez à nouveau ce script."
echo "========================================================"
echo ""
