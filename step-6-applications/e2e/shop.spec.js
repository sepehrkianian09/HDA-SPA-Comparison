const { test, expect } = require('@playwright/test');
const { searchAndAdd } = require('./support/shop-pages');

test.describe('shopping flows', () => {
  test('SPA search and add flow', async ({ page }) => {
    await searchAndAdd(page, '/spa');
    await expect(page.getByText(/Cart: 1 item/)).toBeVisible();
  });

  test('HDA search and add flow', async ({ page }) => {
    await searchAndAdd(page, '/hda');
    await expect(page.locator('#summary')).toContainText('1 item');
  });
});
