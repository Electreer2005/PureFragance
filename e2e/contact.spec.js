import { test, expect } from '@playwright/test';

test('acerca presenta la tienda sin cifras de ejemplo y contacto confirma solo con respuesta de la API', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('user', JSON.stringify({ id: 'guest', name: 'Invitado', role: 'guest', isGuest: true })));
  let status = 503, submitted;
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/contact')) {
      submitted = route.request().postDataJSON();
      return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ message: 'respuesta de prueba' }) });
    }
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ products: [] }) });
  });
  await page.goto('http://127.0.0.1:4173/acerca');
  await expect(page.locator('.About')).not.toContainText('10.000');
  await expect(page.locator('.About')).not.toContainText('2017');
  await page.getByRole('button', { name: 'Ver colección' }).click();
  await expect(page).toHaveURL(/productos/);
  await page.goto('http://127.0.0.1:4173/contacto');
  await expect(page.getByRole('link', { name: 'solismauricioezequiel@gmail.com' }).first()).toHaveAttribute('href', 'mailto:solismauricioezequiel@gmail.com');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByText('Ingresá tu nombre', { exact: true })).toBeVisible();
  expect(submitted).toBeUndefined();
  await page.getByLabel('Nombre', { exact: true }).fill('Ana');
  await page.getByLabel('Email', { exact: true }).fill('ana@example.com');
  await page.getByLabel('Mensaje', { exact: true }).fill('Me gustaría consultar por una fragancia.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('alert')).toContainText('No pudimos enviar');
  await expect(page.getByLabel('Mensaje', { exact: true })).toHaveValue('Me gustaría consultar por una fragancia.');
  await expect(page.getByText('¡Recibimos tu consulta!', { exact: true })).not.toBeVisible();
  status = 429;
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('alert')).toContainText('límite de consultas');
  status = 202;
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByText('¡Recibimos tu consulta!', { exact: true })).toBeVisible();
  expect(submitted.email).toBe('ana@example.com');
  await page.getByRole('button', { name: 'Enviar otra consulta' }).click();
  await expect(page.getByLabel('Mensaje', { exact: true })).toHaveValue('');
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => document.documentElement.classList.toggle('dark-mode', theme === 'dark'), theme);
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ['acerca', 'contacto']) {
        await page.goto(`http://127.0.0.1:4173/${path}`);
        await page.evaluate(theme => document.documentElement.classList.toggle('dark-mode', theme === 'dark'), theme);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({ path: testInfo.outputPath(`${path}-${theme}-${width}.png`), fullPage: true });
      }
    }
  }
});
