@echo off
cd /d "%~dp0"
echo Pushing the IRSPL website to GitHub...
echo.
git init
git add -A
git commit -m "Initial IRSPL website"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/Anuja-Shukla/Intelliqueresearchschool.git
git push -u origin main
echo.
echo If a browser window opened asking you to log into GitHub, approve it there.
echo Done. Press any key to close this window.
pause >nul
