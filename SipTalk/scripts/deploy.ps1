# SipTalk Deployment Script (PowerShell)
# This script helps automate the deployment process on Windows

$ErrorActionPreference = "Stop"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  SipTalk Deployment Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
function Check-Prerequisites {
    Write-Host "Checking prerequisites..." -ForegroundColor Yellow
    
    if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Docker not found. Please install Docker." -ForegroundColor Red
        exit 1
    }
    
    if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Docker Compose not found. Please install Docker Compose." -ForegroundColor Red
        exit 1
    }
    
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Git not found. Please install Git." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ All prerequisites met!" -ForegroundColor Green
    Write-Host ""
}

# Setup environment
function Setup-Environment {
    Write-Host "Setting up environment..." -ForegroundColor Yellow
    
    if (!(Test-Path .env)) {
        Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
        Copy-Item env.template .env
        Write-Host "✅ .env file created. Please edit it with your values." -ForegroundColor Green
        Write-Host ""
        Read-Host "Press Enter to continue after editing .env"
    } else {
        Write-Host "✅ .env file found." -ForegroundColor Green
    }
    Write-Host ""
}

# Build Docker images
function Build-Docker {
    Write-Host "Building Docker images..." -ForegroundColor Yellow
    docker-compose build
    Write-Host "✅ Docker images built successfully!" -ForegroundColor Green
    Write-Host ""
}

# Start services
function Start-Services {
    Write-Host "Starting services..." -ForegroundColor Yellow
    docker-compose up -d
    Write-Host "✅ Services started!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Waiting for services to be healthy..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    docker-compose ps
    Write-Host ""
}

# Import database
function Import-Database {
    Write-Host "Importing database schema..." -ForegroundColor Yellow
    
    $response = Read-Host "Do you want to import the database schema? (y/n)"
    
    if ($response -eq 'y' -or $response -eq 'Y') {
        Get-Content database\sip_talk_postgres.sql | docker-compose exec -T postgres psql -U postgres -d sip_talk_db
        Write-Host "✅ Database schema imported!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Skipping database import." -ForegroundColor Yellow
    }
    Write-Host ""
}

# Test deployment
function Test-Deployment {
    Write-Host "Testing deployment..." -ForegroundColor Yellow
    
    Write-Host "Checking health endpoint..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/health.php" -UseBasicParsing
        if ($response.Content -match "healthy") {
            Write-Host "✅ Backend is healthy!" -ForegroundColor Green
        } else {
            Write-Host "❌ Backend health check failed!" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Could not reach backend!" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Access your app:" -ForegroundColor Cyan
    Write-Host "  Frontend + Backend: http://localhost:8080" -ForegroundColor White
    Write-Host "  pgAdmin: http://localhost:5050 (if dev profile)" -ForegroundColor White
    Write-Host ""
}

# Push to GitHub
function Push-ToGitHub {
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    
    $response = Read-Host "Do you want to commit and push to GitHub? (y/n)"
    
    if ($response -eq 'y' -or $response -eq 'Y') {
        $commitMessage = Read-Host "Enter commit message"
        
        git add .
        git commit -m "$commitMessage"
        git push origin main
        
        Write-Host "✅ Pushed to GitHub!" -ForegroundColor Green
        Write-Host "Render and Netlify will auto-deploy on push." -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Skipping GitHub push." -ForegroundColor Yellow
    }
    Write-Host ""
}

# Main menu
function Show-Menu {
    Write-Host "What would you like to do?" -ForegroundColor Cyan
    Write-Host "1. Full deployment (build + start + import)"
    Write-Host "2. Build Docker images only"
    Write-Host "3. Start services"
    Write-Host "4. Import database"
    Write-Host "5. Test deployment"
    Write-Host "6. Push to GitHub"
    Write-Host "7. Stop services"
    Write-Host "8. Clean up (remove all containers and volumes)"
    Write-Host "9. Exit"
    Write-Host ""
    
    $choice = Read-Host "Enter your choice (1-9)"
    Write-Host ""
    
    switch ($choice) {
        '1' {
            Check-Prerequisites
            Setup-Environment
            Build-Docker
            Start-Services
            Import-Database
            Test-Deployment
            Push-ToGitHub
        }
        '2' { Build-Docker }
        '3' { Start-Services }
        '4' { Import-Database }
        '5' { Test-Deployment }
        '6' { Push-ToGitHub }
        '7' {
            Write-Host "Stopping services..." -ForegroundColor Yellow
            docker-compose down
            Write-Host "✅ Services stopped!" -ForegroundColor Green
        }
        '8' {
            Write-Host "⚠️  This will remove all containers and data!" -ForegroundColor Red
            $confirm = Read-Host "Are you sure? (y/n)"
            if ($confirm -eq 'y' -or $confirm -eq 'Y') {
                docker-compose down -v
                Write-Host "✅ Cleanup complete!" -ForegroundColor Green
            }
        }
        '9' {
            Write-Host "Goodbye!" -ForegroundColor Cyan
            exit 0
        }
        default {
            Write-Host "❌ Invalid choice!" -ForegroundColor Red
        }
    }
}

# Run main menu
Show-Menu

