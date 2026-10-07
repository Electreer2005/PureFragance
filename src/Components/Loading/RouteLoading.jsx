import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from './Loading';

export default function RouteLoading() {
  const { pathname } = useLocation();
  const [readyPath, setReadyPath] = useState(null);
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setReadyPath(pathname), reducedMotion ? 0 : 250);
    return () => clearTimeout(timer);
  }, [pathname]);
  return readyPath === pathname ? null : <Loading message="Cargando la página" />;
}
