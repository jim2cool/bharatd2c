
# scripts/dev-https.ps1

$CaddyVersion = "2.7.6"
$CaddyUrl = "https://github.com/caddyserver/caddy/releases/download/v$CaddyVersion/caddy_2.7.6_windows_amd64.zip"
$BinDir = "$PSScriptRoot\..\bin"
$CaddyExe = "$BinDir\caddy.exe"
$ZipFile = "$BinDir\caddy.zip"

# Create bin directory if it doesn't exist
if (-not (Test-Path -Path $BinDir)) {
    New-Item -ItemType Directory -Path $BinDir | Out-Null
    Write-Host "Created bin directory at $BinDir"
}

# Check if Caddy exists
if (-not (Test-Path -Path $CaddyExe)) {
    Write-Host "Caddy not found. Downloading version $CaddyVersion..."
    Invoke-WebRequest -Uri $CaddyUrl -OutFile $ZipFile
    
    Write-Host "Extracting Caddy..."
    Expand-Archive -Path $ZipFile -DestinationPath $BinDir -Force
    
    # Cleanup zip
    Remove-Item -Path $ZipFile
    
    # Cleanup extra files from zip if any (we only need caddy.exe)
    # Note: The zip usually contains caddy.exe and some license/readme files.
    
    Write-Host "Caddy installed successfully."
}
else {
    Write-Host "Caddy is already installed."
}

# Run Caddy
Write-Host "Stopping any existing Caddy processes..."
Get-Process caddy -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Starting Caddy in background..."
Write-Host "Please ensure 'npm run dev' is running in another terminal."
Write-Host "Your site will be available at https://localhost"

# Start Caddy using the Caddyfile in the project root
# We use Start-Process to keep it properly manageable or just run it directly
& $CaddyExe run --config "$PSScriptRoot\..\Caddyfile" --adapter caddyfile
