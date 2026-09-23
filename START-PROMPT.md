# Start – so geht es weiter

**Stand 23.09.2026:** Phase 0 (Planung) und M0 (Gerüst) sind fertig gebaut und getestet.

## 1. Einmalig einrichten
Rechtsklick auf `einrichten.ps1` → **„Mit PowerShell ausführen"**. Das Skript
1. schiebt die Agents nach `.claude\agents`,
2. prüft Node.js und Git,
3. installiert die Pakete und lässt die Tests laufen,
4. legt das Git-Repo an,
5. lädt es auf GitHub hoch (Repo `cleanpeace`) und schaltet GitHub Pages ein.

## 2. Gerätetest M0
Checkliste: `docs/testprotokolle/M0_checkliste.md`

## 3. Danach in Claude Code (im Ordner Cleanpeace `claude` starten)

```
Du bist Orchestrator für Cleanpeace. Lies CLAUDE.md und alle Dateien in docs/.
Gerätetest M0: [deine Beobachtungen aus der Checkliste].
Wenn M0 abgenommen ist, starte M1 laut docs/meilensteine.md:
architekt plant zuerst, dann parallel physik-wasser und grafik-shader,
danach qa-tester mit Checkliste. Erkläre mir jeden Schritt (was, wie, warum).
```

## Folge-Prompts (Beispiele)
- **Gerätetest zurückmelden:** `Gerätetest Mx iPad: [...]. iPhone mini: [...]. Protokoll unter docs/testprotokolle/ ablegen, bewerten, Korrekturen vorschlagen.`
- **Idee parken:** `Idee: [...]. Nicht bauen, nur in docs/ideen.md mit Einschätzung eintragen.`
