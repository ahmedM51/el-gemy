@echo off
echo ========================================================
echo   El Gemy Barber Lounge - Deploy to GitHub Automator
echo ========================================================
echo.

echo [1/5] Initializing Git repository...
git init

echo [2/5] Adding all files to staging...
git add .

echo [3/5] Committing changes...
git commit -m "feat: complete El Gemy Barber Lounge platform with RBAC and Auth"

echo [4/5] Setting main branch and remote origin...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/a7medibrahem12-ship-it/el-gemy.git

echo [5/5] Pushing to GitHub...
git push -u origin main --force

echo.
echo ========================================================
echo   DONE! Your repository is now live on GitHub:
echo   https://github.com/a7medibrahem12-ship-it/el-gemy
echo ========================================================
pause
