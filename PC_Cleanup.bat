@echo off
:: =====================================================
:: BEAST MODE PC Cleanup & Optimization Script v2.0
:: Comprehensive system maintenance with logging, metrics, and deep optimization
:: Handles temp files, browsers, Windows updates, logs, network, and performance
:: =====================================================

set LOGFILE=%~dp0BeastModeCleanup_%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%.txt
set SUMMARYFILE=%~dp0CleanupSummary_%date:~10,4%-%date:~4,2%-%date:~7,2%.txt

:: Initialize variables
set TOTAL_FREED=0
set TEMP_FREED=0
set BROWSER_FREED=0
set UPDATE_FREED=0
set LOG_FREED=0

echo ================================================== >> "%LOGFILE%"
echo BEAST MODE Cleanup Run on %date% at %time% >> "%LOGFILE%"
echo ================================================== >> "%LOGFILE%"
echo Starting Beast Mode PC Cleanup & Optimization...
echo ==================================================

:: Get initial disk space before cleanup
for /f "tokens=2 delims= " %%A in ('wmic logicaldisk where "DeviceID='C:'" get FreeSpace /value ^| find "FreeSpace"') do set INITIAL_SPACE=%%A
set /a INITIAL_SPACE_MB=%INITIAL_SPACE%/1024/1024

:: ---- Clear Temporary Files (Enhanced) ----
echo [1/8] Deleting Temp Files...
set TEMPSIZE=0
set TEMPSIZE_MB=0

:: Calculate initial temp size
for /f "usebackq tokens=3" %%A in (`dir "%TEMP%" /s 2^>nul ^| find "File(s)" 2^>nul`) do (
    set TEMPSIZE=%%A
    if defined TEMPSIZE (
        set /a TEMPSIZE_MB=!TEMPSIZE!/1024
    )
)

:: Delete temp files with error handling
for /f "usebackq delims=" %%F in (`dir "%TEMP%\*" /a-d /b 2^>nul`) do (
    if exist "%TEMP%\%%F" (
        del /f /q "%TEMP%\%%F" >nul 2>&1
        if errorlevel 1 (
            echo [TEMP] Cannot delete (in use): %%F >> "%LOGFILE%"
        ) else (
            echo [TEMP] Deleted: %%F >> "%LOGFILE%"
        )
    )
)

:: Delete temp directories with error handling
for /d %%p in ("%TEMP%\*.*") do (
    if exist "%%p" (
        rmdir "%%p" /s /q >nul 2>&1
        if errorlevel 1 (
            echo [TEMP] Cannot delete directory (in use): %%p >> "%LOGFILE%"
        ) else (
            echo [TEMP] Deleted directory: %%p >> "%LOGFILE%"
        )
    )
)

:: Also clear Windows temp
for /f "usebackq delims=" %%F in (`dir "C:\Windows\Temp\*" /a-d /b 2^>nul`) do (
    if exist "C:\Windows\Temp\%%F" (
        del /f /q "C:\Windows\Temp\%%F" >nul 2>&1
        if errorlevel 1 (
            echo [WINTMP] Cannot delete (in use): %%F >> "%LOGFILE%"
        ) else (
            echo [WINTMP] Deleted: %%F >> "%LOGFILE%"
        )
    )
)

set /a TEMP_FREED=%TEMPSIZE_MB%
echo Temp cleanup completed: ~%TEMPSIZE_MB% MB freed >> "%LOGFILE%"

:: ---- Full Browser Coverage ----
echo [2/8] Clearing Browser Caches...
set BROWSER_TOTAL=0

:: Chrome
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" (
    for /f %%B in ('PowerShell -Command "(Get-ChildItem -Path '%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache' -Recurse -ErrorAction SilentlyContinue -File | Measure-Object -Property Length -Sum).Sum" 2^>nul') do set CHROME_SIZE=%%B
    if defined CHROME_SIZE (
        set /a CHROME_MB=!CHROME_SIZE!/1024/1024
        set /a BROWSER_TOTAL=!BROWSER_TOTAL!+!CHROME_MB!
        echo [CHROME] Cache size: !CHROME_MB! MB >> "%LOGFILE%"
        rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" >nul 2>&1
    )
)

:: Firefox
if exist "%LOCALAPPDATA%\Mozilla\Firefox\Profiles" (
    for /d %%p in ("%LOCALAPPDATA%\Mozilla\Firefox\Profiles\*.*") do (
        if exist "%%p\cache2\entries" (
            for /f %%B in ('PowerShell -Command "(Get-ChildItem -Path '%%p\cache2\entries' -Recurse -ErrorAction SilentlyContinue -File | Measure-Object -Property Length -Sum).Sum" 2^>nul') do set FF_SIZE=%%B
            if defined FF_SIZE (
                set /a FF_MB=!FF_SIZE!/1024/1024
                set /a BROWSER_TOTAL=!BROWSER_TOTAL!+!FF_MB!
                echo [FIREFOX] Cache size: !FF_MB! MB >> "%LOGFILE%"
                rd /s /q "%%p\cache2\entries" >nul 2>&1
            )
        )
    )
)

:: Edge
if exist "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" (
    for /f %%B in ('PowerShell -Command "(Get-ChildItem -Path '%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache' -Recurse -ErrorAction SilentlyContinue -File | Measure-Object -Property Length -Sum).Sum" 2^>nul') do set EDGE_SIZE=%%B
    if defined EDGE_SIZE (
        set /a EDGE_MB=!EDGE_SIZE!/1024/1024
        set /a BROWSER_TOTAL=!BROWSER_TOTAL!+!EDGE_MB!
        echo [EDGE] Cache size: !EDGE_MB! MB >> "%LOGFILE%"
        rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" >nul 2>&1
    )
)

set /a BROWSER_FREED=%BROWSER_TOTAL%
echo Browser cleanup completed: ~%BROWSER_TOTAL% MB freed >> "%LOGFILE%"

:: ---- Windows Update Cleanup ----
echo [3/8] Clearing Windows Update Files...
set UPDATE_SIZE=0

:: Use DISM for Windows update cleanup
dism /online /Cleanup-Image /StartComponentCleanup /NoRestart >nul 2>&1
dism /online /Cleanup-Image /SPSuperseded /NoRestart >nul 2>&1

:: Clean SoftwareDistribution folder (if Windows Update service is stopped)
net stop wuauserv >nul 2>&1
net stop cryptSvc >nul 2>&1
net stop bits >nul 2>&1
net stop msiserver >nul 2>&1

if exist "C:\Windows\SoftwareDistribution\Download" (
    for /f %%B in ('PowerShell -Command "(Get-ChildItem -Path 'C:\Windows\SoftwareDistribution\Download' -Recurse -ErrorAction SilentlyContinue -File | Measure-Object -Property Length -Sum).Sum" 2^>nul') do set UPDATE_SIZE=%%B
    if defined UPDATE_SIZE (
        set /a UPDATE_MB=!UPDATE_SIZE!/1024/1024
        set /a UPDATE_FREED=!UPDATE_MB!
        rd /s /q "C:\Windows\SoftwareDistribution\Download" >nul 2>&1
        echo [UPDATE] Cleanup: !UPDATE_MB! MB freed >> "%LOGFILE%"
    )
)

:: Restart services
net start wuauserv >nul 2>&1
net start cryptSvc >nul 2>&1
net start bits >nul 2>&1
net start msiserver >nul 2>&1

:: Clean Windows Temp
for /f "usebackq delims=" %%F in (`dir "C:\Windows\Temp\*" /a-d /b 2^>nul`) do (
    del /f /q "C:\Windows\Temp\%%F" >nul 2>&1
)
echo Windows update cleanup completed >> "%LOGFILE%"

:: ---- Event Logs Cleanup ----
echo [4/8] Clearing Event Logs...
for /f "tokens=*" %%i in ('wevtutil el') do (
    wevtutil cl "%%i" >nul 2>&1
)
echo Event logs cleared >> "%LOGFILE%"

:: ---- Clear Windows Logs ----
echo [5/8] Clearing Windows Logs...
if exist "C:\Windows\Logs" (
    for /f "usebackq delims=" %%F in (`dir "C:\Windows\Logs\*" /a-d /b 2^>nul`) do (
        del /f /q "C:\Windows\Logs\%%F" >nul 2>&1
    )
)
echo Windows logs cleared >> "%LOGFILE%"

:: ---- Clear Prefetch ----
echo [6/8] Clearing Prefetch Files...
for /f "usebackq delims=" %%F in (`dir "C:\Windows\Prefetch\*.pf" /b 2^>nul`) do (
    del /f /q "C:\Windows\Prefetch\%%F" >nul 2>&1
)
echo Prefetch files cleared >> "%LOGFILE%"

:: ---- Empty Recycle Bin ----
echo [7/8] Emptying Recycle Bin...
PowerShell.exe -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue" 2>nul
echo Recycle Bin cleared >> "%LOGFILE%"

:: ---- Clear Windows Store Cache ----
echo [8/8] Clearing Windows Store Cache...
wsreset.exe >nul 2>&1
echo Windows Store cache reset >> "%LOGFILE%"

:: ---- Network Optimization ----
echo Flushing network caches...
ipconfig /flushdns
netsh winsock reset >nul 2>&1
netsh winhttp reset proxy >nul 2>&1
echo Network optimization completed >> "%LOGFILE%"

:: ---- Get final disk space ----
for /f "tokens=2 delims= " %%A in ('wmic logicaldisk where "DeviceID='C:'" get FreeSpace /value ^| find "FreeSpace"') do set FINAL_SPACE=%%A
set /a FINAL_SPACE_MB=%FINAL_SPACE%/1024/1024
set /a SPACE_FREED=%FINAL_SPACE_MB%-%INITIAL_SPACE_MB%

:: ---- Summary and Logging ----
set /a TOTAL_FREED=%TEMP_FREED%+%BROWSER_FREED%+%UPDATE_FREED%
echo ==================================================
echo Beast Mode Cleanup Complete!
echo ==================================================
echo Initial free space: %INITIAL_SPACE_MB% MB
echo Final free space:   %FINAL_SPACE_MB% MB
echo Total space freed:  %SPACE_FREED% MB
echo ==================================================
echo Temp files:         %TEMP_FREED% MB
echo Browser cache:      %BROWSER_FREED% MB  
echo Updates/Logs:       %UPDATE_FREED% MB
echo ==================================================

:: Write summary to log
echo Beast Mode Cleanup Summary >> "%LOGFILE%"
echo Initial free space: %INITIAL_SPACE_MB% MB >> "%LOGFILE%"
echo Final free space: %FINAL_SPACE_MB% MB >> "%LOGFILE%"
echo Total space freed: %SPACE_FREED% MB >> "%LOGFILE%"
echo Components: Temp=%TEMP_FREED% MB, Browser=%BROWSER_FREED% MB, Updates=%UPDATE_FREED% MB >> "%LOGFILE%"

:: Write to daily summary file
echo %date% %time% - Beast Mode Cleanup: %SPACE_FREED% MB freed >> "%SUMMARYFILE%"

:: Optional: Defragment (only if not SSD)
for /f "tokens=4" %%a in ('wmic diskdrive where "Caption like '%%C:%%'" get MediaType /value') do set "MediaType=%%a"
if not "%MediaType%"=="SSD" (
    echo Running defragmentation (not SSD detected)...
    defrag C: /H /V >nul 2>&1
    echo Defragmentation completed >> "%LOGFILE%"
)

echo Beast Mode cleanup complete! Press any key to exit...
pause >nul
