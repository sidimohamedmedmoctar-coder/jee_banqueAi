# Charge le fichier .env et lance le backend Spring Boot
$envFile = "$PSScriptRoot\.env"

if (-not (Test-Path $envFile)) {
    Write-Error "Fichier .env introuvable : $envFile"
    exit 1
}

Get-Content $envFile | Where-Object { $_ -match '^\s*[^#]\S+=\S+' } | ForEach-Object {
    $parts = $_ -split '=', 2
    $key   = $parts[0].Trim()
    $value = $parts[1].Trim()
    [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
    Write-Host "  SET $key"
}

Write-Host "`nDemarrage Spring Boot..." -ForegroundColor Green
& mvn spring-boot:run
