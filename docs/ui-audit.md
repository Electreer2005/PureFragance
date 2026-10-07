# Auditoría del frontend — 7 de octubre de 2026

## Alcance
Revisión de estilos de las pantallas del frontend, navegación, formularios y análisis estático. Pruebas de navegador con API simulada: no constituyen una auditoría de seguridad del backend ni una verificación de pagos o correos reales en producción.

## Corregido
- Estados de éxito, información y advertencia usan rojo y dorado, conservando etiquetas e iconos para distinguir su significado.
- Dorado de texto separado del dorado decorativo: #806014 en superficies claras y #F0D98C en oscuras. Blanco para superficies claras; neutros para textos, bordes y fondos oscuros.
- Mejor contraste del texto secundario, botones dorados y formularios de acceso. El botón de compra confirmado usa dorado con texto oscuro.
- Marca del pie de página sin el azul predeterminado de los enlaces.
- Variables de color inexistentes del perfil corregidas.
- Pantalla de pago pendiente con tarjeta y estilos compartidos.
- Foco visible de teclado y respeto por la preferencia de movimiento reducido.
- Orden de hooks corregido en Mis pedidos: useMemo se ejecuta antes de las salidas por carga de sesión o invitado.

## Pendientes encontrados
| Prioridad | Hallazgo | Acción necesaria |
| --- | --- | --- |
| Alta | Contacto espera 1,2 segundos y muestra éxito, pero no envía nada. | Conectar un endpoint de contacto y mostrar éxito únicamente al recibir confirmación. |
| Alta | Newsletter solo impide el envío del formulario. | Conectar una suscripción con consentimiento o retirar el formulario hasta implementarla. |
| Media | Contacto y Footer contienen hola@perfumes.com, teléfono y dirección de ejemplo; enlaces sociales genéricos. | Reemplazar por datos confirmados del negocio. El correo informado por el dueño es solismauricioezequiel@gmail.com. |
| Media | Promesas de respuesta en 24 horas y horarios de atención sin validación del dueño. | Confirmar las condiciones antes de publicarlas. |
| Media | ESLint tiene otros 11 errores preexistentes: variables sin uso, configuración de Node y reglas de contextos/efectos. | Resolver por separado con pruebas de inicialización, persistencia y carga de datos. No se desactivaron reglas. |
| Media | Build advierte un bundle de más de 500 kB. | Separar las rutas administrativas y otras páginas mediante carga diferida. |
| Baja | Imágenes de categorías dependen de Unsplash y no se pudieron validar con la red del entorno. | Comprobar en producción y usar archivos propios o un fallback. |

## Validación
Build de producción y pruebas Playwright de carrito/cupones/transferencia/reseñas/PWA, perfil, sesión invitada y SEO. Pruebas adicionales de móvil de 390 px en temas claro/oscuro para Home, catálogo, carrito, contacto, pago pendiente y acceso; Home también a 1280 px. Capturas disponibles como artefactos de pruebas. La comprobación de colores y contraste es una revisión visual, no una certificación WCAG completa.
