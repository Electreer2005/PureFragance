import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const origin = 'https://pure-fragance.com';
const pages = {
 '/': ['PureFragance | Perfumes para hombre, mujer y unisex', 'Descubrí el catálogo de PureFragance: perfumes para hombre, mujer y unisex. Elegí tu fragancia y comprá online.'],
 '/home': ['PureFragance | Tienda de perfumes', 'Explorá las fragancias y novedades de PureFragance. Perfumes para hombre, mujer y unisex.'],
 '/productos': ['Catálogo de perfumes | PureFragance', 'Encontrá tu próxima fragancia en el catálogo de PureFragance. Explorá perfumes para hombre, mujer y unisex.'],
 '/acerca': ['Sobre PureFragance | Perfumería online', 'Conocé PureFragance y nuestra tienda de perfumes.'],
 '/contacto': ['Contacto | PureFragance', 'Contactate con PureFragance para consultar sobre perfumes y compras.'],
};
function meta(name, content, property = false) {
 const attribute = property ? 'property' : 'name';
 let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
 if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.append(element); }
 element.content = content;
}
export default function Seo() {
 const { pathname } = useLocation();
 useEffect(() => {
  const product = /^\/producto\/[^/]+\/?$/.test(pathname);
  const details = pages[pathname] || (product ? ['Perfume | PureFragance', 'Descubrí esta fragancia, sus tamaños y precio en PureFragance.'] : ['Mi cuenta | PureFragance', 'Gestioná tu cuenta de PureFragance.']);
  document.title = details[0];
  meta('description', details[1]);
  meta('robots', pages[pathname] || product ? 'index,follow' : 'noindex,follow');
  const canonical = new URL(pathname, origin).href;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.append(link); }
  link.href = canonical;
  meta('og:title', details[0], true); meta('og:description', details[1], true); meta('og:url', canonical, true); meta('og:type', 'website', true);
 }, [pathname]);
 return null;
}
