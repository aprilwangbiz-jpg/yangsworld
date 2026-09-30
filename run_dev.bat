@echo off
cd /d "%~dp0"
echo ========================================
echo   Yang's World (dev server)
echo ========================================
echo.
echo Starting Vite dev server...
echo Close the console window to stop the server.
echo.

REM Launch the dev server in its own window so it keeps running
start "Yangs World Dev Server" cmd /k cd /d "%~dp0" ^&^& npm run dev

echo Waiting for the dev server to start...
timeout /t 5 /nobreak >nul
start "" http://localhost:5173

echo If the browser did not open, please open http://localhost:5173 manually.
pause
exit /b 0
