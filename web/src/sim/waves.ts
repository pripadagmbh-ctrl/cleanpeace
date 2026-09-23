/**
 * Gemeinsame Wellenfunktion für Physik UND Grafik (Entscheidung E-002).
 * Vergleich: Das ist die eine Noten-Partitur, nach der Orchester (Shader)
 * und Tänzer (Physik) sich richten – so bleibt das Boot immer auf der Welle.
 *
 * Summe aus drei Sinuswellen mit verschiedener Richtung, Länge und Tempo.
 * Die GLSL-Version im Wasser-Shader bekommt GENAU diese Parameter als Uniforms.
 */
export interface Wave {
  dirX: number; // Richtung (normiert)
  dirZ: number;
  amplitude: number; // Höhe in Metern
  wavelength: number; // Länge in Metern
  speed: number; // Meter pro Sekunde
}

export const WATER_LEVEL = 0;

/** Hafenbecken: ruhiges Wasser, sanftes Schaukeln. */
export const HARBOR_WAVES: readonly Wave[] = [
  { dirX: 1.0, dirZ: 0.0, amplitude: 0.12, wavelength: 14, speed: 1.6 },
  { dirX: 0.6, dirZ: 0.8, amplitude: 0.07, wavelength: 8, speed: 1.2 },
  { dirX: -0.4, dirZ: 0.92, amplitude: 0.04, wavelength: 4.5, speed: 0.9 },
];

export function waveHeight(x: number, z: number, t: number, waves: readonly Wave[] = HARBOR_WAVES): number {
  let h = WATER_LEVEL;
  for (const w of waves) {
    const k = (2 * Math.PI) / w.wavelength;
    h += w.amplitude * Math.sin(k * (w.dirX * x + w.dirZ * z - w.speed * t));
  }
  return h;
}

/** Maximal mögliche Auslenkung – nützlich für Tests und Kamera. */
export function maxWaveAmplitude(waves: readonly Wave[] = HARBOR_WAVES): number {
  return waves.reduce((s, w) => s + w.amplitude, 0);
}
