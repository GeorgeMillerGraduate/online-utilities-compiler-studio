@echo off
setlocal
cd /d "%~dp0"
title Jenga Code - Compiler Studio
where py >nul 2>nul
if errorlevel 1 (
 python "%~dp0preview_server.py"
) else (
 py -3 "%~dp0preview_server.py"
)
if errorlevel 1 pause
endlocal
