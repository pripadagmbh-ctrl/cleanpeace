# ============================================================
#  Cleanpeace - Schritt 2: Auto-Deploy aktivieren (einmalig)
#  Rechtsklick -> "Mit PowerShell ausfuehren"
# ============================================================
$ErrorActionPreference = 'Continue'
Set-Location -Path $PSScriptRoot
function Ok($t)      { Write-Host "    OK  $t" -ForegroundColor Green }
function Hinweis($t) { Write-Host "    !   $t" -ForegroundColor Yellow }

Write-Host "`n[1] Deploy-Ablauf an seinen Platz schieben" -ForegroundColor Cyan
if (Test-Path '_github') {
    New-Item -ItemType Directory -Force '.github\workflows' | Out-Null
    Move-Item '_github\workflows\*' '.github\workflows\' -Force
    Remove-Item '_github' -Recurse -Force
}
if (Test-Path '.github\workflows\pages.yml') { Ok 'liegt in .github\workflows' } else { Hinweis 'pages.yml fehlt - Screenshot an Claude'; Read-Host 'Enter zum Schliessen'; exit 1 }

Write-Host "`n[2] Hochladen zu GitHub" -ForegroundColor Cyan
git add -A
git commit -m "Deploy-Ablauf fuer GitHub Pages" | Out-Null
git push
if ($LASTEXITCODE -ne 0) { Hinweis 'Hochladen fehlgeschlagen - Screenshot an Claude'; Read-Host 'Enter zum Schliessen'; exit 1 }
Ok 'hochgeladen'

Write-Host "`n[3] GitHub Pages einschalten" -ForegroundColor Cyan
$owner = 'pripadagmbh-ctrl'
if (Get-Command gh -ErrorAction SilentlyContinue) {
    gh api -X POST "repos/$owner/cleanpeace/pages" -f build_type=workflow 2>$null | Out-Null
    gh api -X PUT  "repos/$owner/cleanpeace/pages" -f build_type=workflow 2>$null | Out-Null
    Ok 'Pages auf "GitHub Actions" gestellt'
} else {
    Hinweis 'Bitte von Hand: https://github.com/pripadagmbh-ctrl/cleanpeace/settings/pages -> Source: "GitHub Actions"'
}

Write-Host "`n[4] Fertig!" -ForegroundColor Cyan
Write-Host "    In ca. 2-3 Minuten laeuft das Spiel unter:"
Write-Host "    https://$owner.github.io/cleanpeace/" -ForegroundColor Green
Write-Host "    Fortschritt (gruener Haken = fertig): https://github.com/$owner/cleanpeace/actions"
Read-Host "`nEnter zum Schliessen"
