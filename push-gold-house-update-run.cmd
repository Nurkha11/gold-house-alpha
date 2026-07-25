@echo off
setlocal

cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
set "LOG_FILE=%CD%\push-gold-house-update.log"

echo Gold House GitHub push
echo Project: %CD%
echo Log: %LOG_FILE%
echo.

echo Gold House GitHub push > "%LOG_FILE%"
echo Project: %CD% >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

where git >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo Git is not available in PATH.
  echo Git is not available in PATH. >> "%LOG_FILE%"
  goto :end
)

if not exist "C:\Program Files\nodejs\npm.cmd" (
  echo npm.cmd not found at C:\Program Files\nodejs\npm.cmd
  echo npm.cmd not found at C:\Program Files\nodejs\npm.cmd >> "%LOG_FILE%"
  goto :end
)

echo Checking local secrets...
git check-ignore -v .env >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo WARNING: .env is not ignored. Stop and check .gitignore.
  echo WARNING: .env is not ignored. Stop and check .gitignore. >> "%LOG_FILE%"
  goto :end
)

echo Running TypeScript check...
"C:\Program Files\nodejs\npm.cmd" run typecheck >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo TypeScript check failed. See push-gold-house-update.log.
  goto :end
)

echo Adding project files...
git add . >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo git add failed. See push-gold-house-update.log.
  goto :end
)

echo Checking staged files...
git diff --cached --name-only >> "%LOG_FILE%" 2>&1

echo Committing changes...
git commit -m "Update Gold House owner map and recommendation flow" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo Commit skipped or failed. Trying to push current branch anyway...
  echo Commit skipped or failed. Trying to push current branch anyway... >> "%LOG_FILE%"
)

echo Pushing to GitHub...
git push origin main >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo git push failed. See push-gold-house-update.log.
  goto :end
)

echo.
echo Done. Gold House update is pushed to GitHub.
echo Done. Gold House update is pushed to GitHub. >> "%LOG_FILE%"

:end
echo.
echo Window will stay open. If there is an error, send me this file:
echo %LOG_FILE%
echo.
