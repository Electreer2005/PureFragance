import { test, expect } from '@playwright/test';
test('catálogo público, enlaces rastreables, sitemap y páginas privadas', async ({ page, request }) => {
 const product={_id:'507f1f77bcf86cd799439011',name:'Pure Noir',brand:'PureFragance',price:10000,stock:5,rating:0,reviewsCount:0,category:'unisex',description:'Fragancia de prueba',image:'/icons/icon-192.png',sizes:[{ml:50,price:10000}],notes:{}};
 await page.route('**/api/**',async route=>{
  const path=new URL(route.request().url()).pathname;
  const data=path.endsWith('/reviews')?{reviews:[],count:0,rating:0}:path.endsWith(product._id)?{product}:{products:[product]};
  await route.fulfill({contentType:'application/json',body:JSON.stringify(data)});
 });
 await page.goto('http://127.0.0.1:4173/');
 await page.getByRole('link',{name:'Ver catálogo de perfumes'}).click();
 await expect(page).toHaveURL(/productos/);
 await expect(page).toHaveTitle('Catálogo de perfumes | PureFragance');
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://pure-fragance.com/productos');
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','index,follow');
 await page.getByRole('link',{name:'Pure Noir',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Pure Noir',exact:true})).toBeVisible();
 await expect(page).toHaveURL(/producto\//);
 await page.goto('http://127.0.0.1:4173/perfil');
 await expect(page).toHaveURL(/login/);
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,follow');
 const sitemap=await request.get('http://127.0.0.1:4173/sitemap.xml');expect(sitemap.status()).toBe(200);expect(await sitemap.text()).toContain('https://pure-fragance.com/productos');
 const robots=await request.get('http://127.0.0.1:4173/robots.txt');expect(await robots.text()).toContain('Sitemap: https://pure-fragance.com/sitemap.xml');
});
