# ============================================================
#  Cleanpeace - Einrichtung (einmalig ausfuehren)
#  Rechtsklick auf die Datei -> "Mit PowerShell ausfuehren"
#  oder in PowerShell im Ordner Cleanpeace:  .\einrichten.ps1
# ============================================================
# 'Continue', weil Windows PowerShell 5.1 sonst harmlose Meldungen von git/npm als Abbruch wertet
$ErrorActionPreference = 'Continue'
Set-Location -Path $PSScriptRoot

function Schritt($nr, $text) { Write-Host "`n[$nr] $text" -ForegroundColor Cyan }
function Ok($text)   { Write-Host "    OK  $text" -ForegroundColor Green }
function Hinweis($text) { Write-Host "    !   $text" -ForegroundColor Yellow }

# 1) Agents an ihren Platz (.claude\agents)
Schritt 1 'Agents einrichten'
if (Test-Path '_agents') {
    New-Item -ItemType Directory -Force '.claude\agents' | Out-Null
    Move-Item '_agents\*.md' '.claude\agents\' -Force
    Remove-Item '_agents' -Recurse -Force
    Ok ('{0} Agents liegen jetzt in .claude\agents' -f (Get-ChildItem '.claude\agents\*.md').Count)
} else { Ok 'schon erledigt' }

# 2) Werkzeuge pruefen
Schritt 2 'Werkzeuge pruefen (Node.js, Git, GitHub-CLI)'
$node = Get-Command node -ErrorAction SilentlyContinue
$git  = Get-Command git  -ErrorAction SilentlyContinue
$gh   = Get-Command gh   -ErrorAction SilentlyContinue
if ($node) { Ok ("Node.js " + (node -v)) } else { Hinweis 'Node.js fehlt -> https://nodejs.org (LTS) installieren, dann Skript erneut starten'; exit 1 }
if ($git)  { Ok ((git --version)) }       else { Hinweis 'Git fehlt -> https://git-scm.com installieren, dann Skript erneut starten'; exit 1 }
if ($gh)   { Ok 'GitHub-CLI vorhanden' }   else { Hinweis 'GitHub-CLI (gh) fehlt - Repo-Anlage in Schritt 5 wird dann erklaert statt automatisch gemacht' }

# 3) Pakete installieren und testen
Schritt 3 'Pakete installieren und Tests laufen lassen (dauert 1-2 Minuten)'
Push-Location web
npm install
if ($LASTEXITCODE -ne 0) { Pop-Location; Hinweis 'npm install fehlgeschlagen - Meldung oben an Claude schicken'; exit 1 }
npm test
if ($LASTEXITCODE -ne 0) { Pop-Location; Hinweis 'Tests rot - Meldung oben an Claude schicken'; exit 1 }
Pop-Location
Ok 'Tests gruen'

# 4) Git-Repo anlegen
Schritt 4 'Lokales Git-Repo anlegen'
if (-not (Test-Path '.git')) {
    git init -b main | Out-Null
    git add -A
    git commit -m "M0: Geruest - Wasser, Auftrieb-Testkiste, Tests, Pages-Deploy" | Out-Null
    Ok 'erster Commit erstellt'
} else { Ok 'Repo existiert schon' }

# 5) GitHub-Repo + Pages
Schritt 5 'GitHub-Repo "cleanpeace" anlegen und hochladen'
if ($gh) {
    gh auth status 2>$null
    if ($LASTEXITCODE -ne 0) { Hinweis 'Einmal bei GitHub anmelden - Browser oeffnet sich:'; gh auth login -w }
    $remote = git remote 2>$null
    if (-not ($remote -contains 'origin')) {
        gh repo create cleanpeace --public --source . --push
    } else { git push -u origin main }
    $owner = gh api user --jq .login
    gh api -X POST "repos/$owner/cleanpeace/pages" -f build_type=workflow 2>$null | Out-Null
    Ok "Hochgeladen. In ca. 2 Minuten laeuft das Spiel unter: https://$owner.github.io/cleanpeace/"
    Write-Host "    Fortschritt ansehen: https://github.com/$owner/cleanpeace/actions"
} else {
    Hinweis 'Bitte von Hand (einmalig):'
    Write-Host '    a) https://github.com/new  -> Name: cleanpeace, Public, OHNE README -> Create'
    Write-Host '    b) Hier in PowerShell:  git remote add origin https://github.com/<DEIN-NAME>/cleanpeace.git'
    Write-Host '                            git push -u origin main'
    Write-Host '    c) Auf GitHub: Settings -> Pages -> Source: "GitHub Actions"'
}

# 6) Lokal testen im WLAN
Schritt 6 'Fertig!'
Write-Host '    Lokal im WLAN testen:  cd web ; npm run dev   -> auf dem iPad die angezeigte "Network"-Adresse oeffnen'
Write-Host '    Weiter mit Claude Code: im Ordner Cleanpeace "claude" starten.'
