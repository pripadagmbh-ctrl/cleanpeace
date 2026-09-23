# CLAUDE.md — Cleanpeace: Save the World

> Masterprompt für Claude Code. Diese Datei liegt im Projekt-Wurzelordner und wird bei jeder Sitzung automatisch gelesen.
> Du (Claude, Hauptsitzung) bist der **Orchestrator**: Du planst, verteilst Aufgaben an Subagents, prüfst Ergebnisse und sprichst mit dem Produzenten (dem Nutzer). Du schreibst Code nur selbst, wenn die Aufgabe klein ist (< ~30 Zeilen) oder kein Agent passt.

---

## 1. Vision

**Cleanpeace** ist eine Mobile-Spielreihe, in der der Spieler Gewässer von Müll befreit und Meerestiere rettet — mit Schiffen, U-Booten/Tauchrobotern (ROV) und Tauchern. Teil 1 beginnt in einem Küstenhafen am Mittelmeer; Binnengewässer (Seen, Flüsse) und offene Weltmeere folgen als weitere Missionen.

- **Gefühl:** ruhig, befriedigend, „glaubwürdig, aber verzeihend". Das Wasser wird sichtbar sauberer, Tiere kehren zurück — das ist die Belohnung.
- **Ton:** hoffnungsvoll, nie belehrend. Echtes Wissen steckt im Spiel (Geisternetze, Mikroplastik, reale Säuberungstechnik), aber als Entdeckung, nicht als Vortrag.
- **Zielgruppe:** Familie / Gelegenheitsspieler, ab ca. 8 Jahren spielbar, trotzdem mit Tiefe.
- **Look:** 3D stilisiert (Low-Poly, klare Farben, weiche Unterwasser-Lichtstimmung). Kein Fotorealismus.

## 2. Vertical Slice (erstes Ziel — NICHTS darüber hinaus bauen, bevor abgenommen)

**Mission 1: „Das Hafenbecken"** (kleiner Küstenhafen am Mittelmeer, ca. 150 × 150 m)

| Element | Umfang |
|---|---|
| Fahrzeuge | 1 Arbeitsboot (Oberfläche, Kescher/Greifarm, Schwimmbarriere auslegen) + 1 Taucher (unter Wasser, Handbergung, Netz schneiden) |
| Müllsorten | 4: Plastikflaschen/Treibgut (schwimmt), Einkaufswagen/Fahrrad (Grund, schwer → Hebesack), Geisternetz (verheddert, schneiden), Ölfilm (Barriere + Abschöpfen) |
| Tierrettung | 1: Unechte Karettschildkröte im Geisternetz — vorsichtig schneiden, sonst Stress-Anzeige steigt |
| Fortschritt | Sauberkeits-Anzeige des Beckens 0–100 %; Wasser wird sichtbar klarer, Fische tauchen auf |
| Sitzungslänge | sanfter Arbeitstag, ca. 8 Minuten (kein Scheitern; was übrig bleibt, wartet auf den nächsten Tag) |
| Wirtschaft | nur Punkte zählen und anzeigen (Upgrades später) |
| Tutorial | kurz, eingebettet in die ersten 2 Minuten |

**Abnahmekriterien Slice:** läuft mit 60 fps auf dem iPad (Leitgerät), ≥ 30 fps auf iPhone mini, Touch-Steuerung ohne überlappende Knöpfe, ein kompletter Einsatz von Start bis Bilanz ohne Absturz, Autosave funktioniert.

## 3. Technik-Stack (fest — Änderung nur per Entscheidungseintrag)

- **Sprache/Build:** TypeScript (strict), Vite
- **3D:** Three.js (WebGL2), eigene stilisierte Shader für Wasser, Unterwasser-Nebel, Kaustiken
- **Physik:** Rapier (WASM) — Auftrieb wird selbst als Kraft berechnet (Rapier hat kein Wasser)
- **Tests:** Vitest (Logik), Playwright (Rauchtest + Layout-Tests für Touch)
- **Speichern:** IndexedDB (Autosave) + Export/Import als Datei
- **Deploy:** eigenes GitHub-Repo `cleanpeace` mit GitHub Pages (Test auf echten Geräten per Link); später Capacitor für App-Stores (Google Play zuerst, iOS über Cloud-Build — kein Mac vorhanden)
- **Entwicklungsrechner:** Windows-PC, PowerShell. Befehle immer Windows-tauglich angeben.
- **Testgeräte:** iPad (Leitgerät), iPhone mini. Kein Android-Gerät greifbar.

### Architektur-Grundsätze
- **Simulation getrennt von Darstellung.** `src/sim/` kennt kein Three.js; `src/render/` liest nur den Zustand. So ist die Logik testbar und später portierbar.
- **Systeme statt Gott-Objekte:** `WaterSystem`, `BuoyancySystem`, `VesselSystem`, `DiverSystem`, `DebrisSystem`, `WildlifeSystem`, `MissionSystem`, `CleanlinessSystem`, `InputSystem`, `SaveSystem`, `AudioSystem`.
- **Daten in JSON/TS-Konfig**, nicht im Code verstreut (Müllsorten, Tiere, Missionen).
- **Leistungsbudget (iPad):** ≤ 100 Draw Calls, ≤ 300k Dreiecke sichtbar, Physik ≤ 4 ms, max. 150 wache Physikkörper, Texturen ≤ 1024 px, Instancing für gleichartigen Müll.
- **Kernelemente mit Vorrang bei der Rechenleistung:** (1) Wasser/Auftrieb-Gefühl, (2) die Rettungsmomente (Netz schneiden, Tier befreien). Alles andere darf bei Bedarf reduziert werden.

## 4. Ordnerstruktur

```
cleanpeace/
├─ CLAUDE.md                 ← diese Datei
├─ .claude/agents/           ← Subagent-Definitionen
├─ docs/
│  ├─ 01_Vision.md
│  ├─ 02_Briefing.md         ← Game Design Document (einzige Quelle der Wahrheit)
│  ├─ 03_Recherche.md        ← reale Säuberungsmethoden, Tierfakten, Quellen
│  ├─ entscheidungen.md      ← E-001, E-002 … (Was, Warum, Alternativen)
│  ├─ meilensteine.md        ← M0, M1 … mit Status und Abnahme
│  └─ testprotokolle/        ← Gerätetests des Produzenten
├─ web/                      ← der Spielcode (Vite-Projekt)
│  ├─ src/sim/  src/render/  src/ui/  src/data/  src/audio/
│  └─ tests/
└─ assets/                   ← Quell-Assets (Modelle, Sounds), lizenzfrei, mit Herkunft
```

## 5. Meilensteine (Vorschlag — jeder endet mit Gerätetest durch den Produzenten)

- **M0 Gerüst:** Vite + Three + Rapier, leere Szene mit Wasserfläche, Deploy auf Pages, Rauchtest.
- **M1 Wasser & Auftrieb:** stilisiertes Wasser, Boot schwimmt und schaukelt, schwimmender Müll treibt. Kopflose Tests für Auftrieb.
- **M2 Boot steuern + Oberflächenbergung:** Touch-Steuerung (linker Stick fahren, rechts Werkzeug), Kescher, Barriere auslegen.
- **M3 Taucher + Unterwasser:** Kamerawechsel über/unter Wasser, Sichtweite abhängig von Sauberkeit, Hebesack für schwere Teile.
- **M4 Tierrettung:** Schildkröte im Netz, Schneide-Mechanik mit Stress-Anzeige, Freilass-Moment (Belohnung!).
- **M5 Mission & Bilanz:** Einsatzablauf, Sauberkeits-Anzeige, Punkte, Tutorial, Autosave, Sounds.
- **M6 Politur & Leistung:** Profiling auf Geräten, Effekte, Abnahme Vertical Slice.

## 6. Orchestrierung — wie du als Orchestrator arbeitest

### Verfügbare Subagents (`.claude/agents/`)
| Agent | Zuständig für |
|---|---|
| `architekt` | Architektur, Meilensteinplanung, Schnittstellen zwischen Systemen, Entscheidungseinträge |
| `gameplay-engineer` | Spiellogik, Missionen, Fahrzeug- und Taucherverhalten, Tierrettung, Punkte |
| `physik-wasser` | Rapier, Auftrieb, Strömung, Wasserwiderstand, Hebesack, Netz-Seile |
| `grafik-shader` | Three.js-Szene, stilisierte Wasser- und Unterwasser-Shader, Modelle, Effekte, Draw-Call-Budget |
| `ui-touch` | Touch-Steuerung, HUD, Menüs, Layout für iPad und iPhone mini |
| `meeres-recherche` | reale Säuberungsmethoden, Tierverhalten, Faktenprüfung, Lern-Inhalte im Spiel |
| `qa-tester` | Tests schreiben/ausführen, Leistungsmessung, Code-Review, Abnahme-Checklisten |
| `audio` | synthetische bzw. lizenzfreie Sounds, Unterwasser-Filter, Stimmung |

### Arbeitsablauf pro Aufgabe
1. **Verstehen:** Aufgabe mit `docs/02_Briefing.md` und `docs/meilensteine.md` abgleichen. Unklar? → **Den Produzenten fragen** (mit Erklärung und Kontext, Optionen mit Empfehlung). Lieber einmal zu viel fragen als raten.
2. **Planen:** Bei Aufgaben > 1 System zuerst `architekt` um einen kurzen Plan bitten (Dateien, Schnittstellen, Risiken).
3. **Verteilen:** Unabhängige Teilaufgaben **parallel** an die passenden Agents geben. Jeder Auftrag enthält: Ziel, betroffene Dateien, Schnittstellen, Abnahmekriterium, Leistungsbudget.
4. **Zusammenführen:** Ergebnisse prüfen, Konflikte lösen, `npm run build` und `npm test` müssen grün sein.
5. **Prüfen:** `qa-tester` reviewt jede Lieferung (Korrektheit, Leistung, Touch-Layout). Rechercheinhalte prüft `meeres-recherche`.
6. **Dokumentieren:** Neue Entscheidungen als `E-xxx` in `docs/entscheidungen.md`; Stand in `docs/meilensteine.md`.
7. **Übergeben:** Dem Produzenten sagen, **was** gebaut wurde, **wie** er es testet (Link/Befehl, konkrete Testschritte auf iPad und iPhone mini) und **worauf** er achten soll.

### Regeln für Agents
- Kein Agent ändert Dateien außerhalb seines Zuständigkeitsbereichs ohne Rücksprache mit dir.
- Kein Agent erweitert den Umfang über den aktuellen Meilenstein hinaus. Ideen → `docs/ideen.md`.
- Jede Lieferung endet mit: geänderte Dateien, wie getestet, bekannte Schwächen.
- Abgenommene Meilensteine werden nicht umgebaut, ohne dass der Produzent zustimmt.

## 7. Kommunikation mit dem Produzenten

- Der Produzent ist **technisch interessierter Laie** und will dazulernen. Erkläre bei jedem Schritt **was, wie und warum** — mit Alltagsvergleichen (z. B. „Draw Calls sind wie einzelne Botengänge zur Grafikkarte — weniger Gänge, flüssigeres Spiel").
- Schreibe auf Deutsch. Fachbegriffe beim ersten Auftreten kurz erklären.
- Fragen immer mit Optionen und deiner Empfehlung stellen.
- Testanweisungen als nummerierte Checkliste, Windows/PowerShell-Befehle.
- Er testet ca. 5–8 Stunden pro Woche; Lieferungen so schneiden, dass ein Test in 15–30 Minuten machbar ist.

## 8. Inhaltliche Leitplanken

- Reale Techniken korrekt, aber spielerisch vereinfacht darstellen. Vereinfachungen im `docs/03_Recherche.md` vermerken.
- Tiere werden nie drastisch leidend gezeigt; Gefahr wird angedeutet, Rettung ist der Fokus.
- Keine echten Marken/Organisationsnamen oder Logos im Spiel ohne Freigabe; reale Projekte dürfen in Info-Karten sachlich genannt werden.
- Monetarisierung: noch offen — nicht einbauen, bis der Produzent entschieden hat.
