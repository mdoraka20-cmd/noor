import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Clean up any previously registered PWA service workers & caches for existing users
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => void reg.unregister());
    });
  }
  if ('caches' in window) {
    void caches.keys().then((keys) => {
      keys.forEach((key) => {
        if (key.includes('workbox') || key.includes('precache') || key.includes('fonts-cache')) {
          void caches.delete(key);
        }
      });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
