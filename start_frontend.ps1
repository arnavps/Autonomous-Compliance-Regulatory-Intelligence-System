# start_frontend.ps1
$projectRoot = Get-Location
Write-Host "Forcing startup via direct Node execution for ACRIS..." -ForegroundColor Cyan

# Use absolute path to bypass all shell quoting issues
$nextJSBin = "$projectRoot\node_modules\next\dist\bin\next"

# Call node directly on the JS file
& node "$nextJSBin" dev
