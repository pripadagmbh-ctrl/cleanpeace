/**
 * Einfacher Auftrieb über Messpunkte (reine Mathematik, ohne Rapier/Three).
 * Vergleich: Wie ein Schwimmer mit vier Korken an den Ecken – jeder Korken,
 * der unter Wasser ist, drückt nach oben, je tiefer desto stärker.
 */
export interface Vec3 { x: number; y: number; z: number }

export const WATER_DENSITY = 1025; // kg/m³ (Meerwasser, Mittelmeer)
export const GRAVITY = 9.81;

/**
 * Auftriebskraft (Newton, nach oben) für EINEN Messpunkt.
 * @param depth wie tief der Punkt unter der Wasseroberfläche liegt (m, >0 = unter Wasser)
 * @param volumePerPoint Anteil des Körpervolumens, den dieser Punkt vertritt (m³)
 * @param probeHeight Höhe, ab der der Anteil voll eingetaucht gilt (m)
 */
export function pointBuoyancy(depth: number, volumePerPoint: number, probeHeight: number): number {
  if (depth <= 0) return 0;
  const submerged = Math.min(depth / probeHeight, 1);
  return WATER_DENSITY * GRAVITY * volumePerPoint * submerged;
}

/**
 * Wasserwiderstand an einem Messpunkt: bremst die Bewegung des Punktes,
 * anteilig zur Eintauchtiefe. Vergleich: ein Paddel, das im Wasser hängt.
 * Ohne diese Bremse schaukelt sich ein Körper auf wie ein Trampolin ohne Luft.
 * @returns Kraftvektor (N), entgegen der Punktgeschwindigkeit
 */
export function pointDrag(vel: Vec3, submergedFraction: number, cVertical: number, cHorizontal: number): Vec3 {
  if (submergedFraction <= 0) return { x: 0, y: 0, z: 0 };
  return {
    x: -vel.x * cHorizontal * submergedFraction,
    y: -vel.y * cVertical * submergedFraction,
    z: -vel.z * cHorizontal * submergedFraction,
  };
}
