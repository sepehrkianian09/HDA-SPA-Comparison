const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 15_000,
  reporter: 'list',
  use: { baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000', headless: true },
  webServer: { command: 'node step-6-applications/backend/server.js', url: 'http://127.0.0.1:3000/spa', reuseExistingServer: true, timeout: 10_000 }
});
