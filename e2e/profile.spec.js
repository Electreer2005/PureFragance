import { test, expect } from '@playwright/test';
test('perfil carga datos reales y guarda nombre, email y contraseña en la API',async({page})=>{
 let user={id:'u1',name:'Mauricio Real',email:'real@example.com',role:'user',createdAt:'2026-02-15T12:00:00Z'};
 let passwordBody;
 await page.addInitScript(()=>{localStorage.setItem('token','test-token');localStorage.setItem('user',JSON.stringify({id:'u1',name:'Nombre viejo',email:'old@example.com',role:'user'}));localStorage.setItem('favorites',JSON.stringify([{_id:'p1'}]));});
 await page.route('**/api/**',async route=>{
 const req=route.request(),path=new URL(req.url()).pathname;let data={},status=200;
 if(path.endsWith('/auth/me')){
  if(req.method()==='PUT'){
   const body=req.postDataJSON();
   if(body.email==='taken@example.com'){status=409;data={message:'Ese email ya está registrado'};}
   else {user={...user,...body};data={user};}
  }else data={user};
 }else if(path.endsWith('/auth/password')){
  passwordBody=req.postDataJSON();
  if(passwordBody.currentPassword==='wrong'){status=403;data={message:'Contraseña actual incorrecta'};}else data={message:'Contraseña actualizada'};
 }else if(path.endsWith('/orders/mine'))data={count:2,orders:[]};
 else if(path.endsWith('/products'))data={products:[]};
 await route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
 });
 await page.goto('http://127.0.0.1:4173/perfil');
 await expect(page.getByRole('heading',{name:'Mauricio Real'})).toBeVisible();
 await expect(page.locator('.Profile-statValue').first()).toHaveText('2');
 await expect(page.locator('.Profile-statValue').nth(1)).toHaveText('1');
 await expect(page.getByText('febrero de 2026',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Editar',exact:true}).click();
 await expect(page.getByLabel('Nombre',{exact:true})).toHaveValue('Mauricio Real');
 await page.getByLabel('Nombre',{exact:true}).fill('Mauricio Actualizado');
 await page.getByLabel('Email',{exact:true}).fill('taken@example.com');await page.getByRole('button',{name:'Guardar cambios'}).click();
 await expect(page.getByText('Ese email ya está registrado',{exact:true})).toBeVisible();
 await page.getByLabel('Email',{exact:true}).fill('new@example.com');await page.getByRole('button',{name:'Guardar cambios'}).click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('user')).name)).toBe('Mauricio Actualizado');
 await page.getByLabel('Contraseña actual',{exact:true}).fill('wrong');await page.getByLabel('Nueva contraseña',{exact:true}).fill('new-password');await page.getByLabel('Confirmar nueva contraseña',{exact:true}).fill('new-password');
 await page.getByRole('button',{name:'Actualizar contraseña'}).click();await expect(page.getByText('Contraseña actual incorrecta',{exact:true})).toBeVisible();await expect(page).toHaveURL(/configuracion/);
 await page.getByLabel('Contraseña actual',{exact:true}).fill('original-password');await page.getByRole('button',{name:'Actualizar contraseña'}).click();
 await expect(page.getByLabel('Contraseña actual',{exact:true})).toHaveValue('');expect(passwordBody).toEqual({currentPassword:'original-password',newPassword:'new-password'});
 await page.goto('http://127.0.0.1:4173/perfil');await expect(page.getByRole('heading',{name:'Mauricio Actualizado'})).toBeVisible();await expect(page.locator('.Profile-email')).toContainText('new@example.com');
});
test('invitado recupera su sesión sin solicitar perfil autenticado',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('user',JSON.stringify({id:'guest',name:'Invitado',role:'guest',isGuest:true})));
 await page.route('**/api/auth/me',()=>{throw new Error('No debe consultar perfil sin token');});
 await page.goto('http://127.0.0.1:4173/perfil');await expect(page.getByText('Estás navegando como invitado')).toBeVisible();
});
