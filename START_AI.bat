@echo off
title AI Gold Master - Demarrage
color 0A

echo ========================================================
echo.
echo            AI GOLD MASTER - DEMARRAGE
echo.
echo ========================================================
echo.

echo [1/3] Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERREUR] Node.js n'est pas installe!
    echo.
    echo Telechargez Node.js sur: https://nodejs.org/
    echo Installez-le puis relancez ce fichier.
    echo.
    pause
    exit
)
echo Node.js detecte! [OK]
echo.

echo [2/3] Installation des dependances...
echo (Cela peut prendre 3-5 minutes la premiere fois)
echo.
call npm install
if errorlevel 1 (
    echo.
    echo [ERREUR] Installation echouee!
    echo Verifiez votre connexion internet.
    echo.
    pause
    exit
)
echo Installation terminee! [OK]
echo.

echo [3/3] Verification du fichier .env...
if not exist .env (
    echo.
    echo [ATTENTION] Le fichier .env n'existe pas!
    echo Creation du fichier .env...
    copy .env.example .env
    echo.
    echo IMPORTANT: Ouvrez le fichier .env et ajoutez:
    echo - Votre TELEGRAM_BOT_TOKEN
    echo - Votre TELEGRAM_CHAT_ID
    echo.
    echo Appuyez sur une touche quand c'est fait...
    pause
)
echo Fichier .env present! [OK]
echo.

echo ========================================================
echo.
echo          L'AI VA MAINTENANT DEMARRER
echo.
echo  IMPORTANT: NE FERMEZ PAS CETTE FENETRE!
echo  L'AI doit rester active pour fonctionner.
echo.
echo  Pour arreter l'AI: Appuyez sur Ctrl+C
echo.
echo ========================================================
echo.
echo Demarrage dans 3 secondes...
timeout /t 3 >nul

call npm start

echo.
echo ========================================================
echo L'AI s'est arretee.
echo Pour la relancer, double-cliquez a nouveau sur ce fichier.
echo ========================================================
echo.
pause
