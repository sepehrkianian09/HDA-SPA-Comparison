const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

async function searchAndAdd(page, route) {
  await page.goto(`${BASE_URL}${route}`);
  await page.getByPlaceholder('Try stand').fill('stand');
  await page.getByText('Aluminum Desk Stand').waitFor();
  await page.getByRole('button', { name: 'Add to cart' }).click();
}

module.exports = { searchAndAdd };
