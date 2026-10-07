import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', timeout: 45000, workers: 1,
  use: { browserName: 'chromium', headless: true },
  webServer: { command: 'npm run build && npm run preview -- --host 127.0.0.1', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
