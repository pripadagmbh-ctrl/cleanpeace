import { describe, it, expect } from 'vitest';
import { pointBuoyancy, WATER_DENSITY, GRAVITY } from '../../src/sim/buoyancy';

describe('Auftrieb', () => {
  it('ist null über Wasser', () => {
    expect(pointBuoyancy(-0.3, 0.25, 1)).toBe(0);
  });
  it('wächst mit der Eintauchtiefe', () => {
    expect(pointBuoyancy(0.6, 0.25, 1)).toBeGreaterThan(pointBuoyancy(0.2, 0.25, 1));
  });
  it('ist voll eingetaucht gleich Archimedes (ρ·g·V)', () => {
    expect(pointBuoyancy(5, 0.25, 1)).toBeCloseTo(WATER_DENSITY * GRAVITY * 0.25);
  });
});
