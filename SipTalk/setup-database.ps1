# PowerShell Script to Setup Sip & Talk Database
# Run this script to automatically copy backend files

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Sip & Talk - Database Setup Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if running from correct directory
$currentPath = Get-Location
if (-not (Test-Path "backend")) {
    Write-Host "ERROR: Please run this script from the SipTalk directory!" -ForegroundColor Red
    Write-Host "Current location: $currentPath" -ForegroundColor Yellow
    exit 1
}

# Define paths
$backendSource = ".\backend\*.php"
$backendDest = ".."
$htaccessSource = ".\backend\.htaccess"

Write-Host "Step 1: Copying PHP backend files..." -ForegroundColor Yellow

try {
    # Copy PHP files
    Copy-Item $backendSource $backendDest -Force
    Write-Host "  ✓ PHP files copied successfully!" -ForegroundColor Green
    
    # Copy .htaccess
    if (Test-Path $htaccessSource) {
        Copy-Item $htaccessSource $backendDest -Force
        Write-Host "  ✓ .htaccess copied successfully!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Step 2: Verifying files..." -ForegroundColor Yellow
    
    $files = @("db.php", "login.php", "register.php", "logout.php", "reservation.php", "contact.php", "feedback.php")
    $allCopied = $true
    
    foreach ($file in $files) {
        $destFile = Join-Path $backendDest $file
        if (Test-Path $destFile) {
            Write-Host "  ✓ $file" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $file NOT FOUND" -ForegroundColor Red
            $allCopied = $false
        }
    }
    
    Write-Host ""
    
    if ($allCopied) {
        Write-Host "============================================" -ForegroundColor Green
        Write-Host "  Backend files copied successfully!" -ForegroundColor Green
        Write-Host "============================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Open XAMPP Control Panel" -ForegroundColor White
        Write-Host "2. Start Apache and MySQL" -ForegroundColor White
        Write-Host "3. Go to http://localhost/phpmyadmin" -ForegroundColor White
        Write-Host "4. Import database/sip_talk_db.sql" -ForegroundColor White
        Write-Host "5. Run: npm run dev" -ForegroundColor White
        Write-Host ""
        Write-Host "For detailed instructions, see:" -ForegroundColor Yellow
        Write-Host "  - QUICK_START.md" -ForegroundColor White
        Write-Host "  - DATABASE_SETUP.md" -ForegroundColor White
    } else {
        Write-Host "ERROR: Some files were not copied!" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "ERROR: Failed to copy files!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

