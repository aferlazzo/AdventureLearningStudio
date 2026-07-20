@echo off
ECHO batch file location: C:\Users\aferl\Driver Confidence Guide PDF Version\Adventure Learning\start_Adventure_Learning_dev.bat
cd "\Users\aferl\Driver Confidence Guide PDF Version\Adventure Learning"
echo After running this batch file browse to http://localhost:5173 in Google Chrome
echo A command windo will be runing node:
echo VITE v6.4.3    ready in 294 ms
echo ''
echo local:    http://localhost:5173
echo Network: use --host to expose
echo press h + enter to show help
ECHO 



set "PROJECT=C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version\Adventure Learning\AdventureLearningStudio-starter\AdventureLearningStudio"

if not exist "%PROJECT%\package.json" (
    echo Adventure Learning Studio was not found:
    echo %PROJECT%
    pause
    exit /b 1
)

start "Adventure Learning Studio Server" cmd /k "cd /d ""%PROJECT%"" && npm run dev"

timeout /t 3 /nobreak >nul

start "" http://localhost:5173
explorer "%PROJECT%"