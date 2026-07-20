@echo off
setlocal
set "TARGET=C:\Projects\AdventureLearningStudio"

if not exist "%TARGET%\src\App.tsx" (
  echo Could not find the project at:
  echo %TARGET%
  pause
  exit /b 1
)

echo Creating backup...
if not exist "%TARGET%\backup-sprint2" mkdir "%TARGET%\backup-sprint2"
copy /Y "%TARGET%\src\App.tsx" "%TARGET%\backup-sprint2\App.tsx" >nul
copy /Y "%TARGET%\src\models\adventure.ts" "%TARGET%\backup-sprint2\adventure.ts" >nul
copy /Y "%TARGET%\src\pages\WorkspacePage.tsx" "%TARGET%\backup-sprint2\WorkspacePage.tsx" >nul
copy /Y "%TARGET%\src\styles\global.css" "%TARGET%\backup-sprint2\global.css" >nul

echo Installing Sprint 3 files...
xcopy "%~dp0src" "%TARGET%\src" /E /I /Y >nul

findstr /C:"sprint3.css" "%TARGET%\src\main.tsx" >nul
if errorlevel 1 (
  echo import "./styles/sprint3.css";>> "%TARGET%\src\main.tsx"
)

echo.
echo Sprint 3 installed.
echo.
echo Return to the project command window and run:
echo npm run dev
echo.
pause
