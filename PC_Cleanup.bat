@echo off
:: ===============================
:: PC Cleanup Script - WesAI v1
:: Deletes temp files, prefetch, empties Recycle Bin
:: ===============================

echo Cleaning current user temp files...
del /s /q %temp%\* >nul 2>&1
rmdir /s /q %temp% >nul 2>&1

echo Cleaning system temp files...
del /s /q C:\Windows\Temp\* >nul 2>&1
rmdir /s /q C:\Windows\Temp >nul 2>&1

echo Cleaning Windows Prefetch...
del /s /q C:\Windows\Prefetch\* >nul 2>&1

echo Emptying Recycle Bin...
powershell.exe -NoProfile -Command "Clear-RecycleBin -Force" >nul 2>&1

echo Resetting Windows Store cache...
start /wait wsreset.exe

echo.
echo Cleanup complete!
pause
exit
