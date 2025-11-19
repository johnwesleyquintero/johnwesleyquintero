@echo off
:: =====================================================
:: BEAST MODE PC Cleanup & Optimization Script v4.0
:: Full ops cleanup with color console, progress bars, logging
:: Does not exit until user presses a key
:: =====================================================

setlocal enabledelayedexpansion
color 0E

:: -------------------
:: Log setup
:: -------------------
set LOGFILE=%~dp0BeastModeCleanup_%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%.txt
set SUMMARYFILE=%~dp0CleanupSummary_%date:~10,4%-%date:~4,2%-%date:~7,2%.txt

:: -------------------
:: Disk space
:: -------------------
for /f "tokens=2 delims= " %%A in ('wmic logicaldisk where "DeviceID='C:'" get FreeSpace /value ^| find "FreeSpace"') do set INITIAL_SPACE=%%A
set /a INITIAL_SPACE_MB=%INITIAL_SPACE%/1024/1024

echo ==================================================
echo BEAST MODE Cleanup Run on %date% at %time%
echo ==================================================
echo Starting Beast Mode PC Cleanup & Optimization...
echo.

:: -------------------
:: Function: Display progress bar
:: -------------------
:progress
:: %1 = current, %2 = total, %3 = description
set /a percent=(%1*100)/%2
set "bar=["
set /a fill=(percent/2)
for /L %%i in (1,1,!fill!) do set "bar=!bar!#"
for /L %%i in (!fill!,1,50) do set "bar=!bar! "
set "bar=!bar!] !percent!%% %3"
<nul set /p="!bar!`r"
goto :eof

:: ===================
:: 1. TEMP FILES
:: ===================
echo [1/8] Deleting Temp Files...
set /a TEMP_FREED=0
set TEMP_DIRS=%TEMP%\*

:: Get list of files first
for /f "delims=" %%F in ('dir "%TEMP_DIRS%" /b /a-d 2^>nul') do (
    set /a i+=1
    set FILES[!i!]=%%F
)
set TOTAL_FILES=!i!

:: Delete files with progress
set /a count=0
for /L %%i in (1,1,!TOTAL_FILES!) do (
    del /f /q "%TEMP_DIRS%\!FILES[%%i]!" >nul 2>&1
    set /a count+=1
    call :progress !count! !TOTAL_FILES! Temp Files
)
echo.
rd /s /q "%TEMP%" >nul 2>&1
echo Temp cleanup completed >> "%LOGFILE%"
echo.

:: ===================
:: 2. Browser Cache
:: ===================
echo [2/8] Clearing Browser Caches...
set /a BROWSER_FREED=0

:: Chrome
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" (
    set CHROME_CACHE=%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache
    for /f "delims=" %%F in ('dir "%CHROME_CACHE%" /b /a-d 2^>nul') do (
        del /f /q "%CHROME_CACHE%\%%F" >nul 2>&1
        set /a BROWSER_FREED+=1
        call :progress !BROWSER_FREED! 100 Chrome Cache
    )
    rd /s /q "%CHROME_CACHE%" >nul 2>&1
)
echo.
echo Browser cache cleanup completed >> "%LOGFILE%"
echo.

:: ===================
:: 3. Windows Update
:: ===================
echo [3/8] Cleaning Windows Update & SoftwareDistribution...
dism /online /Cleanup-Image /StartComponentCleanup /NoRestart >nul 2>&1
net stop wuauserv >nul 2>&1
set /a UPDATE_COUNT=0
for /f "delims=" %%F in ('dir "C:\Windows\SoftwareDistribution\Download" /b /a-d 2^>nul') do (
    del /f /q "C:\Windows\SoftwareDistribution\Download\%%F" >nul 2>&1
    set /a UPDATE_COUNT+=1
    call :progress !UPDATE_COUNT! 100 Updates
)
net start wuauserv >nul 2>&1
echo.
echo Windows Update cleanup completed >> "%LOGFILE%"
echo.

:: ===================
:: Remaining steps (logs, prefetch, recycle bin, network) can just echo
:: ===================
echo [4/8] Clearing Event Logs...
for /f "tokens=*" %%i in ('wevtutil el') do wevtutil cl "%%i" >nul 2>&1
echo Event logs cleared >> "%LOGFILE%"
echo.

echo [5/8] Clearing Windows Logs...
if exist "C:\Windows\Logs" (
    for /f "usebackq delims=" %%F in (`dir "C:\Windows\Logs\*" /a-d /b 2^>nul`) do del /f /q "C:\Windows\Logs\%%F" >nul 2>&1
)
echo Windows logs cleared >> "%LOGFILE%"
echo.

echo [6/8] Clearing Prefetch...
for /f "usebackq delims=" %%F in (`dir "C:\Windows\Prefetch\*.pf" /b 2^>nul`) do del /f /q "C:\Windows\Prefetch\%%F" >nul 2>&1
echo Prefetch files cleared >> "%LOGFILE%"
echo.

echo [7/8] Emptying Recycle Bin & Resetting Windows Store...
PowerShell.exe -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue" >nul 2>&1
wsreset.exe >nul 2>&1
echo Recycle Bin and Windows Store cache cleared >> "%LOGFILE%"
echo.

echo [8/8] Network Optimization...
ipconfig /flushdns
netsh winsock reset >nul 2>&1
netsh winhttp reset proxy >nul 2>&1
echo Network optimization completed >> "%LOGFILE%"
echo.

:: ===================
:: Final Summary
:: ===================
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
echo Press any key to exit...
pause >nul
