@echo off
setlocal enabledelayedexpansion
title IPRIG - site local

rem =========================================================================
rem  Lance le site IPRIG en local et l ouvre dans le navigateur.
rem  Double-cliquer sur ce fichier suffit.
rem
rem  Ce script :
rem    1. verifie que Node.js est installe
rem    2. installe les dependances a la premiere utilisation
rem    3. demarre le serveur sur le port 4321
rem    4. ouvre le navigateur
rem    5. arrete proprement le serveur quand on appuie sur une touche
rem
rem  Ce fichier doit rester a cote du dossier "iprig".
rem  Encodage : ASCII, fins de ligne CRLF (requis par cmd.exe).
rem =========================================================================

set "PORT=4321"
set "URL=http://localhost:%PORT%"

cd /d "%~dp0iprig"
if errorlevel 1 (
  echo.
  echo   [X] Dossier "iprig" introuvable a cote de ce fichier.
  echo       Ce lanceur doit rester dans le dossier Kevan-Gafaiti-Digital.
  echo.
  pause
  exit /b 1
)

echo.
echo   ===========================================
echo      I P R I G   -   site local
echo   ===========================================
echo.

rem --- 1. Node.js est-il installe ? ----------------------------------------
where node >nul 2>&1
if errorlevel 1 (
  echo   [X] Node.js n est pas installe sur cet ordinateur.
  echo.
  echo       Telecharge-le ici, puis relance ce fichier :
  echo       https://nodejs.org
  echo.
  pause
  exit /b 1
)
for /f "delims=" %%v in ('node -v') do set "NODEV=%%v"
echo   [OK] Node.js !NODEV!

rem --- 2. Dependances ------------------------------------------------------
if not exist "node_modules\" (
  echo.
  echo   [..] Premiere utilisation : installation des dependances.
  echo        Cela prend une a deux minutes, une seule fois.
  echo.
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo   [X] L installation a echoue. Verifie ta connexion internet.
    echo.
    pause
    exit /b 1
  )
) else (
  echo   [OK] Dependances deja installees
)

rem --- 3. Le site tourne-t-il deja ? ---------------------------------------
curl -s -o nul --max-time 2 "%URL%/" >nul 2>&1
if not errorlevel 1 (
  echo   [OK] Le site tourne deja sur le port %PORT%
  goto ouvrir
)

rem --- 4. Demarrage du serveur ---------------------------------------------
echo   [..] Demarrage du serveur...
start "IPRIG - serveur" /min cmd /c "npm run dev -- --port %PORT%"

set /a essais=0
:attendre
rem  ping plutot que timeout : timeout refuse de tourner si l entree
rem  standard est redirigee, ce qui casserait la temporisation.
ping -n 2 127.0.0.1 >nul
curl -s -o nul --max-time 2 "%URL%/" >nul 2>&1
if not errorlevel 1 goto ouvrir
set /a essais+=1
if !essais! lss 60 goto attendre

echo.
echo   [X] Le serveur n a pas demarre apres 60 secondes.
echo       Ouvre un terminal dans le dossier "iprig" et lance : npm run dev
echo.
pause
exit /b 1

rem --- 5. Ouverture du navigateur -------------------------------------------
:ouvrir
echo   [OK] Serveur pret
start "" "%URL%"

echo.
echo   -------------------------------------------
echo      Le site est ouvert sur %URL%
echo.
echo      Les modifications des fichiers s affichent
echo      toutes seules, sans recharger la page.
echo   -------------------------------------------
echo.
echo   Appuie sur une touche pour ARRETER le site.
echo.
pause >nul

rem --- 6. Arret propre ------------------------------------------------------
echo   [..] Arret du serveur...
call npx astro dev stop >nul 2>&1
echo   [OK] Serveur arrete. A bientot.
ping -n 3 127.0.0.1 >nul
endlocal
exit /b 0
