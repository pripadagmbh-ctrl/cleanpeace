# M0 – Gerätetest-Checkliste (v0.0.1-m0)

**Was ist M0?** Das Gerüst: Wasserfläche mit Wellen, eine Kaimauer, eine orange Testkiste, die ins Wasser fällt und schwimmt. Noch keine Steuerung – die Kamera kreist langsam von selbst.
**Warum testen?** Wir prüfen, ob die Technik (3D + Physik) auf deinen Geräten flüssig läuft, bevor darauf gebaut wird. Wie ein Fundament, das man vor dem Hausbau belastet.

**Link:** `https://<dein-github-name>.github.io/cleanpeace/` (nach `einrichten.ps1`)
Alternativ lokal: `cd web ; npm run dev` → auf dem iPad die „Network"-Adresse öffnen.

| # | Schritt | Erwartet | iPad | iPhone mini |
|---|---|---|---|---|
| 1 | Link öffnen, Gerät quer halten | Himmel, türkises Wasser, Kaimauer hinten, oben links Messkasten | | |
| 2 | 10 s zuschauen | Kiste fällt ins Wasser, taucht kurz ein, schwimmt dann **aufrecht** und schaukelt sanft mit | | |
| 3 | Messkasten lesen: **FPS** | iPad ~60, iPhone mini ≥ 30 | | |
| 4 | **Draw Calls** | 3 | | |
| 5 | **Physik** | unter 1 ms | | |
| 6 | 2 Minuten laufen lassen | kein Ruckeln, Gerät wird höchstens handwarm | | |
| 7 | Gerät hochkant und wieder quer drehen | Bild passt sich an, nichts verzerrt | | |
| 8 | Wasser anschauen | Wellen wandern gleichmäßig, Kiste sitzt **auf** dem Wasser (nicht schwebend, nicht versunken) | | |

**Beobachtungen / Screenshots:**

-

**Abnahme M0:** ☐ ja ☐ nein – Datum:
