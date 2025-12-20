@echo off
echo Updating Profile README...
python scripts/update_readme.py
echo.
echo If successful, remember to commit and push:
echo git add README.md
echo git commit -m "Update featured projects"
echo git push
pause
