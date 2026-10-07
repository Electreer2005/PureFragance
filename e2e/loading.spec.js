import { test, expect } from '@playwright/test';

test('Loading aparece al navegar y espera los datos sin bloquear el menú', async ({ page }) => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  await page.route('**/api/products**', async route => {
    await pending;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ products: [] }) });
  });
  await page.goto('http://127.0.0.1:4173/productos');
  const catalogLoading = page.locator('.Loading-container--inline');
  await expect(catalogLoading).toContainText('Cargando el catálogo');
  await expect(page.getByText('Cargando la página', { exact: false })).not.toBeVisible();
  await page.locator('header').getByRole('link', { name: 'Contacto', exact: true }).click();
  await expect(page).toHaveURL(/contacto/);
  await expect(page.locator('.Loading-container').filter({ hasText: 'Cargando la página' })).toBeVisible();
  await expect(page.locator('.Loading-container')).not.toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hablemos de perfumes' })).toBeVisible();
  release();
  await page.locator('header').getByRole('link', { name: 'Productos', exact: true }).click();
  await expect(page.locator('.Loading-container')).not.toBeVisible();
  await expect(page.getByText('No encontramos productos')).toBeVisible();
});
