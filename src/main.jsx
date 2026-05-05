import { lazy, StrictMode, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const DESKTOP_QUERY = '(min-width: 1024px)';

const MobileApp = lazy(() => import('./mobile/App.jsx'));
const DesktopApp = lazy(() => import('./desktop/App.jsx'));

function pickMode() {
  if (typeof window === 'undefined') return 'mobile';
  return window.matchMedia(DESKTOP_QUERY).matches ? 'desktop' : 'mobile';
}

function Root() {
  const [mode] = useState(pickMode);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e) => {
      const next = e.matches ? 'desktop' : 'mobile';
      if (next !== mode) {
        // Cada experiência tem seu próprio CSS global; recarregamos para
        // garantir um estado de estilos limpo ao trocar de breakpoint.
        window.location.reload();
      }
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mode]);

  return (
    <Suspense fallback={null}>
      {mode === 'desktop' ? <DesktopApp /> : <MobileApp />}
    </Suspense>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
