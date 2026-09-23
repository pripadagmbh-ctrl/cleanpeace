import { describe, it, expect } from 'vitest';
import { waveHeight, maxWaveAmplitude, WATER_LEVEL } from '../../src/sim/waves';

describe('Wellen', () => {
  it('sind deterministisch (gleiche Eingabe → gleiche Höhe)', () => {
    expect(waveHeight(3.2, -7.1, 12.5)).toBe(waveHeight(3.2, -7.1, 12.5));
  });
  it('bleiben innerhalb der maximalen Amplitude', () => {
    const max = maxWaveAmplitude();
    for (let i = 0; i < 2000; i++) {
      const h = waveHeight(Math.sin(i) * 70, Math.cos(i * 1.3) * 70, i * 0.07);
      expect(Math.abs(h - WATER_LEVEL)).toBeLessThanOrEqual(max + 1e-9);
    }
  });
  it('sind im Hafen ruhig (< 0,5 m Ausschlag)', () => {
    expect(maxWaveAmplitude()).toBeLessThan(0.5);
  });
});
