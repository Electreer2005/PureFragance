import { test } from '@playwright/test';
import assert from 'node:assert/strict';
test('cupones, transferencia, reseñas y PWA sin caché de datos privados', async ({ browser }) => {
 const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
 const page = await context.newPage();
 const errors = []; page.on('pageerror', e => errors.push(e.message));
 const product = { _id:'507f1f77bcf86cd799439011', name:'Pure Noir', brand:'PureFragance', price:10000, stock:5, rating:0, reviewsCount:0, category:'unisex', description:'Fragancia de prueba', image:'/icons/icon-192.png', sizes:[{ml:50,price:10000}], notes:{top:['Bergamota']} };
 const customer = { fullName:'Mauricio', email:'client@example.com', phone:'1122334455', address:'Calle 123', city:'CABA', province:'Buenos Aires', zipCode:'1000' };
 const order = { _id:'507f1f77bcf86cd799439012', orderNumber:'ORD-TEST', items:[{productId:product._id,name:product.name,image:product.image,ml:50,price:10000,quantity:1}], customer, subtotal:10000, shipping:1500, total:9600, discount:1900, paymentMethod:'transfer', paymentStatus:'pending', status:'pending', createdAt:new Date().toISOString() };
 await context.addInitScript(({product}) => {localStorage.setItem('token','test');localStorage.setItem('user',JSON.stringify({id:'u1',name:'Mauricio',email:'client@example.com',role:'admin'}));localStorage.setItem('cart',JSON.stringify([{itemId:product._id+'-50',productId:product._id,name:product.name,image:product.image,ml:50,price:10000,quantity:1}]));}, {product});
 let reviewCount=0, submitted;
 await page.route('**/api/**', async route => {
  const request=route.request(), url=new URL(request.url()); let data={}; let status=200;
  if(url.pathname.endsWith('/coupons/quote')) {
   const body=request.postDataJSON();
   if(body.couponCode==='INVALIDO') {status=400;data={message:'El cupón no existe'};}
   else {const transfer=body.paymentMethod==='transfer'?1000:0, discount=body.couponCode?900:0;data={quote:{items:order.items,subtotal:10000,shipping:1500,transferDiscount:transfer,couponDiscount:discount,total:11500-transfer-discount}};}
  } else if(url.pathname.endsWith('/orders') && request.method()==='POST') {submitted=request.postDataJSON();data={order};}
  else if(url.pathname.endsWith('/reviews')) {
   if(request.method()==='PUT') {reviewCount=1;data={review:{}};}
   else data={reviews:reviewCount?[{name:'Mauricio',rating:5,comment:'Muy buena fragancia',createdAt:new Date().toISOString()}]:[],rating:reviewCount?5:0,count:reviewCount};
  } else if(url.pathname.endsWith('/products/'+product._id)) data={product};
  else if(url.pathname.endsWith('/products')) data={products:[product]};
  else if(url.pathname.endsWith('/coupons')) data={coupons:[]};
  else if(url.pathname.includes('/orders')) data={orders:[order]};
  await route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
 });
 await page.goto('http://127.0.0.1:4173/checkout');
 await page.getByLabel('Cupón de descuento').fill('INVALIDO');await page.getByRole('button',{name:'Aplicar',exact:true}).click();await page.getByText('El cupón no existe').waitFor();
 assert.ok(await page.getByRole('button',{name:'Confirmar pedido'}).isDisabled());
 await page.getByRole('button',{name:'Quitar cupón INVALIDO'}).click();
 await page.locator('label.Checkout-option').filter({ has: page.locator('input[value="transfer"]') }).click();
 await page.getByLabel('Cupón de descuento').fill('TEST10');await page.getByRole('button',{name:'Aplicar',exact:true}).click();await page.getByText(/Cupón aplicado/).waitFor();
 for(const [name,value] of Object.entries(customer)) {const input=page.locator(`[name="${name}"]`);if(await input.count()) await input.fill(value);}
 
 await page.getByRole('button',{name:'Confirmar pedido'}).click();await page.getByText('¡Gracias por tu compra!').waitFor();
 assert.equal(submitted.couponCode,'TEST10'); assert.equal(submitted.expectedTotal,9600);
 await page.goto('http://127.0.0.1:4173/producto/'+product._id);
 await page.getByRole('heading',{name:'Opiniones de clientes'}).waitFor();
 await page.getByLabel('Comentario').fill('Muy buena fragancia');await page.getByRole('button',{name:'Publicar reseña'}).click();await page.getByText('Tu reseña fue guardada.').waitFor();
 await page.getByText('Muy buena fragancia',{exact:true}).waitFor();
 
 assert.deepEqual(errors,[]);
 // PWA network and cache policy in a fresh context without request interception.
 const pwa=await browser.newContext();const p=await pwa.newPage();await p.goto('http://127.0.0.1:4173/');
 await p.evaluate(()=>navigator.serviceWorker.ready);await p.reload();
 const manifest=await p.evaluate(async()=>await (await fetch('/manifest.webmanifest')).json());assert.equal(manifest.display,'standalone');
 const urls=await p.evaluate(async()=>{const names=await caches.keys();return (await Promise.all(names.map(async n=>(await (await caches.open(n)).keys()).map(r=>r.url)))).flat();});
 assert.ok(urls.some(u=>u.endsWith('/offline.html')));assert.ok(urls.every(u=>!u.includes('/api/')));
 await pwa.setOffline(true);await p.goto('http://127.0.0.1:4173/');await p.getByText('Estás sin conexión').waitFor();

 await context.close(); await pwa.close();
});

test('administración permite entrega pagada y distingue fallo de email del cambio guardado', async ({ page }) => {
 const customer={fullName:'Cliente',email:'client@example.com',address:'Calle 123',city:'CABA',province:'Buenos Aires'};
 let order={_id:'507f1f77bcf86cd799439012',orderNumber:'ORD-ADMIN',items:[],customer,total:10000,shipping:0,paymentMethod:'transfer',paymentStatus:'pending',stockStatus:'pending',status:'pending',createdAt:new Date().toISOString()};
 await page.addInitScript(()=>{localStorage.setItem('token','test');localStorage.setItem('user',JSON.stringify({id:'u1',name:'Admin',role:'admin'}));});
 await page.route('**/api/**',async route=>{
  const request=route.request(), path=new URL(request.url()).pathname;
  let data={};
  if(path.endsWith('/payment')){order={...order,paymentStatus:'approved',stockStatus:'deducted'};data={order,notification:{sent:true}};}
  else if(path.endsWith('/status')){assert.equal(request.postDataJSON().status,'delivered');order={...order,status:'delivered'};data={order,notification:{sent:false,message:'Resend rechazó el envío (HTTP 403, validation_error). Verificá un dominio propio.'}};}
  else if(path.endsWith('/orders/all'))data={orders:[order]};
  else if(path.endsWith('/products'))data={products:[]};
  await route.fulfill({contentType:'application/json',body:JSON.stringify(data)});
 });
 await page.goto('http://127.0.0.1:4173/admin/pedidos');
 const select=page.getByLabel('Estado del pedido ORD-ADMIN');
 await select.waitFor();
 assert.ok(await select.locator('option[value="delivered"]').isDisabled());
 assert.ok(!(await select.locator('option[value="cancelled"]').isDisabled()));
 await page.getByRole('button',{name:'Ver detalle'}).click();
 page.on('dialog',dialog=>dialog.accept());
 await page.getByRole('button',{name:'Confirmar pago recibido'}).click();
 await page.getByText('Estado: Pagado',{exact:true}).waitFor();
 assert.ok(!(await select.locator('option[value="delivered"]').isDisabled()));
 await select.selectOption('delivered');
 await page.getByRole('alert').filter({hasText:'El pedido se actualizó, pero no se pudo enviar el email.'}).waitFor();
 assert.equal(await select.inputValue(),'delivered');
 assert.ok(await select.isDisabled());
});
