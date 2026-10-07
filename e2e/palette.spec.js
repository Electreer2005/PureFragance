import { test, expect } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  test(`pantallas públicas legibles en móvil y tema ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(theme => {
      localStorage.setItem('theme', theme);
      localStorage.setItem('user', JSON.stringify({ id: 'guest', name: 'Invitado', role: 'guest', isGuest: true }));
    }, theme);
    await page.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ products: [], orders: [], count: 0 }) }));
    for (const path of ['/home', '/productos', '/carrito', '/contacto', '/checkout/pending', '/login']) {
      await page.goto(`http://127.0.0.1:4173${path}`);
      await expect(page.locator('h1, .title').first()).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (path === '/login') {
        const input = page.locator('.input-form').first();
        await input.focus();
        const colors = await input.evaluate(el => ({ text: getComputedStyle(el).color, surface: getComputedStyle(el.closest('.Input-box')).backgroundColor }));
        expect(colors.text).not.toBe(colors.surface);
      }
      if (path === '/home' || path === '/login') await page.screenshot({ path: testInfo.outputPath(`${theme}-${path.slice(1)}.png`), fullPage: true });
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('http://127.0.0.1:4173/home');
    await expect(page.locator('.Home')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`${theme}-desktop.png`), fullPage: true });
  });
}

test('pedidos mantiene el orden de hooks cuando termina de cargar la sesión', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('token', 'test-token'));
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/auth/me')) await new Promise(resolve => setTimeout(resolve, 300));
    const data = path.endsWith('/auth/me') ? { user: { id: 'u1', name: 'Cliente', role: 'user' } } : { orders: [], count: 0 };
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(data) });
  });
  await page.goto('http://127.0.0.1:4173/pedidos');
  await expect(page.getByRole('heading', { name: 'Todavía no hiciste pedidos' })).toBeVisible();
  expect(errors).toEqual([]);
});
