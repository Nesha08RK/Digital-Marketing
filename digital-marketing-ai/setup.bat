@echo off
echo ========================================
echo   Digital Marketing AI Chatbot Setup
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
    node --version
)

echo.
echo Installing dependencies...
npm install

echo.
echo ========================================
echo   Setup Complete! Next Steps:
echo ========================================
echo.
echo 1. Get your Gemini API key from:
echo    https://makersuite.google.com/app/apikey
echo.
echo 2. Create a .env file with your API key:
echo    GEMINI_API_KEY=your_api_key_here
echo.
echo 3. Start the server:
echo    npm start
echo.
echo 4. Open your browser to:
echo    http://localhost:3000
echo.
echo ========================================
echo.
pause
