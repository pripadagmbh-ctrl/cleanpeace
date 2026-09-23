import { describe, it, expect } from 'vitest';
import { SimWorld } from '../../src/sim/world';

describe('Kopflose Simulation', () => {
  it('Testkiste schwimmt nach 10 s aufrecht an der Oberfläche', async () => {
    const sim = await SimWorld.create();
    for (let i = 0; i < 600; i++) sim.step();
    const c = sim.crateState();
    // Mitte der Kiste liegt nahe der Wasserlinie: weder versunken noch weggeflogen
    expect(c.y).toBeGreaterThan(-0.3);
    expect(c.y).toBeLessThan(0.4);
    // aufrecht: Oberseite zeigt nach oben (Neigung < 20°)
    const upY = 1 - 2 * (c.qx * c.qx + c.qz * c.qz);
    expect(upY).toBeGreaterThan(Math.cos((20 * Math.PI) / 180));
  });
});

describe('Wächter: Drehkraft wird jeden Schritt zurückgesetzt', () => {
  it('schräg eingesetzte Kiste richtet sich wieder auf, statt sich aufzuschaukeln', async () => {
    const sim = await SimWorld.create();
    // 15° Schräglage direkt an der Wasserlinie
    const a = (15 * Math.PI) / 180;
    const body = (sim as unknown as { crate: { setTranslation: Function; setRotation: Function } }).crate;
    body.setTranslation({ x: 0, y: 0.15, z: 0 }, true);
    body.setRotation({ x: Math.sin(a / 2), y: 0, z: 0, w: Math.cos(a / 2) }, true);
    for (let i = 0; i < 240; i++) sim.step();
    const c = sim.crateState();
    const upY = 1 - 2 * (c.qx * c.qx + c.qz * c.qz);
    expect(upY).toBeGreaterThan(Math.cos((10 * Math.PI) / 180));
  });
});
