@echo off
echo ========================================================
echo Starting Opriva Doctor / Clinical Portal (Port 5175)...
echo ========================================================
cd /d "%~dp0doctor-web"
call npm run dev -- --port 5175
pause
