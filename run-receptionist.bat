@echo off
echo ========================================================
echo Starting Opriva OP Receptionist Portal (Port 5174)...
echo ========================================================
cd /d "%~dp0receptionist-web"
call npm run dev -- --port 5174
pause
