# Activar cupones, stock, reseñas y PWA

1. Integrar y desplegar primero el PR del backend en Render; después el del frontend en Vercel.
2. Conservar VITE_API_URL apuntando a https://TU-BACKEND.onrender.com/api.
3. En /admin/cupones crear el primer código. No se generan promociones por defecto.
4. En /admin/productos revisar los stocks existentes: son totales por producto,
   compartidos entre tamaños (no inventario separado por ml).
5. Probar una transferencia y confirmar pago desde /admin/pedidos: descuenta stock una vez.
   Para tarjeta se espera el estado approved del webhook de Mercado Pago.
6. Una compra pagada y no cancelada habilita la reseña del producto al usuario comprador.

## Cupones y stock

El checkout verifica precios, cantidades, descuentos y stock con el backend. Un cupón
inválido bloquea confirmar hasta retirarlo/corregirlo. Si cambia el total antes de
crear el pedido, se pide revisar y confirmar nuevamente.

El 10% por transferencia se aplica antes del cupón. El mínimo del cupón se evalúa
sobre el subtotal neto de ese descuento. Los cupones tienen vigencia opcional y
activación, sin límite de usos. La tarjeta paga el total final con envío incluido.

Transferencia/efectivo crean pedidos pendientes, sin abrir Mercado Pago. El admin
confirma cuando recibe el dinero. Efectivo permite despachar pendiente; para marcar
entregado se confirma el cobro. Un pago sin unidades queda marcado para revisión en
el panel; reponer y reintentar stock o cancelar y gestionar el reembolso.
No hay reserva de stock mientras el pago está pendiente ni reembolsos automáticos.

## PWA

Vercel ya sirve HTTPS. El manifiesto y service worker se registran en producción.
Chrome/Android muestran Instalar cuando el navegador habilita la opción.
En Safari/iPhone: Compartir → Agregar a pantalla de inicio. No se necesita APK.
Se usan iconos PF rojo/dorado en PNG, además del SVG fuente.

Sin conexión se muestra una pantalla para reconectar. No se cachean API, datos de
clientes, pagos ni pedidos. Comprar, autenticar y consultar stock requieren internet.
El service worker descarga de la red las navegaciones, para evitar servir builds viejos.
Para verificar: DevTools → Application → Manifest/Service Workers, instalar en celular
y abrir sin conexión. La PWA no incluye notificaciones push.

## Pruebas

npm ci
npm run build
npx playwright install chromium
npm run test:ui

La prueba de navegador usa respuestas API simuladas: no crea pedidos ni envía correos reales.
La integración real de MongoDB/transacciones/Mercado Pago está probada en el backend
con una base temporal y el proveedor de pago simulado. Validar una compra con
credenciales de prueba de Mercado Pago después de desplegar ambos repositorios.
