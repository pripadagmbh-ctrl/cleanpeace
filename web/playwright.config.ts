import { defineConfig, devices } from '@playwright/test';

// Rauchtest: Startet die gebaute Seite und prüft, dass sie läuft.
// Geräteprofile: iPad (Leitgerät) und iPhone mini (klein, Querformat).
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  webServer: { command: 'npx vite preview --port 4173 --strictPort', port: 4173, reuseExistingServer: true },
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  projects: [
    { name: 'ipad', use: { ...devices['iPad (gen 7) landscape'], browserName: 'chromium' } },
    { name: 'iphone-mini', use: { ...devices['iPhone 13 Mini landscape'], browserName: 'chromium' } },
  ],
});
