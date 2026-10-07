import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';
import './InstallApp.css';
export default function InstallApp() {
  const { pathname } = useLocation();
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('install-dismissed') === '1');
  const [help, setHelp] = useState(false);
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  useEffect(() => {
    const before = e => { e.preventDefault(); setPrompt(e); };
    const done = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', before);
    window.addEventListener('appinstalled', done);
    return () => { window.removeEventListener('beforeinstallprompt', before); window.removeEventListener('appinstalled', done); };
  }, []);
  if (pathname.startsWith('/checkout') || pathname.startsWith('/admin') || installed || dismissed || (!prompt && !ios)) return null;
  async function install() {
    if (ios) { setHelp(true); return; }
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  }
  function dismiss() { setDismissed(true); sessionStorage.setItem('install-dismissed', '1'); }
  return <aside className="InstallApp" aria-label="Instalar PureFragance">
    <div><strong>PureFragance en tu celular</strong><p>{help ? 'En Safari: Compartir → Agregar a pantalla de inicio.' : 'Accedé a la tienda desde tu pantalla de inicio.'}</p></div>
    <button className="btn-primary" onClick={install}><FaDownload /> {ios ? 'Cómo instalar' : 'Instalar'}</button>
    <button className="InstallApp-close" aria-label="Cerrar aviso" onClick={dismiss}><FaTimes /></button>
  </aside>;
}
