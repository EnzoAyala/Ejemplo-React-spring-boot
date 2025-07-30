import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Importa los iconos de menú y cierre
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

  // Estado para el menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    window.location.href = '/home'; // Redirige a home tras logout
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getNavLinkClasses = ({ isActive }) =>
    `transition-colors duration-300 font-medium ${
      isActive
        ? 'text-light-primary dark:text-dark-primary'
        : 'text-light-text-secondary hover:text-light-primary dark:text-dark-text-secondary dark:hover:text-dark-primary'
    }`;

  // Alterna el menú móvil
  const handleToggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Cierra menú móvil al hacer click en enlace
  const handleCloseMobileMenu = () => setMobileMenuOpen(false);

  return (
    <Router>
      <div className="min-h-screen font-sans bg-light-surface dark:bg-dark-surface transition-colors duration-300">
        <header className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="container mx-auto flex justify-between items-center p-4">
            <Link
              to="/"
              className="text-2xl font-bold text-light-primary dark:text-dark-primary transition-colors duration-300"
              onClick={handleCloseMobileMenu}
            >
              App React & Spring
            </Link>

            {/* Menú desktop */}
            <nav className="hidden md:flex items-center space-x-6">
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
                  {isUser && (
                    <NavLink to="/user" className={getNavLinkClasses}>
                      Usuario
                    </NavLink>
                  )}
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
            </nav>

            {/* Botón menú móvil */}
            <button
              onClick={handleToggleMobileMenu}
              className="md:hidden p-2 rounded-md text-light-text-secondary hover:text-light-primary hover:bg-slate-200 dark:text-dark-text-secondary dark:hover:text-dark-primary dark:hover:bg-dark-surface transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Menú móvil desplegable */}
          {mobileMenuOpen && (
            <nav className="md:hidden bg-light-surface dark:bg-dark-surface border-t border-slate-200/80 dark:border-slate-700/80 shadow-inner py-4 px-6 space-y-4 transition-colors duration-300">
              <NavLink
                to="/home"
                className={getNavLinkClasses + ' block'}
                onClick={handleCloseMobileMenu}
              >
                Inicio
              </NavLink>

              {!currentUser ? (
                <>
                  <NavLink
                    to="/login"
                    className={getNavLinkClasses + ' block'}
                    onClick={handleCloseMobileMenu}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={getNavLinkClasses + ' block'}
                    onClick={handleCloseMobileMenu}
                  >
                    Registro
                  </NavLink>
                </>
              ) : (
                <>
                  {isUser && (
                    <NavLink
                      to="/user"
                      className={getNavLinkClasses + ' block'}
                      onClick={handleCloseMobileMenu}
                    >
                      Usuario
                    </NavLink>
                  )}
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      className={getNavLinkClasses + ' block'}
                      onClick={handleCloseMobileMenu}
                    >
                      Admin
                    </NavLink>
                  )}
                  <button
                    onClick={() => {
                      logOut();
                      handleCloseMobileMenu();
                    }}
                    className="w-full text-left bg-light-danger/10 text-light-danger hover:bg-light-danger/20 dark:bg-dark-danger/20 dark:text-dark-danger dark:hover:bg-dark-danger/30 font-bold py-2 px-4 rounded-md transition-colors duration-300 text-sm"
                  >
                    Logout
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  toggleTheme();
                  handleCloseMobileMenu();
                }}
                className="w-full flex justify-center p-2 rounded-full text-light-text-secondary hover:text-light-primary hover:bg-slate-200 dark:text-dark-text-secondary dark:hover:text-dark-primary dark:hover:bg-dark-surface transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-6 w-6" />
                ) : (
                  <SunIcon className="h-6 w-6" />
                )}
              </button>
            </nav>
          )}
        </header>

        <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 max-w-8xl mx-auto">
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

            <Route
              path="*"
              element={
                <div className="text-center p-10">
                  <h2 className="text-4xl font-bold text-light-text dark:text-dark-text">
                    404 - Página no encontrada
                  </h2>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary mt-4">
                    Lo sentimos, la página que buscas no existe.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
