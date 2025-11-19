@echo off
:: =====================================================
:: BEAST MODE PC Cleanup & Optimization Script v5.0
:: Interactive, logged, progress bars, and bro-proofed
:: =====================================================

:: Enable delayed expansion for dynamic variables
setlocal EnableDelayedExpansion

:: Set log files
set LOGFILE=%~dp0BeastModeCleanup_%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%.txt
set SUMMARYFILE=%~dp0CleanupSummary_%date:~10,4%-%date:~4,2%-%date:~7,2%.txt

:: Initialize metrics
set TOTAL_FREED=0
set TEMP_FREED=0
set BROWSER_FREED=0
set UPDATE_FREED=0
set LOG_FREED=0

:: Log header
echo ================================================== >> "%LOGFILE%"
echo BEAST MODE Cleanup Run on %date% at %time% >> "%LOGFILE%"
echo ================================================== >> "%LOGFILE%"

:: Get initial free space
for /f "tokens=2 delims= " %%A in ('wmic logicaldisk where "DeviceID='C:'" get FreeSpace /value ^| find "FreeSpace"') do set INITIAL_SPACE=%%A
set /a INITIAL_SPACE_MB=%INITIAL_SPACE%/1024/1024

echo ==================================================
echo Starting BEAST MODE PC Cleanup...
echo ==================================================

:: =========================
:: Function: Show Progress
:: =========================
:progress
:: %1 = current, %2 = total
set /a percent=(%1*100)/%2
set bar=[====================]
set /a barLen=percent/5
set displayed=
for /L %%i in (1,1,!barLen!) do set displayed=!displayed!=
set /a blanks=20-barLen
for /L %%i in (1,1,!blanks!) do set displayed=!displayed!-
<nul set /p ="Progress: !percent!%% !displayed!`r"
exit /b

:: =========================
:: Step 1: Temp Files Cleanup
:: =========================
echo [1/8] Cleaning Temp Files...
set count=0
for /f %%F in ('dir "%TEMP%\*" /a-d /b 2^>nul') do (
    del /f /q "%TEMP%\%%F" >nul 2>&1
    set /a count+=1
    call :progress !count! 200
    echo [TEMP] Deleted %%F >> "%LOGFILE%"
)
echo Temp cleanup done >> "%LOGFILE%"

:: =========================
:: Step 2: Browser Cache Cleanup
:: =========================
echo [2/8] Clearing Browser Cache...
:: Chrome
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" (
    rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" >nul 2>&1
    echo [CHROME] Cache cleared >> "%LOGFILE%"
)
:: Firefox
if exist "%LOCALAPPDATA%\Mozilla\Firefox\Profiles" (
    for /d %%p in ("%LOCALAPPDATA%\Mozilla\Firefox\Profiles\*") do (
        if exist "%%p\cache2\entries" (
            rd /s /q "%%p\cache2\entries" >nul 2>&1
            echo [FIREFOX] Cache cleared >> "%LOGFILE%"
        )
    )
)
:: Edge
if exist "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" (
    rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" >nul 2>&1
    echo [EDGE] Cache cleared >> "%LOGFILE%"
)

:: =========================
:: Step 3: Windows Update Cleanup
:: =========================
echo [3/8] Cleaning Windows Update Files...
dism /online /Cleanup-Image /StartComponentCleanup /NoRestart >nul 2>&1
dism /online /Cleanup-Image /SPSuperseded /NoRestart >nul 2>&1

:: SoftwareDistribution
net stop wuauserv >nul 2>&1
if exist "C:\Windows\SoftwareDistribution\Download" (
    rd /s /q "C:\Windows\SoftwareDistribution\Download" >nul 2>&1
    echo [UPDATE] SoftwareDistribution cleared >> "%LOGFILE%"
)
net start wuauserv >nul 2>&1

:: =========================
:: Step 4: Event Logs Cleanup
:: =========================
echo [4/8] Clearing Event Logs...
for /f "tokens=*" %%i in ('wevtutil el') do wevtutil cl "%%i" >nul 2>&1
echo Event logs cleared >> "%LOGFILE%"

:: =========================
:: Step 5: Prefetch Cleanup
:: =========================
echo [5/8] Clearing Prefetch Files...
for /f %%F in ('dir "C:\Windows\Prefetch\*.pf" /b 2^>nul') do del /f /q "C:\Windows\Prefetch\%%F" >nul 2>&1
echo Prefetch cleared >> "%LOGFILE%"

:: =========================
:: Step 6: Recycle Bin
:: =========================
echo [6/8] Emptying Recycle Bin...
PowerShell -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue" >nul 2>&1
echo Recycle Bin cleared >> "%LOGFILE%"

:: =========================
:: Step 7: Windows Store Cache
:: =========================
echo [7/8] Clearing Windows Store Cache...
wsreset.exe >nul 2>&1
echo Windows Store cache reset >> "%LOGFILE%"

:: =========================
:: Step 8: Network Optimization
:: =========================
echo [8/8] Flushing DNS and network caches...
ipconfig /flushdns >nul 2>&1
netsh winsock reset >nul 2>&1
netsh winhttp reset proxy >nul 2>&1
echo Network optimization completed >> "%LOGFILE%"

:: =========================
:: Final Summary
:: =========================
for /f "tokens=2 delims= " %%A in ('wmic logicaldisk where "DeviceID='C:'" get FreeSpace /value ^| find "FreeSpace"') do set FINAL_SPACE=%%A
set /a FINAL_SPACE_MB=%FINAL_SPACE%/1024/1024
set /a SPACE_FREED=%FINAL_SPACE_MB%-%INITIAL_SPACE_MB%

echo ==================================================
echo BEAST MODE Cleanup Complete!
echo Initial free space: %INITIAL_SPACE_MB% MB
echo Final free space:   %FINAL_SPACE_MB% MB
echo Total space freed:  %SPACE_FREED% MB
echo ==================================================
echo %date% %time% - Beast Mode Cleanup: %SPACE_FREED% MB freed >> "%SUMMARYFILE%"

:: Keep console alive
echo Press any key to exit...
pause >nul
exit
