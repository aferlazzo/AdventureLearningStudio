@echo off
setlocal

REM ============================================================
REM Adventure Learning Studio
REM Organize design documents into the docs folder
REM ============================================================

echo.
echo ==========================================
echo Organizing Adventure Learning Studio docs
echo ==========================================
echo.

REM Create docs folder if needed
if not exist "docs" (
    mkdir "docs"
    echo Created docs folder.
)

echo.

call :MoveFile "Architecture.md"
call :MoveFile "Constitution.md"
call :MoveFile "Conversation Specification.md"
call :MoveFile "Domain Model.md"
call :MoveFile "MISSION.md"
call :MoveFile "Mission.md"
call :MoveFile "Principles.md"
call :MoveFile "PRODUCT.md"
call :MoveFile "Product.md"
call :MoveFile "README.md"
call :MoveFile "ROADMAP.md"
call :MoveFile "Roadmap.md"
call :MoveFile "Studio Specification.md"
call :MoveFile "SUCCESS.md"
call :MoveFile "Success.md"
call :MoveFile "Vision.md"

echo.
echo ==========================================
echo Done.
echo ==========================================
pause
exit /b


:MoveFile
if exist %1 (
    echo Moving %1
    move /Y %1 docs >nul
) else (
    echo Skipping %1
)
exit /b