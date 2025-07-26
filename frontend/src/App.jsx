// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import './App.css';
import './index.css';

import AuthService from './services/auth.service';

// Importa tus componentes de página
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserBoard from './pages/User/UserBoard';
import AdminBoard from './pages/Admin/AdminBoard';
// ¡Importa el componente ProtectedRoute!
import ProtectedRoute from './components/ProtectedRoute';

// Hook personalizado para gestionar el tema (claro / oscuro) y persistirlo
const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
};

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.roles.includes('ROLE_ADMIN'));
      setIsUser(user.roles.includes('ROLE_USER'));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    setIsAdmin(false);
    // Para asegurar la redirección después del logout, puedes usar navigate
    // Si usas useNavigate, necesitarías importarlo y pasarlo como prop a logOut,
    // o hacer la redirección en App.jsx después de llamar a logOut().
    // Por simplicidad, una recarga simple a la home es efectiva aquí.
    window.location.href = '/home'; // Redirige directamente para asegurar la limpieza del estado
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getNavLinkClasses = ({ isActive }) =>
    `transition-colors duration-300 font-medium ${isActive
      ? 'text-light-primary dark:text-dark-primary'
      : 'text-light-text-secondary hover:text-light-primary dark:text-dark-text-secondary dark:hover:text-dark-primary'
    }`;

  return (
    <Router>
      <div className="min-h-screen font-sans">
        <nav className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="container mx-auto flex justify-between items-center p-4">
            <Link to="/" className="text-2xl font-bold text-light-primary dark:text-dark-primary transition-colors duration-300">
              App React & Spring
            </Link>
            <div className="flex items-center space-x-6">
              <NavLink to="/home" className={getNavLinkClasses}>
                Inicio
              </NavLink>

              {!currentUser ? (
                <>
                  <NavLink to="/login" className={getNavLinkClasses}>
                    Login
                  </NavLink>
                  <NavLink to="/register" className={getNavLinkClasses}>
                    Registro
                  </NavLink>
                </>
              ) : (
                <>
                  {/* Solo muestra 'Usuario' si tiene ROLE_USER (y no es admin exclusivo) */}
                  {isUser && (
                    <NavLink to="/user" className={getNavLinkClasses}>
                      Usuario
                    </NavLink>
                  )}

                  {/* Solo muestra Admin si es administrador */}
                  {isAdmin && (
                    <NavLink to="/admin" className={getNavLinkClasses}>
                      Admin
                    </NavLink>
                  )}

                  <button
                    onClick={logOut}
                    className="bg-light-danger/10 text-light-danger hover:bg-light-danger/20 dark:bg-dark-danger/20 dark:text-dark-danger dark:hover:bg-dark-danger/30 font-bold py-2 px-4 rounded-md transition-colors duration-300 text-sm"
                  >
                    Logout
                  </button>
                </>
              )}


              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-light-text-secondary hover:text-light-primary hover:bg-slate-200 dark:text-dark-text-secondary dark:hover:text-dark-primary dark:hover:bg-dark-surface transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-6 w-6" />
                ) : (
                  <SunIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-6">
          <Routes>
            {/* Ruta publicas (sin autenticación) */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Rutas de autenticación protegidas para redirigir si ya estás logueado */}
            <Route
              path="/login"
              element={
                <ProtectedRoute redirectIfAuthenticated={true}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute redirectIfAuthenticated={true}>
                  <Register />
                </ProtectedRoute>
              }
            />

            {/* Rutas de paneles de usuario/admin (protegidas por rol) */}
            <Route
              path="/user"
              element={
                <ProtectedRoute requiredRole="ROLE_USER">
                  <UserBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <AdminBoard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={
              <div className="text-center p-10">
                <h2 className="text-4xl font-bold text-light-text dark:text-dark-text">404 - Página no encontrada</h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mt-4">Lo sentimos, la página que buscas no existe.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;