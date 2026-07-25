@echo off
setlocal

cd /d "%~dp0"

set "PATH=C:\Program Files\nodejs;%PATH%"
set "USERPROFILE=%CD%\.expo-home"
set "HOME=%CD%\.expo-home"
set "APPDATA=%CD%\.expo-home"
set "EXPO_HOME=%CD%\.expo-home"
set "EXPO_NO_TELEMETRY=1"
set "EXPO_OFFLINE=1"

if not exist "%CD%\.expo-home" mkdir "%CD%\.expo-home"

if not exist "%CD%\.env" (
  copy "%CD%\.env.example" "%CD%\.env" >nul
)

for /f "usebackq tokens=1,* delims==" %%A in ("%CD%\.env") do (
  if /I "%%A"=="EXPO_PUBLIC_YANDEX_MAPS_API_KEY" set "EXPO_PUBLIC_YANDEX_MAPS_API_KEY=%%B"
)

echo Checking port 8081...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":8081" ^| findstr "LISTENING"') do (
  echo Stopping old server on port 8081, PID %%P
  taskkill /PID %%P /F >nul 2>nul
)

findstr /x /c:"EXPO_PUBLIC_YANDEX_MAPS_API_KEY=" "%CD%\.env" >nul
if not errorlevel 1 (
  echo ============================================================
  echo Yandex Maps API key is not set yet.
  echo Open .env and add:
  echo EXPO_PUBLIC_YANDEX_MAPS_API_KEY=your_real_yandex_key
  echo ============================================================
  echo.
  set "GOLD_HOUSE_HAS_YANDEX_KEY=0"
) else (
  set "GOLD_HOUSE_HAS_YANDEX_KEY=1"
)

echo Starting Gold House web preview...
echo Project: %CD%
set "GOLD_HOUSE_URL=http://localhost:8081/?fresh=%RANDOM%%RANDOM%"
echo URL: %GOLD_HOUSE_URL%
if "%GOLD_HOUSE_HAS_YANDEX_KEY%"=="1" echo Yandex Maps key: loaded from .env
echo.

start "" cmd /c "timeout /t 8 /nobreak >nul && start %GOLD_HOUSE_URL%"

"C:\Program Files\nodejs\npm.cmd" run web -- --port 8081 --clear

echo.
echo Gold House web preview stopped. Press any key to close this window.
pause >nul
