@echo off
:: =====================================================
:: BEAST MODE PC Cleanup & Optimization Script v3.0
:: Full ops cleanup with color console output, metrics, and logging
:: Does not exit until user presses a key
:: =====================================================

:: Enable delayed expansion
setlocal enabledelayedexpansion

:: -------------------
:: Color settings
:: -------------------
:: 0 = Black, 1 = Blue, 2 = Green, 3 = Aqua, 4 = Red, 5 = Purple, 6 = Yellow, 7 = White
:: 8 = Gray, 9 = Light Blue, A = Light Green, C = Light Red, E = Light Yellow
color 0E

:: -------------------
:: Log setup
:: -------------------
set LOGFILE=%~dp0BeastModeCleanup_%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%.txt
set SUMMARYFILE=%~dp0CleanupSummary_%date:~10,4%-%date:~4,2%-%date:~7,2%.txt

:: Initialize freed space variables
set TOTAL_FREED=0
set TEMP_FREED=0
set BROWSER_FREED=0
set UPDATE_FREED=0
set LOG_FREED=0

echo ==================================================
echo BEAST MODE Cleanup Run on %date% at %time%
echo ==================================================
echo Starting Beast Mode PC Cleanup & Optimization...
echo.

:: -------------------
:: Initial disk space
:: -------------------
for /f "tokens=2 delims= " %%A in ('wmic logicaldisk where "DeviceID='C:'" get FreeSpace /value ^| find "FreeSpace"') do set INITIAL_SPACE=%%A
set /a INITIAL_SPACE_MB=%INITIAL_SPACE%/1024/1024

:: ===================
:: 1. TEMP FILES
:: ===================
echo [1/8] Deleting Temp Files...
echo --------------------------------
:: User temp
set /a TEMP_SIZE=0
for /f "usebackq tokens=3" %%A in (`dir "%TEMP%" /s 2^>nul ^| find "File(s)"`) do set /a TEMP_SIZE=%%A/1024
echo Estimated Temp size: !TEMP_SIZE! KB
:: Delete files
for /f "usebackq delims=" %%F in (`dir "%TEMP%\*" /a-d /b 2^>nul`) do (
    del /f /q "%TEMP%\%%F" >nul 2>&1
)
:: Delete directories
for /d %%p in ("%TEMP%\*.*") do (
    rmdir "%%p" /s /q >nul 2>&1
)
set /a TEMP_FREED=!TEMP_SIZE!/1024
echo Temp cleanup completed: ~!TEMP_FREED! MB freed
echo Temp cleanup completed: ~!TEMP_FREED! MB freed >> "%LOGFILE%"
echo.

:: ===================
:: 2. Browser Cache
:: ===================
echo [2/8] Clearing Browser Caches...
set /a BROWSER_TOTAL=0
:: Chrome
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" (
    for /f %%B in ('PowerShell -Command "(Get-ChildItem -Path ''%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache'' -Recurse -File | Measure-Object -Property Length -Sum).Sum"') do set CHROME_SIZE=%%B
    if defined CHROME_SIZE set /a BROWSER_TOTAL+=CHROME_SIZE/1024/1024
    rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" >nul 2>&1
)
:: Firefox
if exist "%LOCALAPPDATA%\Mozilla\Firefox\Profiles" (
    for /d %%p in ("%LOCALAPPDATA%\Mozilla\Firefox\Profiles\*.*") do (
        if exist "%%p\cache2\entries" (
            for /f %%B in ('PowerShell -Command "(Get-ChildItem -Path ''%%p\cache2\entries'' -Recurse -File | Measure-Object -Property Length -Sum).Sum"') do set FF_SIZE=%%B
            if defined FF_SIZE set /a BROWSER_TOTAL+=FF_SIZE/1024/1024
            rd /s /q "%%p\cache2\entries" >nul 2>&1
        )
    )
)
:: Edge
if exist "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" (
    for /f %%B in ('PowerShell -Command "(Get-ChildItem -Path ''%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache'' -Recurse -File | Measure-Object -Property Length -Sum).Sum"') do set EDGE_SIZE=%%B
    if defined EDGE_SIZE set /a BROWSER_TOTAL+=EDGE_SIZE/1024/1024
    rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" >nul 2>&1
)
set /a BROWSER_FREED=!BROWSER_TOTAL!
echo Browser cache cleanup completed: ~!BROWSER_FREED! MB freed
echo Browser cache cleanup completed: ~!BROWSER_FREED! MB freed >> "%LOGFILE%"
echo.

:: ===================
:: 3. Windows Update Cleanup
:: ===================
echo [3/8] Cleaning Windows Update & SoftwareDistribution...
dism /online /Cleanup-Image /StartComponentCleanup /NoRestart >nul 2>&1
dism /online /Cleanup-Image /SPSuperseded /NoRestart >nul 2>&1
net stop wuauserv >nul 2>&1
if exist "C:\Windows\SoftwareDistribution\Download" rd /s /q "C:\Windows\SoftwareDistribution\Download" >nul 2>&1
net start wuauserv >nul 2>&1
echo Windows Update cleanup completed >> "%LOGFILE%"
echo.

:: ===================
:: 4. Event Logs
:: ===================
echo [4/8] Clearing Event Logs...
for /f "tokens=*" %%i in ('wevtutil el') do wevtutil cl "%%i" >nul 2>&1
echo Event logs cleared >> "%LOGFILE%"
echo.

:: ===================
:: 5. Windows Logs
:: ===================
echo [5/8] Clearing Windows Logs...
if exist "C:\Windows\Logs" (
    for /f "usebackq delims=" %%F in (`dir "C:\Windows\Logs\*" /a-d /b 2^>nul`) do del /f /q "C:\Windows\Logs\%%F" >nul 2>&1
)
echo Windows logs cleared >> "%LOGFILE%"
echo.

:: ===================
:: 6. Prefetch
:: ===================
echo [6/8] Clearing Prefetch...
for /f "usebackq delims=" %%F in (`dir "C:\Windows\Prefetch\*.pf" /b 2^>nul`) do del /f /q "C:\Windows\Prefetch\%%F" >nul 2>&1
echo Prefetch files cleared >> "%LOGFILE%"
echo.

:: ===================
:: 7. Recycle Bin & Store
:: ===================
echo [7/8] Emptying Recycle Bin & Resetting Windows Store...
PowerShell.exe -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue" >nul 2>&1
wsreset.exe >nul 2>&1
echo Recycle Bin and Windows Store cache cleared >> "%LOGFILE%"
echo.

:: ===================
:: 8. Network Optimization
:: ===================
echo [8/8] Flushing DNS & Winsock...
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

set /a TOTAL_FREED=%TEMP_FREED%+%BROWSER_FREED%
echo ==================================================
echo BEAST MODE Cleanup Complete!
echo Initial free space: %INITIAL_SPACE_MB% MB
echo Final free space:   %FINAL_SPACE_MB% MB
echo Total space freed:  %SPACE_FREED% MB
echo Temp files:         %TEMP_FREED% MB
echo Browser cache:      %BROWSER_FREED% MB
echo ==================================================
echo %date% %time% - Beast Mode Cleanup: %SPACE_FREED% MB freed >> "%SUMMARYFILE%"
echo Press any key to exit...
pause >nul
