@echo off
setlocal

set DB_PATH=.\server\calendar.db
set SERVER_DIR=.\server
set CLIENT_DIR=.\client

echo ==========================================
echo Checking for SQLite database...
echo ==========================================

if not exist "%DB_PATH%" (
    echo [INFO] calendar.db not found. Running init-db.mjs...
    node "%SERVER_DIR%\init-db.mjs"
    if %errorlevel% neq 0 (
        echo [ERROR] init-db.mjs failed. Aborting.
        pause
        exit /b 1
    )
    echo [OK] Database initialized successfully.
) else (
    echo [OK] calendar.db already exists. Skipping init.
)

echo ------------------------------------------
echo Starting Node Server and React Client...
echo ------------------------------------------

start "Node Server (Backend)" /D "%SERVER_DIR%" cmd /c "npm run dev"
start "React Client (Frontend)" /D "%CLIENT_DIR%" cmd /c "npm run dev"

echo Both servers are starting in new windows!
echo Close those new terminal windows when you want to stop the servers.
echo.

pause
