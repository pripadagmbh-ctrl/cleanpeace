# Entscheidungen

## E-001 Technik-Stack (23.09.2026)
- **Entscheidung:** TypeScript + Vite + Three.js + Rapier, Deploy auf GitHub Pages, später Capacitor für die Stores.
- **Warum:** bewährt im Projekt Bagerana (60 fps auf iPad), kein Mac nötig, Test per Link auf echten Geräten, KI-Agents arbeiten mit reinem Code sehr zuverlässig.
- **Verworfen:** Unity (stärkeres Wasser-Rendering, aber schwer für Agents steuerbar, iOS-Build nur per Cloud), Godot (weniger Erfahrung).
- **Folgen:** Wasser und Auftrieb müssen selbst gebaut werden (Rapier kennt kein Wasser).

## E-002 Trennung Simulation / Darstellung (23.09.2026)
- **Entscheidung:** `src/sim/` ohne Three.js-Importe; `src/render/` liest nur den Zustand.
- **Warum:** Logik ist ohne Browser testbar, Fehler sind leichter zu finden, Grafik kann später ausgetauscht/verbessert werden. Vergleich: Die Spielregeln stehen im Regelbuch, das Spielbrett zeigt sie nur an.
- **Folgen:** Wellenfunktion liegt in `sim/waves.ts` und wird von Shader und Physik gleich genutzt.

## E-003 Stil 3D stilisiert, verzeihend (23.09.2026)
- **Entscheidung:** Low-Poly, klare Farben; Fehler kosten Zeit, nie Fortschritt.
- **Warum:** Familien-Zielgruppe, leistungsschonend auf Mobilgeräten, Agents können prozedurale Modelle bauen.

## E-004 Ort und Tier von Mission 1 (23.09.2026)
- **Entscheidung:** kleiner Küstenhafen am Mittelmeer, gerettet wird eine Unechte Karettschildkröte.
- **Warum:** Meeresschildkröten kommen in deutschen Binnengewässern nicht vor; die Schildkröte ist das stärkste Bild für „Save the World".
- **Verworfen:** Binnenhafen mit Schwan (→ Mission 2), Sumpfschildkröte (zu unbekannt).

## E-005 Sanfter Arbeitstag (23.09.2026)
- **Entscheidung:** ein Einsatz dauert ca. 8 Minuten, danach kommt die Bilanz. Kein Scheitern; was übrig bleibt, wartet auf den nächsten Tag.
- **Warum:** gibt dem Einsatz einen Anfang und ein Ende, ohne Druck (bewährt bei Bagerana).

## E-006 Eigenes Repo (23.09.2026)
- **Entscheidung:** neues GitHub-Repo `cleanpeace`, Auslieferung über GitHub Pages; wird in M0 von Claude Code auf dem PC angelegt.
- **Warum:** eigener Testlink fürs iPad, sauber getrennt vom Schrottplatz-Spiel.

## E-007 Auftrieb über Messpunkte + Wasserwiderstand (23.09.2026, M0)
- **Entscheidung:** Auftrieb wird an 4 Messpunkten unten am Körper berechnet (Archimedes: Dichte × Volumen × g, anteilig zur Eintauchtiefe); zusätzlich bremst an jedem Punkt ein Wasserwiderstand (senkrecht 650, seitlich 180 N·s/m).
- **Warum:** Rapier kennt kein Wasser. Ohne Widerstand schaukelt sich ein Körper auf wie auf einem Trampolin ohne Luft.
- **Rapier-Erkenntnis:** Kraft UND Drehkraft müssen jeden Schritt getrennt geleert werden (`resetForces` + `resetTorques`). Nur `resetForces` ließ die Drehkraft von Bild zu Bild wachsen → Kiste überschlug sich. Abgesichert durch Wächter-Test.
- **Erkenntnis Form:** Schwimmende Körper breit und flach bauen (Testkiste 1,6 × 0,6 × 1,2 m). Ein Würfel mit ca. 40 % der Wasserdichte schwimmt auch in echt schräg – wichtig später für den Bootsrumpf.
- **Folgen:** Wellenfunktion `sim/waves.ts` wird von Physik und Wasser-Shader gleich genutzt; Messanzeige zeigt FPS, Draw Calls, Dreiecke, Physikzeit.

## E-008 Bundle-Größe M0 (23.09.2026)
- **Stand:** ca. 3,4 MB (1,2 MB gezippt) – der größte Teil ist Rapier (Physik-Programm im WebAssembly-Format, in die JS-Datei eingebettet).
- **Entscheidung:** vorerst so lassen; in M6 prüfen, ob die WASM-Datei separat geladen wird (schnellerer Start).
