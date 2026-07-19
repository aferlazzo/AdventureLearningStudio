@echo off
setlocal

REM ==========================================================
REM Adventure Learning Studio
REM Create standard documentation structure
REM ==========================================================

REM Change to the repository root (parent of this tools folder)
cd /d "%~dp0.."

echo.
echo ==========================================================
echo Adventure Learning Studio - Documentation Setup
echo ==========================================================
echo.

if not exist "docs" (
    mkdir "docs"
    echo Created folder: docs
) else (
    echo Folder already exists: docs
)

call :CreateFile "docs\MANIFESTO.md"
call :CreateFile "docs\ARCHITECTURAL_PRINCIPLES.md"
call :CreateFile "docs\DECISIONS.md"
call :CreateFile "docs\ROADMAP.md"
call :CreateFile "docs\UI_GUIDELINES.md"
call :CreateFile "docs\AUTHOR_WORKFLOW.md"
call :CreateFile "docs\CHANGELOG.md"

echo.
echo Documentation structure is ready.
echo.

endlocal
exit /b 0


:CreateFile
if exist "%~1" (
    echo Exists: %~1
) else (
    type nul > "%~1"
    echo Created: %~1
)
exit /b