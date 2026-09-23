import RAPIER from '@dimforge/rapier3d-compat';
import { waveHeight } from './waves';
import { pointBuoyancy, pointDrag } from './buoyancy';

/**
 * Simulation (kennt kein Three.js – E-002). M0: nur eine Testkiste, die
 * beweist, dass Rapier auf dem Gerät lädt und das Wasser trägt.
 */
export interface CrateState { x: number; y: number; z: number; qx: number; qy: number; qz: number; qw: number }

/** Flache Transportkiste – breit und niedrig wie ein Bootsrumpf, damit sie aufrecht schwimmt. */
export const CRATE_SIZE = { x: 1.6, y: 0.6, z: 1.2 } as const;
const HX = CRATE_SIZE.x / 2, HY = CRATE_SIZE.y / 2, HZ = CRATE_SIZE.z / 2;
const CRATE_MASS = 300; // kg; Volumen 1,15 m³ → schwimmt etwa zu einem Viertel eingetaucht
// Dämpfung je Messpunkt (N·s/m) – etwa halb „kritisch": beruhigt sich, ohne zäh zu wirken
const DRAG_VERTICAL = 650;
const DRAG_HORIZONTAL = 180;
const PROBES: ReadonlyArray<[number, number]> = [
  [-HX, -HZ], [HX, -HZ], [-HX, HZ], [HX, HZ],
];

export class SimWorld {
  time = 0;
  lastStepMs = 0;
  private world!: RAPIER.World;
  private crate!: RAPIER.RigidBody;

  static async create(): Promise<SimWorld> {
    await RAPIER.init();
    const s = new SimWorld();
    s.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    s.world.timestep = 1 / 60;
    const body = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(0, 1.2, 0)
      .setLinearDamping(0.05)
      .setAngularDamping(0.2);
    s.crate = s.world.createRigidBody(body);
    const col = RAPIER.ColliderDesc.cuboid(HX, HY, HZ)
      .setMass(CRATE_MASS);
    s.world.createCollider(col, s.crate);
    return s;
  }

  step(): void {
    const t0 = performance.now();
    this.applyBuoyancy();
    this.world.step();
    this.time += this.world.timestep;
    this.lastStepMs = performance.now() - t0;
  }

  private applyBuoyancy(): void {
    const b = this.crate;
    // Rapier merkt sich Kraft UND Drehkraft getrennt – beide jeden Schritt leeren,
    // sonst summiert sich die Drehkraft auf und die Kiste schaukelt sich auf (Fehler in M0 gefunden).
    b.resetForces(true);
    b.resetTorques(true);
    const volPerPoint = (CRATE_SIZE.x * CRATE_SIZE.y * CRATE_SIZE.z) / PROBES.length;
    const p = b.translation();
    const q = b.rotation();
    const lv = b.linvel();
    const av = b.angvel();
    for (const [lx, lz] of PROBES) {
      // Messpunkt an der Unterseite der Kiste in Weltkoordinaten
      const local = { x: lx, y: -HY, z: lz };
      const w = rotate(local, q);
      const wx = p.x + w.x, wy = p.y + w.y, wz = p.z + w.z;
      const depth = waveHeight(wx, wz, this.time) - wy;
      const f = pointBuoyancy(depth, volPerPoint, CRATE_SIZE.y);
      // Angriffspunkt = Mitte des eingetauchten Teils: für den senkrechten Auftrieb egal,
      // aber der seitliche Wasserwiderstand greift so in realistischer Höhe an.
      const lift = Math.min(depth, CRATE_SIZE.y) / 2;
      if (f <= 0) continue;
      const at = { x: wx, y: wy + lift, z: wz };
      b.addForceAtPoint({ x: 0, y: f, z: 0 }, at, true);
      // Geschwindigkeit des Punktes = Fahrt des Körpers + Drehung × Hebelarm
      const vel = {
        x: lv.x + av.y * w.z - av.z * w.y,
        y: lv.y + av.z * w.x - av.x * w.z,
        z: lv.z + av.x * w.y - av.y * w.x,
      };
      const sub = Math.min(depth / CRATE_SIZE.y, 1);
      b.addForceAtPoint(pointDrag(vel, sub, DRAG_VERTICAL, DRAG_HORIZONTAL), at, true);
    }
  }

  crateState(): CrateState {
    const p = this.crate.translation();
    const q = this.crate.rotation();
    return { x: p.x, y: p.y, z: p.z, qx: q.x, qy: q.y, qz: q.z, qw: q.w };
  }
}

function rotate(v: { x: number; y: number; z: number }, q: { x: number; y: number; z: number; w: number }) {
  // v' = q * v * q^-1
  const ix = q.w * v.x + q.y * v.z - q.z * v.y;
  const iy = q.w * v.y + q.z * v.x - q.x * v.z;
  const iz = q.w * v.z + q.x * v.y - q.y * v.x;
  const iw = -q.x * v.x - q.y * v.y - q.z * v.z;
  return {
    x: ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y,
    y: iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z,
    z: iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x,
  };
}
