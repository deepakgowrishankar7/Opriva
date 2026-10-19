@echo off
echo ========================================================
echo Starting Opriva Spring Boot Backend (Port 8080)...
echo ========================================================
cd /d "%~dp0opriva-backend"
call "..\.tools\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
pause
