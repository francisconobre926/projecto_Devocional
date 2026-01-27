import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import api from './services/api';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateDevotional from './pages/CreateDevotional';
import MyDevotionalsPage from './pages/MyDevotional';
import SharedDevotionalsPage from './pages/SharedDevotional';

import ProtectedLayout from './components/ProtectedLayout';
import PublicLayout from './components/PublicLayout';
import PostGenerator from './pages/PostGenerator';
import CategoriasPage from './pages/CategoriasPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('token');
      const usuario = localStorage.getItem('usuario');

      const validToken =
        token && token !== 'null' && token !== 'undefined' && token.trim() !== '';
      const validUser =
        usuario && usuario !== 'null' && usuario !== 'undefined';

      const authed = !!(validToken && validUser);

      setIsAuthenticated(authed);

      if (authed) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete api.defaults.headers.common['Authorization'];
      }

      setLoading(false);
    };

    syncAuth();

    // Mantém sincronizado quando fizer login/logout
    window.addEventListener('auth:changed', syncAuth);
    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('auth:changed', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Ao entrar no site: mostra os partilhados (público) */}
        <Route path="/" element={<Navigate to="/devocionais/partilhados" replace />} />

        {/* Públicas (com Header/Footer via PublicLayout) */}
        <Route
          path="/devocionais/partilhados"
          element={
            <PublicLayout>
              <SharedDevotionalsPage />
            </PublicLayout>
          }
        />

        <Route
          path="/auth/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <PublicLayout>
                <Login setIsAuthenticated={setIsAuthenticated} />
              </PublicLayout>
            )
          }
        />

        <Route
          path="/auth/register"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <PublicLayout>
                <Register />
              </PublicLayout>
            )
          }
        />

        {/* Protegidas (com Header/Footer via ProtectedLayout) */}
        <Route
          path="/home"
          element={
            <ProtectedLayout isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedLayout>
          }
        />

        <Route
          path="/devocionais/nova"
          element={
            <ProtectedLayout isAuthenticated={isAuthenticated}>
              <CreateDevotional />
            </ProtectedLayout>
          }
        />

        <Route
          path="/devotionals"
          element={
            <ProtectedLayout isAuthenticated={isAuthenticated}>
              <MyDevotionalsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/devocionais/categorias"
          element={
            <PublicLayout>
              <CategoriasPage />
            </PublicLayout>
          }
        />

        <Route
          path="/devocionais/gerar"
          element={
            <ProtectedLayout isAuthenticated={isAuthenticated}>
              <PostGenerator />
            </ProtectedLayout>
          }
        />
        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? '/home' : '/devocionais/partilhados'}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
