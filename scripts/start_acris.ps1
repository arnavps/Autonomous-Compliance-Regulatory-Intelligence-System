# start_acris.ps1
# Unified startup script for ACRIS Infrastructure

$projectRoot = Get-Location
Write-Host "--- ACRIS Unified Infrastructure Startup ---" -ForegroundColor Cyan

# 1. Start Redis
Write-Host "[1/4] Starting Redis Server..." -ForegroundColor Yellow
Start-Process ".\bin\redis\redis-server.exe" -ArgumentList ".\bin\redis\redis.windows.conf" -WindowStyle Hidden

# 2. Start Celery Worker
Write-Host "[2/4] Starting Celery Worker..." -ForegroundColor Yellow
Start-Process "python" -ArgumentList ".\scripts\start_celery_worker.py" -NoNewWindow

# 3. Start FastAPI Backend
Write-Host "[3/4] Starting FastAPI Backend (Port 8000)..." -ForegroundColor Yellow
Start-Process "python" -ArgumentList "-m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000" -NoNewWindow

# 4. Start Next.js Frontend
Write-Host "[4/4] Starting Next.js Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process "pwsh" -ArgumentList "-File .\scripts\start_frontend.ps1" -NoNewWindow

Write-Host "`nACRIS is initializing. Dashboard will be available at http://localhost:3000" -ForegroundColor Green
Write-Host "Backend API Health: http://localhost:8000/health" -ForegroundColor Green
Write-Host "--- Initialization Complete ---" -ForegroundColor Cyan
