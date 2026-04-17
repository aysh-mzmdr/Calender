@echo off
setlocal

set DB_PATH=.\server\calendar.db

echo ==========================================
echo Installing required node packages...
echo ==========================================

cd client
call npm install

echo [OK] Successful installed required client node packages.
echo.

cd ../server
call npm install

cd ../

echo [OK] Successful installed required server node packages.
echo.

echo ==========================================
echo Checking .env file...
echo ==========================================

if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [OK] .env created from .env.example.
    ) else (
        echo [INFO] .env.example not found. Creating .env with defaults...
        (
            echo SERVER_PORT = 3000
            echo CLIENT_PORT = 5173
            echo.
            echo VITE_SERVER_PORT = 3000
        ) > ".env"
        echo [OK] .env created with default ports.
    )
    echo Edit .env if your ports are different.
) else (
    echo [OK] .env already exists.
)
echo.

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
 
echo.
echo [OK] Successful Setup!
