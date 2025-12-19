@echo off
setlocal enabledelayedexpansion

:: =====================================================
:: BEAST MODE PC Cleanup & Optimization (No Log File)
:: Comprehensive system cleanup with console-only output
:: =====================================================

:: Check for administrative privileges
openfiles >nul 2>&1
if errorlevel 1 (
    echo.
    echo This script requires Administrator privileges.
    echo Please right-click the script and select "Run as administrator".
    echo.
    pause
    exit /b
)

:: Initialize variables
set /a TOTAL_FREED=0

echo ==================================================
echo BEAST MODE Cleanup Run on %date% at %time%
echo ==================================================
echo Starting Beast Mode PC Cleanup ^& Optimization...
echo ==================================================

:: ---- Get initial disk space ----
for /f "usebackq" %%A in (`powershell -Command "(Get-PSDrive C).Free / 1MB"`) do set INITIAL_SPACE_MB=%%A
echo Initial free space: !INITIAL_SPACE_MB! MB

:: ==================================================
:: [1/8] Delete Temp Files
:: ==================================================
echo Deleting Temp Files...
for /f "usebackq delims=" %%F in (`dir "%TEMP%\*" /a-d /b 2^>nul`) do (
    if exist "%TEMP%\%%F" (
        del /f /q "%TEMP%\%%F" >nul 2>&1
        if errorlevel 1 (
            echo [TEMP] Cannot delete: %%F
        ) else (
            echo [TEMP] Deleted: %%F
        )
    )
)
for /d %%p in ("%TEMP%\*.*") do (
    if exist "%%p" (
        rmdir "%%p" /s /q >nul 2>&1
        if errorlevel 1 (
            echo [TEMP] Cannot delete directory: %%p
        ) else (
            echo [TEMP] Deleted directory: %%p
        )
    )
)
echo Temp cleanup completed
call :ProgressBar 1 8

:: ==================================================
:: [2/8] Clear Browser Caches
:: ==================================================
echo Clearing Browser Cache...
:: Chrome
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" (
    rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" >nul 2>&1
    if errorlevel 0 (
        echo [BROWSER] Chrome cache cleared
    ) else (
        echo [BROWSER] Failed to clear Chrome cache
    )
) else (
    echo [BROWSER] Chrome cache directory not found
)
:: Firefox
if exist "%LOCALAPPDATA%\Mozilla\Firefox\Profiles" (
    for /d %%p in ("%LOCALAPPDATA%\Mozilla\Firefox\Profiles\*.*") do (
        if exist "%%p\cache2\entries" (
            rd /s /q "%%p\cache2\entries" >nul 2>&1
            if errorlevel 0 (
                echo [BROWSER] Firefox cache cleared for profile %%p
            ) else (
                echo [BROWSER] Failed to clear Firefox cache for profile %%p
            )
        ) else (
            echo [BROWSER] Firefox cache directory not found for profile %%p
        )
    )
) else (
    echo [BROWSER] Firefox profiles directory not found
)
:: Edge
if exist "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" (
    rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" >nul 2>&1
    if errorlevel 0 (
        echo [BROWSER] Edge cache cleared
    ) else (
        echo [BROWSER] Failed to clear Edge cache
    )
) else (
    echo [BROWSER] Edge cache directory not found
)
call :ProgressBar 2 8

:: ==================================================
:: [3/8] Windows Update Cleanup
:: ==================================================
echo Cleaning Windows Update Files...
dism /online /Cleanup-Image /StartComponentCleanup /NoRestart >nul 2>&1
dism /online /Cleanup-Image /SPSuperseded /NoRestart >nul 2>&1

net stop wuauserv >nul 2>&1
net stop cryptSvc >nul 2>&1
net stop bits >nul 2>&1
net stop msiserver >nul 2>&1

if exist "C:\Windows\SoftwareDistribution\Download" (
    rd /s /q "C:\Windows\SoftwareDistribution\Download"
    echo [UPDATE] Windows Update cache cleared
)

net start wuauserv >nul 2>&1
net start cryptSvc >nul 2>&1
net start bits >nul 2>&1
net start msiserver >nul 2>&1

call :ProgressBar 3 8

:: ==================================================
:: [4/8] Event Logs Cleanup
:: ==================================================
echo Clearing Event Logs...
for /f "tokens=*" %%i in ('wevtutil el') do wevtutil cl "%%i" >nul 2>&1
echo Event logs cleared
call :ProgressBar 4 8

:: ==================================================
:: [5/8] Clear Windows Logs
:: ==================================================
if exist "C:\Windows\Logs" (
    for /f "usebackq delims=" %%F in (`dir "C:\Windows\Logs\*" /a-d /b 2^>nul`) do del /f /q "C:\Windows\Logs\%%F"
)
echo Windows logs cleared
call :ProgressBar 5 8

:: ==================================================
:: [6/8] Prefetch
:: ==================================================
if exist "C:\Windows\Prefetch" (
    for /f "usebackq delims=" %%F in (`dir "C:\Windows\Prefetch\*.pf" /b 2^>nul`) do del /f /q "C:\Windows\Prefetch\%%F"
)
echo Prefetch files cleared
call :ProgressBar 6 8

:: ==================================================
:: [7/8] Empty Recycle Bin
:: ==================================================
PowerShell.exe -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"
echo Recycle Bin cleared
call :ProgressBar 7 8

:: ==================================================
:: [8/8] Windows Store Cache + Network
:: ==================================================
wsreset.exe >nul 2>&1
ipconfig /flushdns
netsh winsock reset >nul 2>&1
netsh winhttp reset proxy >nul 2>&1
echo Windows Store cache + network optimized
call :ProgressBar 8 8

:: ==================================================
:: Summary
:: ==================================================
for /f "usebackq" %%A in (`powershell -Command "(Get-PSDrive C).Free / 1MB"`) do set FINAL_SPACE_MB=%%A
for /f "usebackq" %%A in (`powershell -Command "$initial = %INITIAL_SPACE_MB%; $final = %FINAL_SPACE_MB%; [math]::Round($final - $initial)"`) do set SPACE_FREED=%%A

echo ==================================================
echo Beast Mode Cleanup Complete!
echo Initial free space: !INITIAL_SPACE_MB! MB
echo Final free space:   !FINAL_SPACE_MB! MB
echo Space freed:        !SPACE_FREED! MB
echo ==================================================

pause
exit /b

:: ==================================================
:: Function: ProgressBar
:: ==================================================
:ProgressBar
set CURRENT_STEP=%1
set TOTAL_STEPS=%2
set /a PERCENT=(CURRENT_STEP*100)/TOTAL_STEPS
set BAR=[
set /a FILLED=(PERCENT*30)/100
for /L %%i in (1,1,!FILLED!) do set BAR=!BAR!#
for /L %%i in (!FILLED!,1,30) do set BAR=!BAR!-
set BAR=!BAR!]
echo Progress !CURRENT_STEP!/!TOTAL_STEPS! !BAR! !PERCENT!%% complete
exit /b
