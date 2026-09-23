# 02 – Briefing (Game Design Document) · Vertical Slice „Das Hafenbecken"

Stand: 23.09.2026 · Status: **Entwurf v2 – F-1, F-3, F-4 entschieden (23.09.2026); Freigabe Gesamt-Briefing ausstehend**
Einzige Quelle der Wahrheit für den Slice. Änderungen nur mit Entscheidungseintrag (E-xxx).

---

## 1. Kurzbeschreibung
Ein verschmutzter kleiner Küstenhafen am Mittelmeer wird an einem Arbeitstag von ca. 8 Minuten aufgeräumt. Der Spieler wechselt zwischen **Arbeitsboot** (Oberfläche) und **Taucher** (unter Wasser). Je sauberer das Becken, desto klarer das Wasser und desto mehr Leben kehrt zurück. Höhepunkt: ein Tier aus einem Geisternetz befreien.

**Kernschleife (in einem Satz):** Müll finden → richtiges Werkzeug wählen → bergen → zum Steg bringen → Wasser wird sichtbar klarer.

## 2. Designsäulen
1. **Sichtbare Wirkung** – jedes geborgene Teil verändert das Bild (Farbe, Klarheit, Fische).
2. **Richtiges Werkzeug für die Aufgabe** – jede Müllsorte hat eine echte Methode (siehe 03_Recherche.md).
3. **Ruhig und verzeihend** – Fehler kosten Zeit, nie Fortschritt.
4. **Der Rettungsmoment** – vorsichtig statt schnell wird belohnt.

## 3. Ablauf eines Einsatzes
1. **Anfahrt** (10 s Kamerafahrt): Becken trüb, Müll treibt, kein Leben. Sauberkeit z. B. 15 %.
2. **Einweisung** (eingebettetes Tutorial): Boot fahren, erste Flaschen keschern.
3. **Barriere legen:** Treibgut sammelt sich in einer Ecke → effizient abkeschern.
4. **Ölfilm entdecken:** Ölsperre als Ring schließen, langsam abschöpfen.
5. **Wechsel zum Taucher** (Knopf am Boot): Unterwasser-Welt, schlechte Sicht.
6. **Sperrmüll:** Einkaufswagen/Fahrrad anschlagen, Hebesack füllen, Boot hievt es an Bord.
7. **Geisternetz mit Tier finden:** Rettung (Stress-Anzeige, vorsichtig schneiden).
8. **Freilassen:** Tier schwimmt davon – Höhepunkt, Kamerafahrt, Jingle.
9. **Rest aufräumen** (optional, bis Zeit/Kapazität).
10. **Feierabend nach ca. 8 Min. (E-005) – Bilanz:** Vorher/Nachher-Bild, Sauberkeit in %, Punkte, 1 Info-Karte.

## 4. Fahrzeuge & Figuren

### Arbeitsboot
- Steuerung: linker Stick (Gas + Lenkung, trägheitsbehaftet, schaukelt auf Wellen).
- Werkzeuge (rechts wählbar): **Kescher**, **Barriere/Ölsperre**, **Kran-Haken**, **Skimmer**.
- Laderaum: begrenzte Kapazität → am **Steg** entladen (automatisch beim Anlegen).

### Taucher
- Steuerung: linker Stick schwimmen, Auf/Ab-Tasten rechts; langsam, schwebend.
- Werkzeuge: **Hand greifen**, **Schneiden**, **Hebesack**.
- **Luftanzeige:** großzügig (ca. 3 Min.); Auftauchen am Boot füllt auf. Kein Scheitern.
- Sichtweite = f(Sauberkeit): 15 % → ca. 3 m, 100 % → ca. 15 m.

## 5. Müllsorten (Slice)
| Sorte | Wo | Werkzeug | Anzahl im Becken | Sauberkeitsgewicht |
|---|---|---|---|---|
| Treibgut (Flaschen, Tüten, Styropor) | Oberfläche, treibt mit Wind | Kescher (+ Barriere) | 40–60 (Instancing) | niedrig je Teil |
| Sperrmüll (Einkaufswagen, Fahrrad, E-Roller) | Grund | Taucher + Hebesack + Kran | 3–5 | hoch je Teil |
| Geisternetz | am Grund/an Pfahl | Schneiden, Stücke bergen | 1–2 | hoch |
| Ölfilm | Oberfläche, Fläche | Ölsperre + Skimmer | 1 Fleck | mittel |

## 6. Tierrettung (Kernmoment)
- Tier hängt im Netz. Netz hat 6–10 **Fäden**; Wischen über einen Faden schneidet ihn.
- **Stress-Anzeige** 0–100: steigt bei schnellen Wischern und falschen Schnitten nahe am Tier, sinkt bei ruhigen Pausen.
- Stress 100 → Tier zappelt kurz, Taucher muss 3 s warten (verzeihend, keine Verletzung).
- Alle tragenden Fäden durch → **Freilass-Animation**.
- **Tier:** Unechte Karettschildkröte (E-004).

## 7. Fortschritt & Belohnung
- **Sauberkeit 0–100 %** = gewichtete Summe der entfernten Müllmasse.
- Visuelle Stufen: 25 % (Wasser weniger braun), 50 % (erste Fische), 75 % (Wasserpflanzen, Vögel), 100 % (klar-türkis, Tier kehrt zurück und schwimmt vorbei).
- **Punkte** nur zählen und anzeigen (Upgrades nach dem Slice).

## 8. Steuerung (Touch, iPad Leitgerät)
- Links: virtueller Stick. Rechts: Werkzeug-Knopf (groß) + Werkzeugwahl (Rad oder 3–4 Knöpfe) + Auf/Ab beim Taucher.
- Mitte oben: Kamera-Zone (Wischen = umschauen). Kamera-Gesten **nur** dort.
- Knopf **Boot ⇄ Taucher**.
- PC: WASD + Maus, Leertaste = Werkzeug, Tab = Wechsel.

## 9. Kamera
- Boot: Verfolgerkamera schräg von hinten oben, Wasserlinie gut sichtbar.
- Taucher: nah hinter dem Taucher, weicher Übergang beim Ab-/Auftauchen (Wasserlinie teilt kurz das Bild).
- Rettung: automatische Nahansicht auf das Netz.

## 10. Grafik & Ton (Kurzfassung)
- Low-Poly, klare Farben, weiches Licht. Wasserfarbe/Trübung ist der Fortschrittsanzeiger.
- Unterwasser: Nebel, Kaustiken, Schwebeteilchen, dumpfer Ton (Tiefpass).
- Sounds: Möwen, Motor, Blubbern, Kescher-„Plopp", Schnitt-„Snip", Rettungs-Jingle.

## 11. Nicht im Slice (bewusst weggelassen → docs/ideen.md)
ROV/Tauchroboter, U-Boot, weitere Gewässer, Upgrades/Wirtschaft, Story/Figuren, Wetter, Mehrspieler, Monetarisierung.

## 12. Abnahmekriterien
- iPad 60 fps, iPhone mini ≥ 30 fps, ≤ 100 Draw Calls, Physik ≤ 4 ms.
- Ein kompletter Einsatz ohne Absturz; Autosave übersteht Neustart.
- Keine überlappenden Knöpfe auf iPhone mini (Querformat).
- Tester (Produzent + 1 Person ohne Vorwissen) verstehen jedes Werkzeug ohne Erklärung von außen.

## 13. Risiken
| Risiko | Wirkung | Gegenmaßnahme |
|---|---|---|
| Wasser-Shader + Unterwasser-Nebel zu teuer auf iPhone mini | Ruckeln | Qualitätsstufen, früh in M1 messen |
| Netz-Physik (viele Fäden) zu teuer | Physik > 4 ms | Netz als Verlet-Seile, nicht als Rapier-Körper |
| Auftrieb wirkt „glitschig"/unruhig | schlechtes Spielgefühl | viel Dämpfung, früh auf Gerät testen |
| Boot ⇄ Taucher-Wechsel verwirrt | Frust | klarer Knopf, Taucher zeigt Weg zum Boot |
| Faktenfehler in Info-Karten | Glaubwürdigkeit | meeres-recherche prüft jede Karte |

## 14. Offene Fragen an den Produzenten
- ~~F-1~~ → **entschieden E-004:** Mittelmeer-Küstenhafen + Unechte Karettschildkröte; Binnengewässer werden Mission 2.
- **F-2 Name des Spiels/Arbeitstitel** – bleibt es bei „Cleanpeace"? (Kurz prüfen, ob der Name markenrechtlich frei ist, bevor Stores ins Spiel kommen.)
- ~~F-3~~ → **entschieden E-005:** sanfter Arbeitstag ca. 8 Min.
- ~~F-4~~ → **entschieden E-006:** eigenes Repo `cleanpeace` + GitHub Pages.
