@echo off
rem Start dev server and open browser (Windows).
cd /d "%~dp0"
start "md-deck-dev" cmd /k npm run dev
timeout /t 3 /nobreak >nul
start http://localhost:5173
