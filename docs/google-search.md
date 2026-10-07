# Indexación de PureFragance

## Despliegue

Integrar el PR de SEO del frontend y esperar el despliegue de Vercel. Comprobar
https://pure-fragance.com/robots.txt y https://pure-fragance.com/sitemap.xml.
El catálogo y fichas se pueden visitar sin sesión. Perfil/pedidos/admin conservan
sus controles de acceso. Las páginas de cuenta llevan noindex en el HTML renderizado.

## Search Console

1. Abrir https://search.google.com/search-console y agregar una propiedad de Dominio:
   pure-fragance.com (sin protocolo ni www).
2. Copiar el TXT google-site-verification que entrega Google.
3. En Hostinger DNS agregar TXT, nombre @, contenido completo del token y TTL
   predeterminado. Conservar los registros de Vercel y Resend.
4. Volver a Google y verificar; conservar el TXT después de verificar.
5. En Sitemaps enviar https://pure-fragance.com/sitemap.xml.
6. Inspeccionar https://pure-fragance.com/productos, probar la URL publicada y
   solicitar indexación. Verificar que el HTML renderizado contiene productos.

## Alcance

El sitemap contiene las páginas públicas estables; las fichas se descubren mediante
links HTML en el catálogo. No se guardan IDs de productos de producción en el repo.
Los metadatos de cada sección se actualizan con React. No se implementa SSR ni un
sitemap dinámico de productos en este cambio; las fichas usan metadatos genéricos.
Los filtros comparten canonical del catálogo. Se mantiene el dominio sin www como
URL canónica, coherente con CLIENT_URL y la redirección configurada en Vercel.

La verificación acredita propiedad: no garantiza indexación, posiciones ni plazos.
Google puede tardar en renderizar JavaScript; revisar Search Console tras publicar.
