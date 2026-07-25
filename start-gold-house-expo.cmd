@echo off
setlocal

cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
set "EXPO_NO_TELEMETRY=1"
set "USERPROFILE=%CD%\.expo-home"
set "HOME=%CD%\.expo-home"
set "APPDATA=%CD%\.expo-home"

if not exist "%CD%\.expo-home" mkdir "%CD%\.expo-home"

echo Starting Gold House Expo...
echo Project: %CD%
echo.
echo If PowerShell blocks npm, this file uses npm.cmd directly.
echo.

"C:\Program Files\nodejs\npm.cmd" run start -- --offline

echo.
echo Expo stopped. Press any key to close this window.
pause >nul
