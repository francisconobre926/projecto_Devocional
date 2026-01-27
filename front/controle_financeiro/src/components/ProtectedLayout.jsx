
import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function parseJwtPayload(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token || token === 'null' || token === 'undefined' || token.trim() === '') return false;

  const payload = parseJwtPayload(token);
  if (!payload) return false;

  // Se não existir exp, considera válido (depende do teu backend; pode mudar para false)
  if (!payload.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

function readAuthFromStorage() {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');

  const validUser =
    usuario && usuario !== 'null' && usuario !== 'undefined';

  if (!validUser) return { authed: false, reason: 'no_user' };

  if (!isTokenValid(token)) return { authed: false, reason: 'token_invalid_or_expired' };

  return { authed: true, reason: null };
}

export default function ProtectedLayout({ children }) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const [authState, setAuthState] = useState(() => readAuthFromStorage());

  const sync = () => setAuthState(readAuthFromStorage());

  useEffect(() => {
    window.addEventListener('auth:changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('auth:changed', sync);
      window.removeEventListener('storage', sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // revalida sempre que mudar rota
  useEffect(() => {
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  const from = useMemo(
    () => location.pathname + (location.search || ''),
    [location.pathname, location.search]
  );

  if (!authState.authed) {
    // se token expirou/inválido: limpa e avisa app
    if (authState.reason === 'token_invalid_or_expired') {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.dispatchEvent(new Event('auth:changed'));
    }

    return <Navigate to="/auth/login" replace state={{ from }} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

