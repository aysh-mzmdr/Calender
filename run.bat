@echo off
setlocal

set SERVER_DIR=.\server
set CLIENT_DIR=.\client

echo ------------------------------------------
echo Starting Node Server and React Client...
echo ------------------------------------------

start "Node Server (Backend)" /D "%SERVER_DIR%" cmd /c "npm run dev"
start "React Client (Frontend)" /D "%CLIENT_DIR%" cmd /c "npm run dev"

echo Both servers are starting in new windows.
echo.
echo Open your browser at: http://localhost:%CLIENT_PORT%/
echo.

pause
