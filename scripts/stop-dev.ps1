
# scripts/stop-dev.ps1

Write-Host "Stopping all Node.js processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Stopping all Caddy processes..."
Get-Process caddy -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Development environment stopped."
Write-Host "You can now run 'npm run dev' and 'npm run dev:https' cleanly."
