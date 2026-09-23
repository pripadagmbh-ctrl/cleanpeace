import { test, expect } from '@playwright/test';

test('Spiel startet ohne Fehler und zeigt Messanzeige', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('#stats')).toContainText('FPS', { timeout: 20_000 });
  await expect(page.locator('#stats')).toContainText('Draw Calls');

  // Kiste darf nach 3 s nicht versunken sein
  await page.waitForTimeout(3000);
  const y = await page.evaluate(() => (window as any).__cleanpeace.sim.crateState().y);
  expect(y).toBeGreaterThan(-1);
  expect(errors).toEqual([]);
});
